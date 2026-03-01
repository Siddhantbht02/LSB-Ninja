import wave
import io

class AudioStegoService:
    DELIMITER = b"====END===="

    @staticmethod
    def _bytes_to_binary(data: bytes) -> str:
        return ''.join(format(b, '08b') for b in data)

    @staticmethod
    def _binary_to_bytes(binary_str: str) -> bytes:
        byte_chunks = [binary_str[i: i+8] for i in range(0, len(binary_str), 8)]
        return bytes([int(b, 2) for b in byte_chunks if len(b) == 8])

    @staticmethod
    def encode(audio_bytes: bytes, secret_data: bytes) -> bytes:
        """
        Takes raw WAV audio bytes and AES-encrypted secret data bytes.
        Appends a delimiter, converts to binary, and embeds into the LSBs of the audio frames.
        Returns the encoded WAV audio bytes.
        """
        audio = wave.open(io.BytesIO(audio_bytes), 'rb')
        frame_bytes = bytearray(list(audio.readframes(audio.getnframes())))

        full_payload = secret_data + AudioStegoService.DELIMITER
        binary_payload = AudioStegoService._bytes_to_binary(full_payload)

        # Check capacity
        max_bytes = len(frame_bytes) // 8
        if len(full_payload) > max_bytes:
            raise ValueError(f"Payload too large. Max capacity is {max_bytes} bytes.")

        data_idx = 0
        data_len = len(binary_payload)

        for i in range(len(frame_bytes)):
            if data_idx < data_len:
                # Clear LSB and set to the payload bit
                frame_bytes[i] = (frame_bytes[i] & 254) | int(binary_payload[data_idx])
                data_idx += 1
            else:
                break

        # Write back to newly constructed WAV bytes
        encoded_audio_io = io.BytesIO()
        with wave.open(encoded_audio_io, 'wb') as encoded_audio:
            encoded_audio.setparams(audio.getparams())
            encoded_audio.writeframes(bytes(frame_bytes))
            
        audio.close()
        return encoded_audio_io.getvalue()

    @staticmethod
    def decode(audio_bytes: bytes) -> bytes:
        """
        Extracts LSBs from the audio frames until the delimiter is found.
        Returns the raw extracted bytes (which will be AES ciphertext).
        """
        audio = wave.open(io.BytesIO(audio_bytes), 'rb')
        frame_bytes = bytearray(list(audio.readframes(audio.getnframes())))
        
        binary_data = ""
        delimiter_bin = AudioStegoService._bytes_to_binary(AudioStegoService.DELIMITER)

        for byte in frame_bytes:
            binary_data += str(byte & 1)
            
            # Optimization check
            if len(binary_data) >= len(delimiter_bin) and len(binary_data) % 8 == 0:
                if binary_data.endswith(delimiter_bin):
                    extracted_bin = binary_data[:-len(delimiter_bin)]
                    return AudioStegoService._binary_to_bytes(extracted_bin)

        raise ValueError("No hidden data found or audio is corrupted (missing delimiter).")