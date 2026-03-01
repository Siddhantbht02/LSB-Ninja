import React, { useState } from 'react';
import {
    Container, Typography, Box, Paper, IconButton, useTheme,
    Button, CircularProgress, Alert, Snackbar, Tooltip
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { encodeMedia, decodeMedia } from '../services/api';
import StegoTabs from '../components/StegoTabs';
import ModeToggle from '../components/ModeToggle';
import FileUploader from '../components/FileUploader';
import SecurityInput from '../components/SecurityInput';

const Dashboard = () => {
    const theme = useTheme();

    // App State
    const [tab, setTab] = useState(0); // 0 = Encode, 1 = Decode
    const [mediaMode, setMediaMode] = useState('image'); // image, video, audio, text

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
        setCoverFile(null);
        setCoverText('');
        setSecret('');
        setPassword('');
        setResultData(null);
    };

    const showToast = (msg, severity = 'error') => {
        setToast({ open: true, msg, severity });
    };

    const handleMediaToggle = (newMode) => {
        setMediaMode(newMode);
        resetForm();
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

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Hero Header */}
            <Box textAlign="center" mb={6}>
                <Tooltip title="AES-256 Enabled">
                    <IconButton sx={{ bgcolor: theme.palette.primary.main, color: 'white', mb: 2, '&:hover': { bgcolor: theme.palette.primary.dark } }}>
                        <LockIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                <Typography variant="h3" fontWeight={800} color="primary" gutterBottom>
                    StegoCore Security
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Hide secrets seamlessly across Images, Video, Audio, & Text
                </Typography>
            </Box>

            {/* Main Interactive Card */}
            <Paper elevation={0} sx={{ borderRadius: 6, p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>

                {/* Navigation */}
                <StegoTabs activeTab={tab} onTabChange={handleTabChange} />

                <Box mt={4}>
                    {/* Format Selection */}
                    <ModeToggle activeMode={mediaMode} onToggle={handleMediaToggle} />

                    {/* Configuration Form */}
                    <Box display="flex" flexDirection="column" gap={4} mt={5}>
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
                            color="primary"
                            onClick={handleAction}
                            disabled={loading}
                            sx={{ py: 2, fontSize: '1.1rem', borderRadius: 3, mt: 2 }}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={26} color="inherit" /> : (tab === 0 ? "🔒 Embed & Download" : "🔓 Extract Secret")}
                        </Button>
                    </Box>

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
            </Paper>

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
        </Container>
    );
};

export default Dashboard;
