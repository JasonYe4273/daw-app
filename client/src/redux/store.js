import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { createBrowserHistory } from 'history';

import createRootReducer from './reducer.js';

export const browserHistory = createBrowserHistory();

// Create and export the store with the initial structure.
const store = createStore(
	createRootReducer(browserHistory),
	{
		inSession: -1,
		fetching: false,
		success: {
			show: false,
			text: 'Success!'
		},
		forms: {}
	},
	compose(
		applyMiddleware(
			thunkMiddleware,
			routerMiddleware(browserHistory),
			createLogger()
		)
	)
);

export default store;