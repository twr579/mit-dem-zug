import { createTheme } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';

export const appTheme = createTheme({
    palette: {
        background: {
            default: blueGrey[100],
        },
        primary: {
            main: blueGrey[300],
        },
        secondary: {
            main: blueGrey[200],
        }
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
        },
    },
});