import cv2
import numpy as np

class ImageStegoService:
    DELIMITER = b"====END===="

    @staticmethod
    def _bytes_to_binary(data: bytes) -> str:
        return ''.join(format(b, '08b') for b in data)

    @staticmethod
    def _binary_to_bytes(binary_str: str) -> bytes:
        byte_chunks = [binary_str[i: i+8] for i in range(0, len(binary_str), 8)]
        return bytes([int(b, 2) for b in byte_chunks if len(b) == 8])

    @staticmethod
    def encode(image_bytes: bytes, secret_data: bytes) -> bytes:
        """
        Takes raw image bytes and the AES-encrypted secret data bytes.
        Appends a delimiter, converts to binary, and embeds into the LSBs of the image array.
        Returns the encoded image bytes as PNG.
        """
        # Convert image bytes to NumPy array for OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Invalid image file.")

        full_payload = secret_data + ImageStegoService.DELIMITER
        binary_payload = ImageStegoService._bytes_to_binary(full_payload)
        
        # Check capacity: rows * cols * 3 channels
        max_bytes = img.shape[0] * img.shape[1] * 3 // 8
        if len(full_payload) > max_bytes:
            raise ValueError(f"Payload too large. Max capacity is {max_bytes} bytes.")

        data_len = len(binary_payload)
        data_idx = 0

        for row in img:
            for pixel in row:
                for channel in range(3):
                    if data_idx < data_len:
                        # Clear the LSB and set it to the payload bit
                        # Use 254 (11111110 in binary) to clear the LSB instead of ~1 to avoid uint8 overflow
                        pixel[channel] = (int(pixel[channel]) & 254) | int(binary_payload[data_idx])
                        data_idx += 1
                    else:
                        break
                if data_idx >= data_len:
                    break
            if data_idx >= data_len:
                break

        # Encode back to PNG bytes to preserve lossless LSBs
        success, encoded_img = cv2.imencode('.png', img)
        if not success:
            raise RuntimeError("Failed to encode image to PNG.")
            
        return encoded_img.tobytes()

    @staticmethod
    def decode(image_bytes: bytes) -> bytes:
        """
        Extracts LSBs from the image until the delimiter is found.
        Returns the raw extracted bytes (which will be AES ciphertext).
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Invalid image file.")

        binary_data = ""
        delimiter_bin = ImageStegoService._bytes_to_binary(ImageStegoService.DELIMITER)
        
        for row in img:
            for pixel in row:
                for channel in range(3):
                    binary_data += str(pixel[channel] & 1)

                    # Performance optimization: check for delimiter periodically
                    # A byte is 8 bits, so check when length is a multiple of 8
                    if len(binary_data) >= len(delimiter_bin) and len(binary_data) % 8 == 0:
                        if binary_data.endswith(delimiter_bin):
                            # Remove the delimiter bits
                            extracted_bin = binary_data[:-len(delimiter_bin)]
                            return ImageStegoService._binary_to_bytes(extracted_bin)
                            
        raise ValueError("No hidden data found or image is corrupted (missing delimiter).")
