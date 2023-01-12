import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import logo from '../logo.svg';

function Header() {

    return (
        <AppBar component="nav">
            <Toolbar>
                <Box
                    component="img"
                    sx={{ height: 64 }}
                    alt="Ein Logo eines Zuges"
                    src={logo}
                />
                <Typography
                    variant="h6"
                    component="h1"
                    sx={{ ml: 1 }}
                >
                    mit dem Zug
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;