import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import app from './reducers';
import devTools from 'remote-redux-devtools';

import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';
import { createLogger } from 'redux-logger';
import {createReactNavigationReduxMiddleware} from "react-navigation-redux-helpers";
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage'
import epgByGenresReducer from "./reducers/epgByGenresReducer";
import latestVODByGenresReducer from "./reducers/latestVODByGenresReducer";
import vodByGenresReducer from "./reducers/vodByGenresReducer";

const navMiddleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

const epicMiddleware = createEpicMiddleware(rootEpic);
let applyMiddlewares = applyMiddleware(epicMiddleware, navMiddleware);

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['nav', 'settingsReducer', 'epgByGenresReducer', 'vodByGenresReducer', 'latestVODByGenresReducer'],
    stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, app)

if (__DEV__) {
    const logger = createLogger({ collapsed: true });
    applyMiddlewares = applyMiddleware(epicMiddleware, navMiddleware, logger);
}

const enhancer = compose(
    applyMiddlewares,
    devTools(),
);


export default () => {
    let store = createStore(persistedReducer, enhancer);
    let persistor = persistStore(store)
    return {store, persistor}
};