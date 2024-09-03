import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import HTTPException

# Initialize the S3 client with your Cloudflare R2 credentials
s3 = boto3.client(
    "s3",
    endpoint_url="https://7e5609be6e14abf45b63106826009ae7.r2.cloudflarestorage.com",
    aws_access_key_id="b5c5ccd7199ddddc6e1430add3d4cf9b",
    aws_secret_access_key="9e2705a81d58746d12bdf6511b5e291a2f1001121f608122e16c03156b96690f",
)

BUCKET_NAME = "captiongpt"
PUBLIC_R2_URL = "https://pub-24979299169046e881f725097c7c0e1f.r2.dev"


# Upload to R2
def upload_to_r2(file_path, object_name):
    try:
        s3.upload_file(file_path, BUCKET_NAME, object_name)
        return generate_public_url(object_name)
    except NoCredentialsError:
        raise HTTPException(
            status_code=500, detail="Cloudflare R2 credentials not available"
        )


# Download from R2 (if needed for server-side operations)
def download_from_r2(object_name, file_path):
    try:
        s3.download_file(BUCKET_NAME, object_name, file_path)
    except NoCredentialsError:
        raise HTTPException(
            status_code=500, detail="Cloudflare R2 credentials not available"
        )
    except s3.exceptions.NoSuchKey:
        raise HTTPException(status_code=404, detail="File not found in R2 storage")


def generate_public_url(object_name):
    return f"{PUBLIC_R2_URL}/{object_name}"


# This function is no longer needed for public buckets, but kept for reference
def generate_presigned_url(object_name, expiration=3600):
    try:
        response = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET_NAME, "Key": object_name},
            ExpiresIn=expiration,
        )
        return response
    except NoCredentialsError:
        raise HTTPException(
            status_code=500, detail="Cloudflare R2 credentials not available"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating presigned URL: {str(e)}"
        )
