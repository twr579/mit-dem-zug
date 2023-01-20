import { render, screen } from '@testing-library/react';
import Header from '../components/header/header';

describe("<Header />", () => {
    it("Should contain text 'mit dem Zug'", async () => {
        render(
            <Header />
        );

        expect(screen.queryByText(/mit dem Zug/)).toBeInTheDocument();
    });
});