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
                    <Typography variant="overline" sx={{ color: '#e00f00' }} fontWeight={700} gutterBottom>
                        2. Secret Data Payload
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
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
            )}

            <Box>
                <Typography variant="overline" sx={{ color: '#e00f00' }} fontWeight={700} gutterBottom>
                    {isEncode ? "3. Encryption Key" : "2. Decrypt Content"}
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
                    AES-256 Symmetric Password Key required to lock/unlock the payload.
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKeyIcon sx={{ color: '#aaa' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{ color: '#aaa' }}
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
