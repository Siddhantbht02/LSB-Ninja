import base64
import os
from cryptography.fernet import Fernet
from cryptography.fernet import InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

SALT_SIZE = 16
ITERATIONS = 100000

class EncryptionService:
    @staticmethod
    def _derive_key(password: str, salt: bytes) -> bytes:
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=ITERATIONS,
        )
        key = kdf.derive(password.encode("utf-8"))
        return base64.urlsafe_b64encode(key)

    @staticmethod
    def encrypt_data(password: str, plaintext: str) -> bytes:
        """
        Derives a key from the password, encrypts the plaintext using Fernet,
        and prepends the salt to the resulting ciphertext flag.
        Resulting binary structure: [16 bytes salt] + [fernet token]
        """
        salt = os.urandom(SALT_SIZE)
        key = EncryptionService._derive_key(password, salt)
        fernet = Fernet(key)
        token = fernet.encrypt(plaintext.encode("utf-8"))
        return salt + token

    @staticmethod
    def decrypt_data(password: str, encrypted_data: bytes) -> str:
        """
        Extracts the salt, derives the key, and attempts decryption.
        Returns the plaintext string or raises an exception.
        """
        if len(encrypted_data) <= SALT_SIZE:
             raise ValueError("Encrypted data is too short or malformed.")
             
        salt = encrypted_data[:SALT_SIZE]
        token = encrypted_data[SALT_SIZE:]
        
        key = EncryptionService._derive_key(password, salt)
        fernet = Fernet(key)
        try:
            plaintext = fernet.decrypt(token)
            return plaintext.decode("utf-8")
        except InvalidToken:
            raise ValueError("Decryption failed. Invalid password or no steganography data present.")
