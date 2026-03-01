import io
import hashlib
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.metadata import FileMetadata, FileType
from app.services.encryption_steg import EncryptionService
from app.services.image_steg import ImageStegoService

router = APIRouter(prefix="/image", tags=["image"])

@router.post("/encode")
async def encode_image(
    file: UploadFile = File(...),
    secret_text: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)  
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Must be an image.")

    image_bytes = await file.read()
    
    try:
        # 1. Encrypt Payload
        cipher_blob = EncryptionService.encrypt_data(password, secret_text)
        # 2. Embed into Image
        encoded_image_bytes = ImageStegoService.encode(image_bytes, cipher_blob)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Encoding failed: {str(e)}")
        
    # 3. Save Metadata
    file_hash = hashlib.sha256(encoded_image_bytes).hexdigest()
    metadata = FileMetadata(
        original_filename=file.filename,
        stored_filename=f"encoded_{file_hash[:10]}.png",
        file_type=FileType.IMAGE,
        file_size=len(encoded_image_bytes),
        mime_type="image/png",
        encoding_method="lsb"
    )
    db.add(metadata)
    # The transaction will be committed by the get_db generator block
    
    # 4. Stream response
    return StreamingResponse(
        io.BytesIO(encoded_image_bytes),
        media_type="image/png",
        headers={"Content-Disposition": f'attachment; filename="encoded_{file.filename}"'}
    )


@router.post("/decode")
async def decode_image(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Must be an image.")

    image_bytes = await file.read()
    
    try:
        # 1. Extract cipher blob from LSBs
        extracted_cipher = ImageStegoService.decode(image_bytes)
        # 2. Decrypt payload
        secret_text = EncryptionService.decrypt_data(password, extracted_cipher)
    except ValueError as ve:
         raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
         raise HTTPException(status_code=422, detail=f"Decoding failed: {str(e)}")

    return {"status": "success", "secret_text": secret_text}

