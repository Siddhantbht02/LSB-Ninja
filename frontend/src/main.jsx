import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider, experimental_extendTheme as extendTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Configure a beautiful Material 3 Theme
const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: { main: '#6750A4' },
                secondary: { main: '#625B71' },
                background: { default: '#F8F6F9', paper: '#FFFBFE' },
            },
        },
        dark: {
            palette: {
                primary: { main: '#D0BCFF' },
                secondary: { main: '#CCC2DC' },
                background: { default: '#141218', paper: '#1C1B1F' },
            },
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', borderRadius: 20 },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { borderRadius: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <App />
        </CssVarsProvider>
    </React.StrictMode>,
)
