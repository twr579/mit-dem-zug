import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import destinationsReducer from '../features/destinations/destinationsSlice';
import SelectStationAndTimeLimitForm from '../components/coverPaper/selectStationAndTimeLimitForm/selectStationAndTimeLimitForm';

describe("<SelectStationAndTimeLimitForm />", () => {
    it("Should have a disabled submit button if any inputs are empty", async () => {
        const initialState = { destinations: [], show: 3, status: 'idle' };
        const store = configureStore({ reducer: { destinations: destinationsReducer }, initialState });
        render(
            <Provider store={store}>
                <SelectStationAndTimeLimitForm />
            </Provider>
        );

        const submit = screen.getByText(/LET'S GO!/);

        // Make sure button is disabled
        expect(submit).toBeDisabled();

        const hours = screen.getByLabelText(/hours/).querySelector('input');
        const minutes = screen.getByLabelText(/minutes/).querySelector('input');

        // Set time limit fields
        act(() => {
            fireEvent.change(hours, { target: { value: 1 } });
            fireEvent.change(minutes, { target: { value: 1 } });
        })

        expect(hours).toHaveValue(1);
        expect(minutes).toHaveValue(1);

        // Make sure button is disabled
        expect(submit).toBeDisabled();

        const autocompleteInput = screen.getByLabelText(/input/).querySelector('input');

        // Set autocomplete input but don't select a value
        act(() => {
            fireEvent.change(autocompleteInput, {
                target: { value: "Berlin Hau" }
            })
        });

        // Make sure button is disabled
        expect(submit).toBeDisabled();
    });
});