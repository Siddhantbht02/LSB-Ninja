import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';

const StegoTabs = ({ activeTab, onTabChange }) => {
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
                value={activeTab}
                onChange={(_, val) => onTabChange(val)}
                centered
                TabIndicatorProps={{ sx: { height: 4, borderRadius: '4px 4px 0 0' } }}
            >
                <Tab
                    icon={<LockIcon />} iconPosition="start"
                    label="Encode Secret"
                    sx={{ fontWeight: 600, fontSize: '1.05rem', minWidth: 200 }}
                />
                <Tab
                    icon={<LockOpenIcon />} iconPosition="start"
                    label="Decode Secret"
                    sx={{ fontWeight: 600, fontSize: '1.05rem', minWidth: 200 }}
                />
            </Tabs>
        </Box>
    );
};

export default StegoTabs;
