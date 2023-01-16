import React from 'react';
import { Typography, TextField, Button, Backdrop, CircularProgress } from '@mui/material';
import StationAutocomplete from './stationAutocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { findDestinations } from '../features/destinations/destinationsSlice';
const { utcToZonedTime, format } = require('date-fns-tz')

function SelectStationAndTimeLimitForm() {
    const [station, setStation] = React.useState('');
    const [timeLimit, setTimeLimit] = React.useState('');
    const canSubmit = [station, timeLimit].every(Boolean);

    const dispatch = useDispatch();
    const status = useSelector((state) => state.destinations.status);

    // Update the time limit value, including updating it to an empty string
    const onChangeTimeLimit = (e) => {
        let value = e.target.value;

        // Don't parse the value if it's an empty string, but still update it
        if (value) {
            value = parseInt(value, 10);

            // Replace values outside of the 1-12 range with the nearest value in the range
            if (value > 12) value = 12;
            if (value < 1) value = 1;
        }

        setTimeLimit(value);
    }

    // On entering a time limit via keyboard, only allow numeric characters and backspace
    const checkIsNumericOrBackspace = (e) => {
        const regex = /[0-9]+/g;
        if (!regex.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
        }
    }

    const handleSubmit = async (e) => {
        // Get current time in Berlin and find possible destinations
        if (canSubmit) {
            try {
                const timeZone = "Europe/Berlin";
                const zonedDate = utcToZonedTime(new Date(), timeZone);
                const pattern = "yyyy-MM-dd'T'HH:mm:ss";
                const currTime = format(zonedDate, pattern, { timeZone: timeZone });
                await dispatch(findDestinations({ start: station, currTime: currTime, remainingTime: timeLimit })).unwrap();
                setStation('');
                setTimeLimit('');
            } catch (err) {
                console.error("Failed to get destinations: ", err);
            }
        }
    }

    return (
        <>
            <Typography variant="h4" component="h3">
                Du bist am <StationAutocomplete station={station} setStation={setStation} /> und hast gar nichts zu tun. Du möchtest in <TextField
                    id="standard-basic"
                    variant="standard"
                    type="number"
                    value={timeLimit}
                    inputProps={{
                        min: 1,
                        max: 12
                    }}
                    onChange={onChangeTimeLimit}
                    onKeyDown={checkIsNumericOrBackspace}
                /> Stunden oder weniger irgendwo anders sein. Wohin kannst du mit dem Zug?
            </Typography>
            <Button
                variant="outlined"
                disabled={!canSubmit}
                onClick={handleSubmit}
            >
                LOS GEHT'S!
            </Button>
            <Backdrop
                sx={{ color: "#fff" }}
                open={status === "loading"}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default SelectStationAndTimeLimitForm;