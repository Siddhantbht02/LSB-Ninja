import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => {
    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box
                component="img"
                src="/logo.png"
                alt="CryptStash Logo"
                sx={{
                    maxWidth: { xs: '90%', md: '80%' },
                    maxHeight: '40vh',
                    filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))',
                    userSelect: 'none'
                }}
            />
        </Box>
    );
};

export default Home;
