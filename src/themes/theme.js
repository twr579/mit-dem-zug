import { createTheme } from '@mui/material/styles';
import { blueGrey, grey } from '@mui/material/colors';

export const appTheme = createTheme({
    palette: {
        background: {
            default: grey[300],
        },
        primary: {
            main: blueGrey[300],
        },
    },
    typography: {
        fontFamily: [
            '"Courier New"',
            'Courier',
            '"Lucida Sans Typewriter"',
            '"Lucida Typewriter"',
            'monospace'
        ].join(','),
        h6: {
            fontWeight: 1000,
        }
    },
});