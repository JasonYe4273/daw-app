import { types } from '../actionTypes.js';

/**
 * Reducer for the 'fetching' field in the Redux store.
 */
export default function fetching(state=false, action) {
	switch(action.type) {
		case types.REFRESH_SESSION:
			// Don't set fetching for refreshing the session
			return state;
	}

	switch (action.status) {
		case types.REQUEST:
			// Set fetching to true for all requests
			return true;
		case types.SUCCESS:
		case types.FAILURE:
			// Set fetching to false for all successes and failures
			return false;
		default:
			return state;
	}
}