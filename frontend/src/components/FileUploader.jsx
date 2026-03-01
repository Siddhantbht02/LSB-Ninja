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
                <Typography variant="overline" color="primary" fontWeight={700} gutterBottom>
                    1. Cover Carrier
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
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
                    sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="overline" color="primary" fontWeight={700} gutterBottom>
                1. Carrier File
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
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
                    border: `2px dashed ${file ? theme.palette.success.main : theme.palette.primary.main}`,
                    bgcolor: file ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.primary.main, 0.04),
                    borderRadius: 4,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        bgcolor: file ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.primary.main, 0.08)
                    }
                }}
            >
                {file ? (
                    <>
                        <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6" color="success.main">{file.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change</Typography>
                    </>
                ) : (
                    <>
                        <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
                        <Typography variant="h6" color="primary">Click or drag {mode} file to upload</Typography>
                        <Typography variant="body2" color="text.secondary">Supports {getAcceptTypes()}</Typography>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default FileUploader;
