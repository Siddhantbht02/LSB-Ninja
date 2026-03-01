import React from 'react';
import { Box, Typography, TextField, InputAdornment, Tooltip, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const SecurityInput = ({ isEncode, secret, setSecret, password, setPassword }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <Box display="flex" flexDirection="column" gap={4}>
            {isEncode && (
                <Box>
                    <Typography variant="overline" color="primary" fontWeight={700} gutterBottom>
                        2. Secret Data Payload
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        The private message you want to encrypt and embed into the carrier layer.
                    </Typography>
                    <TextField
                        multiline
                        fullWidth
                        minRows={3}
                        variant="outlined"
                        placeholder="Write your secret..."
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                    />
                </Box>
            )}

            <Box>
                <Typography variant="overline" color="primary" fontWeight={700} gutterBottom>
                    {isEncode ? "3. Encryption Key" : "2. Decrypt Content"}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    AES-256 Symmetric Password Key required to lock/unlock the payload.
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ bgcolor: 'background.default' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKeyIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
        </Box>
    );
};

export default SecurityInput;
