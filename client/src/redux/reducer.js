import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import inSession from './reducers/inSession.js';
import fetching from './reducers/fetching.js';
import success from './reducers/success.js';

// Create and export the main reducer from combining all sub-reducers.
const createRootReducer = (history) => combineReducers({
	router: connectRouter(history),
	inSession,
	fetching,
	success
});

export default createRootReducer;