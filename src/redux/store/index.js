import {createStore, applyMiddleware, compose} from 'redux';
import reducers from '../reducer';
import persistStore from "redux-persist/es/persistStore";
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers,composeEnhancers(applyMiddleware(...middlewares)));
export const persistor = persistStore(store);

