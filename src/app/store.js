import { combineReducers, configureStore } from '@reduxjs/toolkit'
import destinationsReducer from '../features/destinations/destinationsSlice';
import languageReducer from '../features/language/languageSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    destinations: destinationsReducer,
    language: languageReducer,
});

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
});

export const persistor = persistStore(store);
