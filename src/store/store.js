import { applyMiddleware, combineReducers, createStore } from 'redux';
import { weatherReducer } from '../reducers/weatherReducer';
import { thunk } from 'redux-thunk';
import { loadFromLocalStorage, saveToLocalStorage } from './localStore';

const persistedState = loadFromLocalStorage();

const rootReducer = combineReducers({
    weatherState: weatherReducer,
});

const store = createStore(rootReducer, persistedState, applyMiddleware(thunk));

store.subscribe(() => saveToLocalStorage(store.getState()));
export default store;
