import io
import hashlib
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.metadata import FileMetadata, FileType
from app.services.encryption_steg import EncryptionService
from app.services.audio_steg import AudioStegoService

router = APIRouter(prefix="/audio", tags=["audio"])

@router.post("/encode")
async def encode_audio(
    file: UploadFile = File(...),
    secret_text: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)  
):
    if not (file.content_type == "audio/wav" or file.content_type == "audio/x-wav"):
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Must be a WAV audio file.")

    audio_bytes = await file.read()
    
    try:
        # 1. Encrypt Payload
        cipher_blob = EncryptionService.encrypt_data(password, secret_text)
        # 2. Embed into Audio
        encoded_audio_bytes = AudioStegoService.encode(audio_bytes, cipher_blob)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Audio encoding failed: {str(e)}")
        
    # 3. Save Metadata
    file_hash = hashlib.sha256(encoded_audio_bytes).hexdigest()
    metadata = FileMetadata(
        original_filename=file.filename,
        stored_filename=f"encoded_{file_hash[:10]}.wav",
        file_type=FileType.AUDIO,
        file_size=len(encoded_audio_bytes),
        mime_type="audio/wav",
        encoding_method="lsb"
    )
    db.add(metadata)
    
    # 4. Stream response
    return StreamingResponse(
        io.BytesIO(encoded_audio_bytes),
        media_type="audio/wav",
        headers={"Content-Disposition": f'attachment; filename="encoded_{file.filename}"'}
    )


@router.post("/decode")
async def decode_audio(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    if not (file.content_type == "audio/wav" or file.content_type == "audio/x-wav"):
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Must be a WAV audio file.")

    audio_bytes = await file.read()
    
    try:
        # 1. Extract cipher blob from LSBs
        extracted_cipher = AudioStegoService.decode(audio_bytes)
        # 2. Decrypt payload
        secret_text = EncryptionService.decrypt_data(password, extracted_cipher)
    except ValueError as ve:
         raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
         raise HTTPException(status_code=422, detail=f"Audio decoding failed: {str(e)}")

    return {"status": "success", "secret_text": secret_text}