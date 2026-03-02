import React, { useRef } from 'react';
import { Box, Typography, Button, TextField, alpha, useTheme } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FileUploader = ({ mode, isEncode, file, setFile, text, setText }) => {
    const fileInputRef = useRef(null);
    const theme = useTheme();

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const getAcceptTypes = () => {
        if (mode === 'image') return '.png,.bmp';
        if (mode === 'video') return '.mp4,.avi';
        if (mode === 'audio') return '.wav';
        return '*';
    };

    if (mode === 'text') {
        return (
            <Box>
                <Typography variant="overline" sx={{ color: '#e00f00' }} fontWeight={700} gutterBottom>
                    1. Cover Carrier
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
                    {isEncode
                        ? "Enter the normal paragraph you want your secret message hidden inside."
                        : "Paste the paragraph containing zero-width characters to extract your secret."}
                </Typography>
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    variant="outlined"
                    placeholder="..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: '#444' },
                            '&:hover fieldset': { borderColor: '#e00f00' },
                            '&.Mui-focused fieldset': { borderColor: '#e00f00' },
                        }
                    }}
                />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="overline" sx={{ color: '#e00f00' }} fontWeight={700} gutterBottom>
                1. Carrier File
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
                {isEncode
                    ? `Select the ${mode} file to hide your data inside.`
                    : `Select the encoded ${mode} file. (Must be .png, .avi or .wav lossless formats)`}
            </Typography>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept={getAcceptTypes()}
            />

            <Box
                onClick={() => fileInputRef.current.click()}
                sx={{
                    border: `2px dashed ${file ? '#10b981' : '#444'}`,
                    bgcolor: file ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        bgcolor: file ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.06)'
                    }
                }}
            >
                {file ? (
                    <>
                        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 32, mb: 0.5 }} />
                        <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 600 }}>{file.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change</Typography>
                    </>
                ) : (
                    <>
                        <CloudUploadIcon sx={{ color: '#aaa', fontSize: 36, mb: 0.5, opacity: 0.8 }} />
                        <Typography variant="h6" sx={{ color: '#fff' }}>Click or drag {mode} file to upload</Typography>
                        <Typography variant="body2" sx={{ color: '#aaa' }}>Supports {getAcceptTypes()}</Typography>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default FileUploader;
