import * as React from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';

function StationAutocomplete() {
    const [station, setStation] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {
        // Don't call the API on an empty input
        if (inputValue === '') {
            setOptions(station ? [station] : []);
            return undefined;
        }

        fetch(`https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/location/${inputValue}`, {
            headers: {
                "DB-Api-Key": "0f1f41c8ad89c2f0299e66253354b0fc",
                "DB-Client-Id": "74f35008b2f0cb75d353554e071b5b0a"
            }
        })
            .then((response) => response.json())
            .then((json) => setOptions(json))
    }, [station, inputValue])

    return (
        <Autocomplete
            id="station-autocomplete"
            sx={{ display: 'inline-block', width: 200 }}
            getOptionLabel={(options) => `${options.name}`}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={station}
            noOptionsText="No locations"
            isOptionEqualToValue={(option, value) =>
                option.name === value.name
            }
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setStation(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderOption={(props, options) => (
                <Box component="li" {...props} key={options.id}>
                    {options.name}
                </Box>
            )}
            renderInput={(params) => <TextField {...params} variant="standard" />}

        />
    );
}

export default StationAutocomplete;