import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Upload, FileText, Film, ExternalLink, Loader2 } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function VideoSubtitleTool() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [subtitleUrl, setSubtitleUrl] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [generatedSubtitlesUrl, setGeneratedSubtitlesUrl] = useState<string | null>(null)
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleCaptionsUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);
    setUploadProgress(0);
  
    if (!videoFile && !videoUrl) {
      setError("Please provide a video file or URL.");
      setIsLoading(false);
      return;
    }
  
    const formData = new FormData();
    if (videoFile) {
      formData.append('video', videoFile);
      setVideoPreviewUrl(URL.createObjectURL(videoFile));
    } else if (videoUrl) {
      formData.append('video_url', videoUrl);
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/captions/`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setResult(data);
      setGeneratedSubtitlesUrl(data.srt_file_url);
      setResultVideoUrl(data.video_file_url || videoPreviewUrl);
    } catch (error) {
      console.error('Error generating captions:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred while generating captions');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };
  
  const handleAddSubtitles = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);
    setUploadProgress(0);

    if ((!videoFile && !videoUrl) || (!subtitleUrl)) {
      setError("Please provide both video and subtitle inputs.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    if (videoFile) {
      formData.append('video', videoFile);
    } else if (videoUrl) {
      formData.append('video_url', videoUrl);
    }
    formData.append('subtitles_url', subtitleUrl);

    try {
      const response = await fetch(`${API_BASE_URL}/add-subtitles/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.video_url) {
        setResultVideoUrl(data.video_url);
      } else {
        throw new Error('No video URL received from the server');
      }
    } catch (error) {
      console.error('Error adding subtitles:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred while adding subtitles');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      simulateUploadProgress();
    }
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setUploadProgress(0), 500);
      }
    }, 200);
  };

  const handleOpenSRT = () => {
    if (generatedSubtitlesUrl) {
      window.open(generatedSubtitlesUrl, '_blank');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Video Subtitle Tool</CardTitle>
          <CardDescription>Generate or add subtitles to your videos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Subtitles</TabsTrigger>
              <TabsTrigger value="add">Add Subtitles</TabsTrigger>
            </TabsList>
            <TabsContent value="generate">
              <form onSubmit={handleCaptionsUpload} className="space-y-4">
                <div>
                  <Label htmlFor="video-upload">Upload Video</Label>
                  <div className="relative">
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="file:mr-6 file:py-0 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                    {uploadProgress > 0 && (
                      <div className="absolute bottom-0 left-0 h-1 bg-violet-500 transition-all duration-300 ease-in-out" style={{ width: `${uploadProgress}%` }}></div>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full relative overflow-hidden" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" /> Generate Subtitles
                    </>
                  )}
                  {isLoading && (
                    <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-pulse" style={{ width: '100%' }}></div>
                  )}
                </Button>
              </form>
              {result && (
                <div className="mt-4 space-y-4">
                  {videoPreviewUrl && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Video Preview:</h3>
                      <div className="relative rounded-lg overflow-hidden">
                        <video src={videoPreviewUrl} controls className="w-full">
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">Video Subtitles:</h3>
                  <div className="bg-gray-100 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap break-words">
                      {result.transcription.transcription}
                    </pre>
                  </div>
                  {generatedSubtitlesUrl && (
                    <div className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleOpenSRT}
                      >
                        <ExternalLink className="mr-2 h-4 w-4 items-center" /> Open SRT
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="add">
              <form onSubmit={handleAddSubtitles} className="space-y-4">
                <div>
                  <Label htmlFor="video-upload-add">Upload Video</Label>
                  <div className="relative">
                    <Input
                      id="video-upload-add"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-0 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                    {uploadProgress > 0 && (
                      <div className="absolute bottom-0 left-0 h-1 bg-violet-500 transition-all duration-300 ease-in-out" style={{ width: `${uploadProgress}%` }}></div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subtitle-url">Enter Subtitle URL</Label>
                  <Input
                    id="subtitle-url"
                    type="url"
                    placeholder="https://example.com/subtitles.srt"
                    value={subtitleUrl}
                    onChange={(e) => setSubtitleUrl(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full relative overflow-hidden" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Film className="mr-2 h-4 w-4" /> Add Subtitles to Video
                    </>
                  )}
                  {isLoading && (
                    <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-pulse" style={{ width: '100%' }}></div>
                  )}
                </Button>
              </form>
              {resultVideoUrl && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Result:</h3>
                  <div className="relative rounded-lg overflow-hidden">
                    <video src={resultVideoUrl} controls className="w-full">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}