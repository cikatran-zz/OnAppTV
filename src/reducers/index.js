import {combineReducers} from 'redux';
import nav from './appReducer'
import bannerReducer from './bannerReducer'

export default combineReducers({
  nav,
  bannerReducer
});
