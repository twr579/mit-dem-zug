import React from 'react';
import { Stack, Typography, Paper, Grid, Box, Chip, Button } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useDispatch, useSelector } from 'react-redux';
import DestinationMoreDetails from './destinationMoreDetails/destinationMoreDetails';
import { showMore } from '../../features/destinations/destinationsSlice';

const { formatInTimeZone } = require('date-fns-tz')

function DestinationsList() {
    const dispatch = useDispatch();
    const destinations = useSelector((state) => state.destinations.destinations);
    const show = useSelector((state) => state.destinations.show);

    return (
        destinations.length > 0 &&
        <Stack id="destinations-list" sx={{ bgcolor: 'background.paper', my: 2 }}>
            <Paper variant="outlined" square sx={{ p: 2 }}>
                <Typography variant="h2" textAlign="center">
                    STATIONEN({destinations.length})
                </Typography>
            </Paper>
            {
                destinations.slice(0, show).map((dest) => {
                    const timeZone = "Europe/Berlin";
                    const pattern = "HH:mm";
                    const depString = formatInTimeZone(new Date(dest.departure), timeZone, pattern);
                    const arrString = formatInTimeZone(new Date(dest.arrival), timeZone, pattern);
                    const totalString = Math.floor(dest.total / 60) + "h " + (dest.total % 60) + "min";
                    const timeString = depString + "-" + arrString + " | " + totalString;
                    return (
                        <Paper key={dest.id} variant="outlined" square sx={{
                            p: 2,
                            m: 'auto',
                            flexGrow: 1,
                            width: '100%'
                        }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item sm={12} md={6}>
                                    {dest.photo ? <Box
                                        component="img"
                                        sx={{
                                            m: 'auto',
                                            display: 'block',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                        }}
                                        alt={dest.name}
                                        src={dest.photo}
                                    />
                                        :
                                        <Paper variant="outlined" square sx={{ width: '100%', px: 4, py: '20%' }}>
                                            <Typography variant="h3" color="primary.main" textAlign="center">
                                                Foto wird nicht gefunden
                                            </Typography>
                                        </Paper>
                                    }
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <Typography variant="h2">{dest.name}</Typography>
                                    <Chip
                                        icon={<ScheduleIcon />}
                                        color="secondary"
                                        label={timeString}
                                        sx={{ my: 1, width: 'fit-content', boxShadow: '1px 1px 1px black' }}
                                    />
                                    <DestinationMoreDetails route={dest.route} />
                                </Grid>
                            </Grid>
                        </Paper>
                    );
                })
            }
            {
                show < destinations.length && (
                    <Button onClick={() => dispatch(showMore())}>
                        Load more
                    </Button>
                )
            }
        </Stack >
    );
}

export default DestinationsList;