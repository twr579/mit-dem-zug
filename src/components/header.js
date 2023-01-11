import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from '../logo.svg';

function Header() {

    return (
        <Box>
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
                        component="div"
                        sx={{ ml: 1 }}
                    >
                        mit dem Zug
                    </Typography>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </Box>
    );
}

export default Header;