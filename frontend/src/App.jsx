import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Home from './pages/Home';
import LetterGlitch from './components/LetterGlitch';
import CardNav from './components/CardNav';
import { Box } from '@mui/material';

const items = [
    { label: 'Encode', ariaLabel: 'Go to Encode page', link: '/encode' },
    { label: 'Decode', ariaLabel: 'Go to Decode page', link: '/decode' },
    { label: 'About', ariaLabel: 'Learn about CryptStash', link: '/about' }
];

function App() {
    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
                <LetterGlitch
                    glitchColors={["#434242", "#ffffff", "#e00f00", "#ffffff", "#404040"]}
                    glitchSpeed={10}
                    centerVignette={true}
                    outerVignette={false}
                    smooth={true}
                />
            </Box>

            <CardNav
                colors={['#434242', '#e00f00']}
                accentColor="#e00f00"
                items={items}
            />

            <Box sx={{ position: 'relative', zIndex: 1, height: '100vh', overflowY: 'auto' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/encode" element={<Dashboard defaultTab={0} />} />
                    <Route path="/decode" element={<Dashboard defaultTab={1} />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default App;
