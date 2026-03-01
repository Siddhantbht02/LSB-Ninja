from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError


class DecryptionFailedException(Exception):
    pass


class InvalidImageFormatException(Exception):
    pass


class CapacityExceededException(Exception):
    pass


class DelimiterNotFoundException(Exception):
    pass


class InvalidAudioFormatException(Exception):
    pass


class PayloadNotFoundException(Exception):
    pass


class InvalidTextFormatException(Exception):
    pass


class InvalidVideoFormatException(Exception):
    pass


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation error",
            "errors": exc.errors()
        }
    )


async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Database error occurred"
        }
    )


async def decryption_exception_handler(request: Request, exc: DecryptionFailedException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc)
        }
    )


async def invalid_image_exception_handler(request: Request, exc: InvalidImageFormatException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc)
        }
    )


async def capacity_exceeded_exception_handler(request: Request, exc: CapacityExceededException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc)
        }
    )


async def delimiter_not_found_exception_handler(request: Request, exc: DelimiterNotFoundException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc)
        }
    )


async def invalid_audio_exception_handler(request: Request, exc: InvalidAudioFormatException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc)
        }
    )


async def payload_not_found_exception_handler(request: Request, exc: PayloadNotFoundException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc)
        }
    )


async def invalid_text_exception_handler(request: Request, exc: InvalidTextFormatException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc)
        }
    )


async def invalid_video_exception_handler(request: Request, exc: InvalidVideoFormatException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc)
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Internal server error"
        }
    )


def setup_exception_handlers(app):
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    app.add_exception_handler(DecryptionFailedException, decryption_exception_handler)
    app.add_exception_handler(InvalidImageFormatException, invalid_image_exception_handler)
    app.add_exception_handler(CapacityExceededException, capacity_exceeded_exception_handler)
    app.add_exception_handler(DelimiterNotFoundException, delimiter_not_found_exception_handler)
    app.add_exception_handler(InvalidAudioFormatException, invalid_audio_exception_handler)
    app.add_exception_handler(PayloadNotFoundException, payload_not_found_exception_handler)
    app.add_exception_handler(InvalidTextFormatException, invalid_text_exception_handler)
    app.add_exception_handler(InvalidVideoFormatException, invalid_video_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
