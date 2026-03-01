from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EncodeResponse(BaseModel):
    success: bool
    message: str
    file_id: Optional[int] = None
    encoded_file_path: Optional[str] = None


class DecodeResponse(BaseModel):
    success: bool
    message: str
    decoded_message: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    database: str


class FileMetadataResponse(BaseModel):
    id: int
    original_filename: str
    stored_filename: str
    file_type: str
    file_size: int
    mime_type: str
    encoding_method: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
