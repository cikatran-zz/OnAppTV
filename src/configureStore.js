import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import app from './reducers';
import devTools from 'remote-redux-devtools';

import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';
import { createLogger } from 'redux-logger';
import {createReactNavigationReduxMiddleware} from "react-navigation-redux-helpers";

const navMiddleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

const epicMiddleware = createEpicMiddleware(rootEpic);
let applyMiddlewares = applyMiddleware(epicMiddleware, navMiddleware);



if (__DEV__) {
  const logger = createLogger({ collapsed: true });
  applyMiddlewares = applyMiddleware(epicMiddleware, navMiddleware, logger);
}

const enhancer = compose(
  applyMiddlewares,
  devTools(),
);

const store = createStore(app, enhancer);
export default store;