import React from 'react';
import { Box, Container, Typography, Paper, Divider, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InfoIcon from '@mui/icons-material/Info';

const About = () => {
    return (
        <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', pt: { xs: 9, md: 12 }, pb: { xs: 4, md: 0 }, px: { xs: 2, md: 3 }, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: { xs: 3, md: 5 },
                    mb: 4,
                    borderRadius: 4,
                    bgcolor: 'rgba(15, 15, 17, 0.65)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}
            >
                <Typography variant="h4" color="white" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: { xs: '1px', md: '2px' }, textAlign: 'center', mb: 1, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                    About CryptStash
                </Typography>

                <Typography variant="body1" sx={{ color: '#aaa', textAlign: 'center', mb: 3, fontSize: '1.1rem' }}>
                    A powerful, modern steganography layer for hiding encrypted data within innocent-looking media files.
                </Typography>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <Box mt={2}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                        <InfoIcon sx={{ color: '#e00f00' }} />
                        <Typography variant="h6" color="white" fontWeight={700}>What is CryptStash?</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.8 }}>
                        CryptStash is an advanced, full-stack steganography engine designed to seamlessly weave encrypted, confidential data payloads into innocent-looking media carriers. By combining robust <strong>AES-256 Cipher Block Chaining (CBC)</strong> encryption with intelligent binary manipulation, CryptStash allows users to bypass strict data filtering mechanisms entirely.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.8, mt: 1 }}>
                        Unlike standard file encryption which flags a file as "locked" or "suspicious", steganography relies on <em>Security through Obscurity</em>. An image encoded with CryptStash looks, acts, and behaves identically to the original image—meaning data can be covertly transmitted in plain sight.
                    </Typography>
                </Box>

                <Box mt={4}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <LockIcon sx={{ color: '#e00f00' }} />
                        <Typography variant="h6" color="white" fontWeight={700}>Encoding Methodologies</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.8, mb: 2 }}>
                        Before any data is embedded, the secret payload is heavily compressed and encrypted using a unique, user-provided AES-256 symmetric key. A specialized delimiter string is prepended to flag the encrypted chunk. Once prepared, the stego-engine deploys format-specific algorithms:
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2} pl={2} mb={2} sx={{ borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                        <Box>
                            <Typography variant="subtitle2" color="white" fontWeight={700}>🖼️ Image (PNG/BMP) & Video (AVI)</Typography>
                            <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.6 }}>
                                Utilizes standard <strong>Least-Significant Bit (LSB)</strong> replacement. The engine parses the raw continuous byte streams of pixel color channels (Red, Green, Blue). It strips the final, least noticeable bit of each byte and seamlessly replaces it with a bit from the cipher. Because these changes manipulate color values by mere fractions (e.g. RGB `255, 0, 0` becomes `254, 0, 0`), the human eye cannot perceive the distortion.
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="white" fontWeight={700}>🎵 Audio (WAV)</Typography>
                            <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.6 }}>
                                Audio steganography operates similarly to LSB replacement but targets the raw, uncompressed pulse-code modulation (PCM) waveform frames. The engine calculates the trailing byte frames of the audio frequencies and weaves the cipher string in, guaranteeing the audio's integrity without introducing noticeable auditory static or hissing.
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="white" fontWeight={700}>📝 Text (Zero-Width Characters)</Typography>
                            <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.6 }}>
                                Text steganography is computationally distinct. CryptStash translates the cipher payload into binary, then maps those 0s and 1s entirely into corresponding Unicode <strong>Zero-Width Non-Joiner</strong> and <strong>Zero-Width Space</strong> characters. These invisible characters are injected directly into a cover paragraph. The resulting text block looks identical to the naked eye but secretly harbors hundreds of invisible characters containing the cipher.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box mt={4}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                        <LockOpenIcon sx={{ color: '#e00f00' }} />
                        <Typography variant="h6" color="white" fontWeight={700}>Decoding & Extraction</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.8 }}>
                        The decoding pipeline reverses the matrix. When a user uploads a suspected carrier file, CryptStash scans the trailing bit layers or hidden characters hunting for the specialized delimiter string. Once located, it scrapes the interconnected cipher blocks out of the data stream. If the user provides the correct AES-256 key, the cryptographic block unlocks on the fly—unspooling the hidden secret into plaintext. If the key is incorrect, the engine aborts the decryption gracefully.
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 3, mb: 1 }} />

                <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'center' }}>
                        CryptStash is fully open source. Inspect the Python API routes or React component logic over on the GitHub repository.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<GitHubIcon />}
                        href="https://github.com/Siddhantbht02/LSB-Ninja"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            bgcolor: '#e00f00',
                            color: 'white',
                            '&:hover': { bgcolor: '#a00b00' },
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            letterSpacing: '0.5px'
                        }}
                    >
                        View Source on GitHub
                    </Button>
                </Box>

            </Paper>
        </Container>
    );
};

export default About;
