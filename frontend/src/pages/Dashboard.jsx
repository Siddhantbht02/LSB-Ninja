import React, { useState } from 'react';
import {
    Container, Typography, Box, Paper, IconButton, useTheme,
    Button, CircularProgress, Alert, Snackbar, Tooltip
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { encodeMedia, decodeMedia } from '../services/api';
import PixelCard from '../components/PixelCard';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploader from '../components/FileUploader';
import SecurityInput from '../components/SecurityInput';

const Dashboard = ({ defaultTab = 0 }) => {
    const theme = useTheme();

    // App State
    const [tab, setTab] = useState(defaultTab); // 0 = Encode, 1 = Decode

    React.useEffect(() => {
        setTab(defaultTab);
        resetForm();
    }, [defaultTab]);
    const [mediaMode, setMediaMode] = useState(null); // image, video, audio, text

    // Form State
    const [coverFile, setCoverFile] = useState(null);
    const [coverText, setCoverText] = useState('');
    const [secret, setSecret] = useState('');
    const [password, setPassword] = useState('');

    // UX State
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, msg: '', severity: 'info' });
    const [resultData, setResultData] = useState(null);

    const resetForm = () => {
        setMediaMode(null);
        setCoverFile(null);
        setCoverText('');
        setSecret('');
        setPassword('');
        setResultData(null);
    };

    const showToast = (msg, severity = 'error') => {
        setToast({ open: true, msg, severity });
    };



    const handleTabChange = (newTab) => {
        setTab(newTab);
        resetForm();
    };

    const handleAction = async () => {
        if (!password) {
            showToast('Encryption Password is required!');
            return;
        }
        if (tab === 0 && !secret) {
            showToast('A Secret Message is required to encode!');
            return;
        }

        const payloadTarget = mediaMode === 'text' ? coverText : coverFile;
        if (!payloadTarget) {
            showToast(`Please insert a valid Cover ${mediaMode === 'text' ? 'Paragraph' : 'File'}!`);
            return;
        }

        setLoading(true);
        setResultData(null);

        try {
            if (tab === 0) {
                // ENCODE
                const res = await encodeMedia(mediaMode, payloadTarget, secret, password);

                if (mediaMode === 'text') {
                    navigator.clipboard.writeText(res.stego_text);
                    showToast('Text Encoded and Copied to Clipboard!', 'success');
                } else {
                    // Download the returned blob
                    const url = window.URL.createObjectURL(new Blob([res]));
                    const link = document.createElement('a');
                    link.href = url;
                    const ext = mediaMode === 'video' ? 'avi' : mediaMode === 'audio' ? 'wav' : 'png';
                    link.setAttribute('download', `stego_output.${ext}`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    showToast(`${mediaMode.toUpperCase()} seamlessly encoded and downloaded!`, 'success');
                }
            } else {
                // DECODE
                const res = await decodeMedia(mediaMode, payloadTarget, password);
                setResultData(res.secret_text);
                showToast('Secret message successfully extracted!', 'success');
            }
        } catch (err) {
            const errMsg = err.response?.data?.detail || err.message || 'An error occurred server-side.';
            showToast(errMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!mediaMode) {
        return (
            <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', pt: { xs: 8, md: 0 }, pb: { xs: 4, md: 0 }, '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                <Typography variant="h4" color="white" fontWeight={700} textAlign="center" mb={{ xs: 2, md: 3 }} mt={{ xs: 4, md: 6 }} sx={{ letterSpacing: { xs: '1px', md: '2px' }, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                    {tab === 0 ? 'SELECT CARRIER FORMAT' : 'SELECT EXTRACTION FORMAT'}
                </Typography>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr' }} gap={{ xs: 2, md: 3 }} width="100%" maxWidth="750px" px={{ xs: 2, md: 0 }}>
                    <PixelCard variant="pink" gap={4} onClick={() => setMediaMode('image')}>
                        <div className="pixel-card-content">
                            <ImageIcon className="pixel-card-icon" />
                            <span className="pixel-card-title">Image</span>
                        </div>
                    </PixelCard>
                    <PixelCard variant="pink" gap={4} onClick={() => setMediaMode('video')}>
                        <div className="pixel-card-content">
                            <MovieIcon className="pixel-card-icon" />
                            <span className="pixel-card-title">Video</span>
                        </div>
                    </PixelCard>
                    <PixelCard variant="pink" gap={4} onClick={() => setMediaMode('audio')}>
                        <div className="pixel-card-content">
                            <AudiotrackIcon className="pixel-card-icon" />
                            <span className="pixel-card-title">Audio</span>
                        </div>
                    </PixelCard>
                    <PixelCard variant="pink" gap={4} onClick={() => setMediaMode('text')}>
                        <div className="pixel-card-content">
                            <SubtitlesIcon className="pixel-card-icon" />
                            <span className="pixel-card-title">Text</span>
                        </div>
                    </PixelCard>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', pt: { xs: 8, md: 10 }, pb: { xs: 4, md: 0 }, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <Box mt={2}>
                {/* Configuration Form */}
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        mt: 2,
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        bgcolor: 'rgba(15, 15, 17, 0.65)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Form Header */}
                    <Box display="flex" alignItems="center" mb={2} position="relative">
                        <IconButton
                            onClick={() => setMediaMode(null)}
                            sx={{ color: '#aaa', '&:hover': { color: '#fff' }, position: 'absolute', left: 0 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" color="white" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '2px', width: '100%', textAlign: 'center' }}>
                            {mediaMode} {tab === 0 ? 'ENCODING' : 'DECODING'}
                        </Typography>
                    </Box>
                    <FileUploader
                        mode={mediaMode}
                        isEncode={tab === 0}
                        file={coverFile}
                        setFile={setCoverFile}
                        text={coverText}
                        setText={setCoverText}
                    />

                    <SecurityInput
                        isEncode={tab === 0}
                        secret={secret}
                        setSecret={setSecret}
                        password={password}
                        setPassword={setPassword}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleAction}
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            borderRadius: 2,
                            mt: 1,
                            bgcolor: '#e00f00',
                            '&:hover': { bgcolor: '#a00b00' },
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                        fullWidth
                    >
                        {loading ? <CircularProgress size={26} color="inherit" /> : (tab === 0 ? "🔒 Encode Payload" : "🔓 Extract Payload")}
                    </Button>
                </Paper>

                {/* Results Output */}
                {resultData && tab === 1 && (
                    <Alert severity="success" sx={{ mt: 4, borderRadius: 2, p: 2, '& .MuiAlert-message': { width: '100%' } }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>EXTRACTED PAYLOAD:</Typography>
                        <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'rgba(255,255,255,0.8)' }}>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {resultData}
                            </Typography>
                        </Paper>
                    </Alert>
                )}

            </Box>

            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}>
                    {toast.msg}
                </Alert>
            </Snackbar>
        </Container >
    );
};

export default Dashboard;
