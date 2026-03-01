from pydantic import BaseModel, Field


class EncodeRequest(BaseModel):
    message: str = Field(..., min_length=1)
    file_type: str = Field(..., pattern="^(image|audio|video|text)$")
    encoding_method: str = Field(default="lsb")


class DecodeRequest(BaseModel):
    file_id: int
    encoding_method: str = Field(default="lsb")
