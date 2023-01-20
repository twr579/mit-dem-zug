import { act, fireEvent, render, screen } from '@testing-library/react';
import StationAutocomplete from '../components/coverPaper/selectStationAndTimeLimitForm/stationAutocomplete';

describe("<StationAutocomplete />", () => {
    it("Should change input value after typing 'Berlin Hau'", async () => {
        render(
            <StationAutocomplete />
        );

        // Make sure autocomplete options don't already exist
        expect(screen.queryByText(/Berlin Hauptbahnhof/)).not.toBeInTheDocument();

        const autocomplete = screen.getByRole("combobox");
        const input = screen.getByLabelText(/input/).querySelector('input');

        // Change the input value and ensure it changes
        act(() => {
            autocomplete.focus();
            fireEvent.change(input, { target: { value: 'Berlin Hau' } });
        })
        expect(input).toHaveValue("Berlin Hau");
    });
});