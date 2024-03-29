import React from 'react';
import { Typography, TextField, Button, Snackbar, Slide, SnackbarContent } from '@mui/material';
import StationAutocomplete from './stationAutocomplete';
import { useDispatch } from 'react-redux';
import { findDestinations } from '../../../features/destinations/destinationsSlice';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../../locales/tokens';

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}

function SelectStationAndTimeLimitForm() {
    const [station, setStation] = React.useState('');
    const [hours, setHours] = React.useState('');
    const [minutes, setMinutes] = React.useState('');
    const [openSnackbar, setOpenSnackbar] = React.useState('');
    const canSubmit = [station, hours, minutes].every((element) => { return element != null && element !== '' });

    const { t } = useTranslation();

    const dispatch = useDispatch();

    // Update the hours value, including updating it to an empty string
    const onChangeHours = (e) => {
        let value = e.target.value;

        // Don't parse the value if it's an empty string, but still update it
        if (value) {
            value = parseInt(value, 10);

            // Replace values outside of the range with the nearest value in the range
            if (value > 11) value = 11;
            if (value < 0) value = 0;
        }

        setHours(value);
    }

    // Update the minutes value, including updating it to an empty string
    const onChangeMinutes = (e) => {
        let value = e.target.value;

        // Don't parse the value if it's an empty string, but still update it
        if (value) {
            value = parseInt(value, 10);

            // Replace values outside of the range with the nearest value in the range
            if (value > 59) value = 59;
            if (value < 0) value = 0;
        }

        setMinutes(value);
    }

    // On entering a time limit via keyboard, only allow numeric characters and backspace
    const checkIsNumericOrBackspace = (e) => {
        const regex = /[0-9]+/g;
        if (!regex.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
        }
    }

    // Get current time in Berlin and find possible destinations
    const handleSubmit = async (e) => {
        if (canSubmit) {
            try {
                const timeLimit = (hours * 60) + minutes;
                const currTime = new Date();

                await dispatch(findDestinations({ start: { stationName: station.name, stationId: station.id }, currTime: currTime, remainingTime: timeLimit })).unwrap();

                // Scroll to the top of the destinations list, accounting for height of header (64px) and margin (16px)
                const destinationsList = document.getElementById("destinations-list");
                if (destinationsList) {
                    window.scrollTo({ top: destinationsList.offsetTop - 80, behavior: 'smooth' });
                } else {
                    setOpenSnackbar(t(tokens.snackbar.noResults));
                }
            } catch (err) {
                setOpenSnackbar(t(tokens.snackbar.error))
            }
        }
    }

    // Close the Snackbar
    const handleClose = () => {
        setOpenSnackbar('');
    }

    return (
        <>
            <Typography variant="h4" component="h3">
                {t(tokens.coverPaper.description.line1)}
                <StationAutocomplete station={station} setStation={setStation} />
                {t(tokens.coverPaper.description.line2)}
                <TextField
                    aria-label="hours"
                    id="standard-basic"
                    variant="standard"
                    type="number"
                    value={hours}
                    inputProps={{
                        min: 0,
                        max: 11,
                    }}
                    onInput={(e) => {
                        e.target.value = e.target.value.slice(0, 2)
                    }}
                    onChange={onChangeHours}
                    onKeyDown={checkIsNumericOrBackspace}
                />
                {" "}h{" "}
                <TextField
                    aria-label="minutes"
                    id="standard-basic"
                    variant="standard"
                    type="number"
                    value={minutes}
                    inputProps={{
                        min: 0,
                        max: 59
                    }}
                    onInput={(e) => {
                        e.target.value = e.target.value.slice(0, 2)
                    }}
                    onChange={onChangeMinutes}
                    onKeyDown={checkIsNumericOrBackspace} 
                />
                {t(tokens.coverPaper.description.line3)}
            </Typography>
            <Button
                variant="outlined"
                onClick={handleSubmit}
                disabled={!canSubmit}
            >
                {t(tokens.coverPaper.button)}
            </Button>
            <Snackbar
                open={openSnackbar !== ''}
                autoHideDuration={5000}
                onClose={handleClose}
                TransitionComponent={TransitionUp}
            >
                <SnackbarContent
                    sx={{ bgcolor: "primary.main", color: '#000' }}
                    message={openSnackbar}
                />
            </Snackbar>
        </>
    );
}

export default SelectStationAndTimeLimitForm;