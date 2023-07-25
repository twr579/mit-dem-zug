import React from 'react';
import { Stack, Paper, Box, Typography } from '@mui/material';
import logo from '../../logo.svg';
import Typewriter from 'typewriter-effect';
import SelectStationAndTimeLimitForm from './selectStationAndTimeLimitForm/selectStationAndTimeLimitForm';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../locales/tokens';

function CoverPaper() {
    const { t } = useTranslation();

    return (
        <Paper sx={{ p: 2, m: 2 }}>
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
                            strings: ["mit dem Zug", t(tokens.coverPaper.byTrain), `${t(tokens.coverPaper.by)} Tim R.`],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </Typography>
                <Box
                    component="img"
                    sx={{ height: "auto", width: "25%" }}
                    alt={t(tokens.trainLogo)}
                    src={logo}
                />
                <SelectStationAndTimeLimitForm />
            </Stack >
        </Paper >
    );
}

export default CoverPaper;