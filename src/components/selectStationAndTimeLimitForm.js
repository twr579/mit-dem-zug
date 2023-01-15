import React from 'react';
import { Typography, TextField, Button, Backdrop, CircularProgress } from '@mui/material';
import StationAutocomplete from './stationAutocomplete';

function SelectStationAndTimeLimitForm() {
    const [hours, setHours] = React.useState('');
    const [openBackdrop, setOpenBackdrop] = React.useState(false);

    return (
        <>
            <Typography variant="h4" component="h3">
                Du bist am <StationAutocomplete /> und hast gar nichts zu tun. Du möchtest in <TextField
                    id="standard-basic"
                    variant="standard"
                    type="number"
                    value={hours}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: 1,
                        max: 12
                    }}
                    onChange={(e) => {
                        // Only allow values between 1-12, and replace those outside of the range with the nearest value
                        let value = parseInt(e.target.value, 10);

                        if (value > 12) value = 12;
                        if (value < 1) value = 1;

                        setHours(value);
                    }}
                /> Stunden oder weniger irgendwo anders sein. Wohin kannst du mit dem Zug?
            </Typography>
            <Button variant="outlined" onClick={() => {
                setOpenBackdrop(true);
            }}>LOS GEHT'S!</Button>
            <Backdrop
                sx={{ color: '#fff' }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default SelectStationAndTimeLimitForm;