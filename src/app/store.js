import { configureStore } from '@reduxjs/toolkit'
import destinationsReducer from '../features/destinations/destinationsSlice';

export default configureStore({
    reducer: {
        destinations: destinationsReducer,
    },
})