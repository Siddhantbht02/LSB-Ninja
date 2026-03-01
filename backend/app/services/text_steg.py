class TextStegoService:
    # Zero Width Space (U+200B) for binary '0'
    ZWC_0 = '\u200b'
    # Zero Width Non-Joiner (U+200C) for binary '1'
    ZWC_1 = '\u200c'
    # Zero Width Joiner (U+200D) as the delimiter
    ZWC_DELIMITER = '\u200d'

    @staticmethod
    def _bytes_to_zwc(data: bytes) -> str:
        binary_str = ''.join(format(byte, '08b') for byte in data)
        # Map 0 -> ZWC_0, 1 -> ZWC_1
        zwc_str = ''.join(TextStegoService.ZWC_0 if bit == '0' else TextStegoService.ZWC_1 for bit in binary_str)
        return zwc_str + TextStegoService.ZWC_DELIMITER

    @staticmethod
    def _zwc_to_bytes(zwc_str: str) -> bytes:
        binary_str = ''
        for char in zwc_str:
            if char == TextStegoService.ZWC_0:
                binary_str += '0'
            elif char == TextStegoService.ZWC_1:
                binary_str += '1'
            elif char == TextStegoService.ZWC_DELIMITER:
                break
                
        if not binary_str:
            raise ValueError("No steganography data found (missing delimiter).")

        byte_chunks = [binary_str[i: i+8] for i in range(0, len(binary_str), 8)]
        return bytes([int(b, 2) for b in byte_chunks if len(b) == 8])

    @staticmethod
    def encode(cover_text: str, secret_data: bytes) -> str:
        """
        Embeds the bytes (ciphertext) into the cover text using Zero-Width Characters.
        The ZWCs are appended to the first character of the cover text to remain hidden.
        """
        if not cover_text:
            raise ValueError("Cover text cannot be empty.")
            
        zwc_payload = TextStegoService._bytes_to_zwc(secret_data)
        
        # Insert the ZWC string immediately after the first character of cover text
        return cover_text[0] + zwc_payload + cover_text[1:]

    @staticmethod
    def decode(stego_text: str) -> bytes:
        """
        Extracts ZWCs from the text and converts them back to bytes.
        """
        extracted_zwcs = ""
        found_delimiter = False
        
        for char in stego_text:
            if char in (TextStegoService.ZWC_0, TextStegoService.ZWC_1):
                extracted_zwcs += char
            elif char == TextStegoService.ZWC_DELIMITER:
                extracted_zwcs += char
                found_delimiter = True
                break
                
        if not found_delimiter:
             raise ValueError("No steganography data found or text is corrupted.")

        return TextStegoService._zwc_to_bytes(extracted_zwcs)