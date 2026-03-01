import hashlib
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.metadata import FileMetadata, FileType
from app.services.encryption_steg import EncryptionService
from app.services.text_steg import TextStegoService

router = APIRouter(prefix="/text", tags=["text"])

@router.post("/encode")
async def encode_text(
    cover_text: str = Body(..., embed=True),
    secret_text: str = Body(..., embed=True),
    password: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db)
):
    try:
        # 1. Encrypt Payload
        cipher_blob = EncryptionService.encrypt_data(password, secret_text)
        # 2. Embed into Text
        encoded_stego_text = TextStegoService.encode(cover_text, cipher_blob)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Text encoding failed: {str(e)}")
        
    # 3. Save Metadata
    # We pretend the text is a file for metadata purposes
    data_bytes = encoded_stego_text.encode("utf-8")
    file_hash = hashlib.sha256(data_bytes).hexdigest()
    
    metadata = FileMetadata(
        original_filename="text_stego.txt",
        stored_filename=f"text_{file_hash[:10]}.txt",
        file_type=FileType.TEXT,
        file_size=len(data_bytes),
        mime_type="text/plain",
        encoding_method="zwc"
    )
    db.add(metadata)
    # The transaction will be committed by the get_db generator block
    
    return {"status": "success", "stego_text": encoded_stego_text}


@router.post("/decode")
async def decode_text(
    stego_text: str = Body(..., embed=True),
    password: str = Body(..., embed=True)
):
    try:
        # 1. Extract cipher blob from ZWCs
        extracted_cipher = TextStegoService.decode(stego_text)
        # 2. Decrypt payload
        secret_text = EncryptionService.decrypt_data(password, extracted_cipher)
    except ValueError as ve:
         raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
         raise HTTPException(status_code=422, detail=f"Text decoding failed: {str(e)}")

    return {"status": "success", "secret_text": secret_text}