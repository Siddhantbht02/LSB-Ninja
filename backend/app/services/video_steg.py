import cv2
import numpy as np
import tempfile
import os

class VideoStegoService:
    DELIMITER = b"====END===="

    @staticmethod
    def _bytes_to_binary(data: bytes) -> str:
        return ''.join(format(b, '08b') for b in data)

    @staticmethod
    def _binary_to_bytes(binary_str: str) -> bytes:
        byte_chunks = [binary_str[i: i+8] for i in range(0, len(binary_str), 8)]
        return bytes([int(b, 2) for b in byte_chunks if len(b) == 8])

    @staticmethod
    def encode(video_bytes: bytes, secret_data: bytes) -> bytes:
        """
        Embeds AES ciphertext into the LSBs of video frames using OpenCV.
        Returns the encoded video as a lossless AVI file (.avi).
        """
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_input:
            temp_input.write(video_bytes)
            temp_input_path = temp_input.name
            
        temp_output_path = temp_input_path.replace('.mp4', '.avi')
        
        cap = cv2.VideoCapture(temp_input_path)
        if not cap.isOpened():
            os.remove(temp_input_path)
            raise ValueError("Could not open video file.")
            
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        # FFV1 is mathematically lossless
        fourcc = cv2.VideoWriter_fourcc(*'FFV1')
        out = cv2.VideoWriter(temp_output_path, fourcc, fps, (width, height))
        
        full_payload = secret_data + VideoStegoService.DELIMITER
        binary_payload = VideoStegoService._bytes_to_binary(full_payload)
        data_len = len(binary_payload)
        data_idx = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            if data_idx < data_len:
                # Calculate how many bits we can embed in this frame
                pixels_available = frame.size
                bits_to_embed = min(data_len - data_idx, pixels_available)
                
                # Flatten the frame for easy 1D slicing
                flat_frame = frame.flatten()
                
                # Extract the chunk of binary payload
                payload_chunk = binary_payload[data_idx:data_idx + bits_to_embed]
                payload_array = np.array(list(payload_chunk), dtype=np.uint8)
                
                # Zero out the LSB and bitwise OR with payload
                flat_frame[:bits_to_embed] = (flat_frame[:bits_to_embed] & 254) | payload_array
                
                # Reshape back to original frame dimensions and update
                frame = flat_frame.reshape(frame.shape)
                data_idx += bits_to_embed
                        
            out.write(frame)
            
        cap.release()
        out.release()
        
        if data_idx < data_len:
            if os.path.exists(temp_input_path): os.remove(temp_input_path)
            if os.path.exists(temp_output_path): os.remove(temp_output_path)
            raise ValueError("Payload too large for this video.")
            
        with open(temp_output_path, 'rb') as f:
            encoded_bytes = f.read()
            
        os.remove(temp_input_path)
        os.remove(temp_output_path)
        
        return encoded_bytes
        
    @staticmethod
    def decode(video_bytes: bytes) -> bytes:
        """
        Extracts AES ciphertext from the LSBs of a lossless AVI video file.
        """
        with tempfile.NamedTemporaryFile(delete=False, suffix='.avi') as temp_input:
            temp_input.write(video_bytes)
            temp_input_path = temp_input.name
            
        cap = cv2.VideoCapture(temp_input_path)
        if not cap.isOpened():
            os.remove(temp_input_path)
            raise ValueError("Could not open video file.")
            
        binary_data = ""
        delimiter_bin = VideoStegoService._bytes_to_binary(VideoStegoService.DELIMITER)
        
        found = False
        while cap.isOpened() and not found:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Flatten frame and quickly extract all LSBs
            flat_frame = frame.flatten()
            lsbs = flat_frame & 1
            
            # Convert arrays of 1s and 0s directly to string (faster than python loop)
            # We process frame by frame because building a massive string takes heavy RAM
            frame_binary = ''.join(lsbs.astype(str))
            binary_data += frame_binary
            
            # Find delimiter
            del_idx = binary_data.find(delimiter_bin)
            if del_idx != -1:
                # Delimiter found! We only want the data up to the delimiter
                # But it must be byte-aligned to be valid decryption data
                valid_len = del_idx - (del_idx % 8)
                extracted_bin = binary_data[:valid_len]
                cap.release()
                os.remove(temp_input_path)
                return VideoStegoService._binary_to_bytes(extracted_bin)
                                
        cap.release()
        if os.path.exists(temp_input_path): os.remove(temp_input_path)
        raise ValueError("No hidden data found or video is corrupted/lossy.")
