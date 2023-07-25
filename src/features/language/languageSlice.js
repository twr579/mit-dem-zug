import { createSlice } from '@reduxjs/toolkit';

export const languageSlice = createSlice({
    name: "language",
    initialState: "en",
    reducers: {
        changeLanguage: (_, action) => {
            return action.payload;
        },
    },
});

export const { changeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
