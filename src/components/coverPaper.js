import React from 'react';
import { Stack, Paper, Box, Typography } from '@mui/material';
import logo from '../logo.svg';
import Typewriter from 'typewriter-effect';
import SelectStationAndTimeLimitForm from './selectStationAndTimeLimitForm';

function CoverPaper() {
    return (
        <Paper sx={{ p: 5 }}>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                spacing={2}
            >
                <Typography variant="h3" component="h2">
                    <Typewriter
                        options={{
                            strings: ['mit dem Zug', 'eine Webseite von Tim R.'],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </Typography>
                <Box
                    component="img"
                    sx={{ height: 'auto', width: '25%' }}
                    alt="Ein Logo eines Zuges"
                    src={logo}
                />
                <SelectStationAndTimeLimitForm />
            </Stack >
        </Paper >
    );
}

export default CoverPaper;