from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import setup_exception_handlers
from app.api.routes import image, video, text, audio


@asynccontextmanager
async def lifespan(app: FastAPI):
    import os
    from app.db.database import engine, Base
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "encoded"), exist_ok=True)
    
    # Initialize DB models automatically if SQL file doesn't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    yield


app = FastAPI(
    title="Steganography Backend API",
    description="Multi-Format Steganography Backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://lsb-ninja-8dsfii0i9-siddhantbht02s-projects.vercel.app",
        "https://lsb-ninja.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)

app.include_router(image.router, prefix="/api/v1")
app.include_router(video.router, prefix="/api/v1")
app.include_router(text.router, prefix="/api/v1")
app.include_router(audio.router, prefix="/api/v1")

# Mount a simple frontend for testing
import os
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
os.makedirs(frontend_dir, exist_ok=True)
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "database": "connected"}
