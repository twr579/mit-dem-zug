import { render } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import destinationsReducer from './features/destinations/destinationsSlice';

test('renders without crashing', () => {
  const initialState = { destinations: [], show: 3, status: 'idle' };
  const store = configureStore({ reducer: { destinations: destinationsReducer }, initialState });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
