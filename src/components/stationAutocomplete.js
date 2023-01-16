import * as React from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { client, deutscheBahnHeaders } from '../api/client';
import { debounce } from '@mui/material/utils';

function StationAutocomplete({ station, setStation }) {
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const fetch = React.useMemo(
        () =>
            debounce((request, callback) => {
                const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/location/${request.input}`;
                client.get(url, deutscheBahnHeaders)
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
                    newOptions = [...newOptions, ...results.data];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [station, inputValue, fetch]);

    return (
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
            noOptionsText="keine Stationen"
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
    );
}

export default StationAutocomplete;