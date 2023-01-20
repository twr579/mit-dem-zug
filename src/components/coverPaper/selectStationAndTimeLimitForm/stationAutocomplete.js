import React from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { client } from '../../../api/client';
import { debounce } from '@mui/material/utils';

function StationAutocomplete({ station, setStation }) {
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const fetch = React.useMemo(
        () =>
            debounce((request, callback) => {
                const url = `https://v6.db.transport.rest/stations?query=${request.input}&results=5`;
                client.get(url)
                    .then(callback);
            }, 400),
        [],
    );

    React.useEffect(() => {
        let active = true;

        // Don't call the API on empty input
        if (inputValue === '') {
            setOptions(station ? [station] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results) => {
            if (active) {
                let newOptions = [];

                if (station) {
                    newOptions = [station];
                }

                if (results) {
                    newOptions = [...newOptions, ...Object.values(results.data)];
                }
                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [station, inputValue, fetch]);

    return (
        <>
            <Autocomplete
                id="station-autocomplete"
                sx={{ display: 'inline-block', width: 200 }}
                getOptionLabel={(option) => option.name || ""}
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={station}
                noOptionsText="No stations"
                isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                }
                onChange={(e, newValue) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setStation(newValue);
                }}
                onInputChange={(e, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderOption={(props, options) => (
                    <Box
                        component="li"
                        {...props}
                        key={options.id}
                        sx={{ wordBreak: "break-word" }}
                    >
                        {options.name}
                    </Box>
                )}
                renderInput={(params) => <TextField {...params} variant="standard" />}
            />
        </>
    );
}

export default StationAutocomplete;