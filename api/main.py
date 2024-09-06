import subprocess
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import HttpUrl
import os
import uuid
import tempfile
from typing import Optional
from openai import OpenAI
from pydub import AudioSegment
from r2 import upload_to_r2, generate_public_url
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://subtitleai.ollayor.uz","https://subtitle-ai-seven.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_CHUNK_SIZE = 25 * 1024 * 1024  # 25 MB in bytes

def download_file(url: str, output_path: str):
    response = requests.get(url)
    response.raise_for_status()
    with open(output_path, 'wb') as file:
        file.write(response.content)

def split_audio(file_path):
    audio = AudioSegment.from_file(file_path)
    chunks = []
    chunk_length = 10 * 60 * 1000  # 10 minutes in milliseconds

    while len(audio) > 0:
        chunk = audio[:chunk_length]
        chunks.append(chunk)
        audio = audio[chunk_length:]

    return chunks

@app.post("/add-subtitles/")
async def add_subtitles(
    video: Optional[UploadFile] = File(None),
    subtitles: Optional[UploadFile] = File(None),
    video_url: Optional[HttpUrl] = Form(None),
    subtitles_url: Optional[HttpUrl] = Form(None)
):
    if not ((video or video_url) and (subtitles or subtitles_url)):
        raise HTTPException(status_code=400, detail="Please provide either files or URLs for both video and subtitles")

    video_filename = f"{uuid.uuid4()}.mp4"
    subtitles_filename = f"{uuid.uuid4()}.srt"
    output_filename = f"{uuid.uuid4()}.mp4"

    with tempfile.TemporaryDirectory() as temp_dir:
        video_path = os.path.join(temp_dir, video_filename)
        subtitles_path = os.path.join(temp_dir, subtitles_filename)
        output_path = os.path.join(temp_dir, output_filename)
        
        # Handle video input
        if video:
            with open(video_path, "wb") as video_file:
                video_file.write(await video.read())
        elif video_url:
            try:
                download_file(str(video_url), video_path)
            except requests.RequestException as e:
                raise HTTPException(status_code=400, detail=f"Error downloading video: {str(e)}")

        # Handle subtitles input
        if subtitles:
            with open(subtitles_path, "wb") as subtitles_file:
                subtitles_file.write(await subtitles.read())
        elif subtitles_url:
            try:
                download_file(str(subtitles_url), subtitles_path)
            except requests.RequestException as e:
                raise HTTPException(status_code=400, detail=f"Error downloading subtitles: {str(e)}")

        # Simplified FFmpeg command
        filter_complex = (
            f"subtitles={subtitles_path}:force_style='Fontname=Helvetica,Fontsize=19,"
            f"PrimaryColour=&HFFFFFF,OutlineColour=&H000000,BackColour=&H70000000,"
            f"BorderStyle=3,Outline=1,Shadow=0,MarginV=6'"
        )

        command = [
            "ffmpeg",
            "-i", video_path,
            "-vf", filter_complex,
            "-c:a", "copy",
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            output_path
        ]
        

        try:
            result = subprocess.run(command, check=True, capture_output=True, text=True)

            # Upload the output file to R2
            r2_object_name = f"subtitled_videos/{output_filename}"
            r2_url = upload_to_r2(output_path, r2_object_name)
            public_url = generate_public_url(r2_object_name)
            print("Upload successful")
            return JSONResponse({"video_url": public_url})
        except subprocess.CalledProcessError as e:
            error_message = f"FFmpeg error:\nCommand: {' '.join(command)}\nStdout: {e.stdout}\nStderr: {e.stderr}"
            raise HTTPException(status_code=500, detail=error_message)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
            
            
@app.post("/captions/")
async def add_captions(video: UploadFile = File(...)):
    video_filename = f"{uuid.uuid4()}{os.path.splitext(video.filename)[1]}"

    with tempfile.TemporaryDirectory() as temp_dir:
        video_path = os.path.join(temp_dir, video_filename)

        # Save uploaded file temporarily
        with open(video_path, "wb") as video_file:
            video_file.write(await video.read())

        try:
            # Split audio into chunks if necessary
            audio_chunks = split_audio(video_path)
            
            full_transcription = ""
            all_segments = []

            for i, chunk in enumerate(audio_chunks):
                chunk_path = os.path.join(temp_dir, f"chunk_{i}.mp3")
                chunk.export(chunk_path, format="mp3")

                with open(chunk_path, "rb") as audio_file:
                    transcript = client.audio.transcriptions.create(
                        file=audio_file,
                        model="whisper-1",
                        response_format="verbose_json",
                        timestamp_granularities=["word", "segment"]
                    )

                full_transcription += transcript.text + " "
                all_segments.extend(transcript.segments)

            # Generate SRT content
            srt_content = ""
            for i, segment in enumerate(all_segments, start=1):
                start = segment['start']
                end = segment['end']
                text = segment['text'].strip()
                srt_content += f"{i}\n{format_time(start)} --> {format_time(end)}\n{text}\n\n"

            # Save SRT file temporarily
            srt_filename = f"{uuid.uuid4()}.srt"
            srt_path = os.path.join(temp_dir, srt_filename)
            with open(srt_path, "w", encoding="utf-8") as srt_file:
                srt_file.write(srt_content)

            # Upload the SRT file to R2
            r2_srt_object_name = f"captions/{srt_filename}"
            r2_srt_url = upload_to_r2(srt_path, r2_srt_object_name)

            # Upload the video file to R2
            r2_video_object_name = f"videos/{video_filename}"
            r2_video_url = upload_to_r2(video_path, r2_video_object_name)

            return {
                "transcription": {"transcription": full_transcription.strip()},
                "srt_file_url": r2_srt_url,
                "video_file_url": r2_video_url
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

def format_time(seconds):
    hours = int(seconds / 3600)
    minutes = int((seconds % 3600) / 60)
    seconds = seconds % 60
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{int(seconds):02d},{milliseconds:03d}"