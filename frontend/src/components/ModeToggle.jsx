import React from 'react';
import { ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import SubtitlesIcon from '@mui/icons-material/Subtitles';

const ModeToggle = ({ activeMode, onToggle }) => {
    return (
        <Box textAlign="center" mb={4}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1.5 }}>
                SELECT MEDIA FORMAT
            </Typography>
            <ToggleButtonGroup
                value={activeMode}
                exclusive
                onChange={(_, val) => val && onToggle(val)}
                aria-label="media format"
                color="primary"
                sx={{
                    bgcolor: 'background.default',
                    p: 0.5,
                    borderRadius: 4,
                    '& .MuiToggleButtonGroup-grouped': {
                        border: 0,
                        borderRadius: '12px !important',
                        mx: 0.5,
                        px: 2.5,
                        py: 1,
                        fontWeight: 600,
                        textTransform: 'none'
                    }
                }}
            >
                <ToggleButton value="image"><ImageIcon sx={{ mr: 1 }} /> Image</ToggleButton>
                <ToggleButton value="video"><MovieIcon sx={{ mr: 1 }} /> Video</ToggleButton>
                <ToggleButton value="audio"><AudiotrackIcon sx={{ mr: 1 }} /> Audio</ToggleButton>
                <ToggleButton value="text"><SubtitlesIcon sx={{ mr: 1 }} /> Text</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default ModeToggle;
