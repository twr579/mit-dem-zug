import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import logo from '../../logo.svg';
import LanguagePicker from './languagePicker';

function Header() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar component="nav">
                <Toolbar>
                    <Box
                        component="img"
                        sx={{ height: 64, mr: 1 }}
                        alt="Train logo"
                        src={logo}
                    />
                    <Typography
                        variant="h6"
                        component="h1"
                        sx={{ flexGrow: 1 }}
                    >
                        mit dem Zug
                    </Typography>
                    <LanguagePicker />
                </Toolbar>
            </AppBar>
        </Box >
    );
}

export default Header;