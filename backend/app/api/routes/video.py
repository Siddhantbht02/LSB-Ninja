import io
import hashlib
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.metadata import FileMetadata, FileType
from app.services.encryption_steg import EncryptionService
from app.services.video_steg import VideoStegoService

router = APIRouter(prefix="/video", tags=["video"])

@router.post("/encode")
async def encode_video(
    file: UploadFile = File(...),
    secret_text: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)  
):
    if not (file.filename.endswith(".mp4") or file.filename.endswith(".avi")):
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Must be an MP4 or AVI video file.")

    video_bytes = await file.read()
    
    try:
        # 1. Encrypt Payload
        cipher_blob = EncryptionService.encrypt_data(password, secret_text)
        # 2. Embed into Video frames
        encoded_video_bytes = VideoStegoService.encode(video_bytes, cipher_blob)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Video encoding failed: {str(e)}")
        
    # 3. Save Metadata
    file_hash = hashlib.sha256(encoded_video_bytes).hexdigest()
    metadata = FileMetadata(
        original_filename=file.filename,
        stored_filename=f"encoded_{file_hash[:10]}.avi",
        file_type=FileType.VIDEO,
        file_size=len(encoded_video_bytes),
        mime_type="video/x-msvideo",
        encoding_method="lsb"
    )
    db.add(metadata)
    
    # 4. Stream response
    download_name = file.filename.rsplit('.', 1)[0] + ".avi"
    return StreamingResponse(
        io.BytesIO(encoded_video_bytes),
        media_type="video/x-msvideo",
        headers={"Content-Disposition": f'attachment; filename="stego_{download_name}"'}
    )


@router.post("/decode")
async def decode_video(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    if not (file.filename.endswith(".avi") or file.filename.endswith(".mp4")):
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Target must be an AVI file.")

    video_bytes = await file.read()
    
    try:
        # 1. Extract cipher blob from LSBs
        extracted_cipher = VideoStegoService.decode(video_bytes)
        # 2. Decrypt payload
        secret_text = EncryptionService.decrypt_data(password, extracted_cipher)
    except ValueError as ve:
         raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
         raise HTTPException(status_code=422, detail=f"Video decoding failed: {str(e)}")

    return {"status": "success", "secret_text": secret_text}
