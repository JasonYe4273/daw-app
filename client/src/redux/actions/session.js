import fetch from 'isomorphic-fetch';

import cookie from 'js-cookie';
import { push } from 'connected-react-router';

import store from '../store.js';
//import { sendFormErr } from './forms.js';
//import { initUserInfo } from './userInfo.js';

import { types } from '../actionTypes.js';

import { serverURL, sessionJWTExpire } from '../../config.js';

/**
 * Thunk action creator for verifying sessions.
 *
 * @param {Boolean} [requestInfo] Whether to request account info as well, or just to verify.  Requesting account info should only be done on initial loading of the page.
 * @return {Boolean} Whether the user is in session.
 */
export const verifySession = requestInfo => async dispatch => {
	// Dispatch action marking start of request.
	dispatch({
		type: types.VERIFY_SESSION,
		status: types.REQUEST
	});
	
	// Load the sessionJWT cookie.
	let sessionJWT = cookie.get('sessionJWT');
	
	if (!sessionJWT) {
		// If there is no cookie, then the user is not in session; dispatch an action marking the failure and return false.
		dispatch({
			type: types.VERIFY_SESSION,
			status: types.FAILURE
		});
		
		return false;
	}

	// Otherwise, fetch from the server to verify whether the JWT is valid.
	// Use /api/account/info for info requests, and /api/account/verify for verification only.
	let fetchURL = serverURL + (requestInfo ? '/api/account/info' : '/api/account/verify');
	const response = await fetch(fetchURL, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
	
	if (response.ok) {
		if (requestInfo) {
			const json = await response.json();
			
			// Initialize all account info
			// dispatch(initUserInfo({...json.account, ...json.user}));
		}
		
		dispatch({
			type: types.VERIFY_SESSION,
			status: types.SUCCESS
		});
		
		// Refresh the session.
		await dispatch(refreshSession());
	} else {
		dispatch({
			type: types.VERIFY_SESSION,
			status: types.FAILURE
		});
	}
	
	// Return whether the session JWT was valid.
	return response.ok;
};

/**
 * Thunk action creator for refreshing sessions.
 */
export const refreshSession = () => async dispatch => {
	dispatch({
		type: types.REFRESH_SESSION,
		status: types.REQUEST
	});
	
	// Load the sessionJWT cookie.
	let sessionJWT = cookie.get('sessionJWT');
	
	if (!sessionJWT) {
		// If there is no cookie, then the user is not in session; dispatch an action marking the failure.
		dispatch({
			type: types.REFRESH_SESSION,
			status: types.FAILURE
		});
		
		return;
	}
	
	// Send a POST request to check the JWT
	const response = await fetch(serverURL + '/api/account/refresh', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
	
	if (response.ok) {
		let json = await response.json();
		
		// If the check succeeded, save the cookie.
		await cookie.set('sessionJWT', json.sessionJWT, {expires: sessionJWTExpire});
		
		// Dispatch an action to mark the success and store the session JWT.
		dispatch({
			type: types.REFRESH_SESSION,
			status: types.SUCCESS
		});
		
		// Set a session refresh to happen before the JWT expires
		setTimeout(() => {
			dispatch(refreshSession());
		}, sessionJWTExpire * 9 / 10);
	} else {
		// If the check failed, remove the cookie
		await cookie.remove('sessionJWT');
		
		// Dispatch an action to mark the failure.
		dispatch({
			type: types.REFRESH_SESSION,
			status: types.FAILURE
		});
	}
};

/**
 * Thunk action creator for logging in.
 */
export const login = (username, password) => async dispatch => {
	dispatch({
		type: types.LOGIN,
		status: types.REQUEST
	});
	
	// Send a POST request to verify the login.
	const response = await fetch(serverURL + '/api/login', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password
		})
	});
	
	if (response.ok) {
		let json = await response.json();
		
		dispatch({
			type: types.LOGIN,
			status: types.SUCCESS
		});
		
		// If the login succeeds, save the cookie.
		await cookie.set('sessionJWT', json.sessionJWT, {expires: sessionJWTExpire});
		
		// Initialize all account info in the Redux store
		// dispatch(initUserInfo(json.userInfo));
		
		// Set a session refresh to happen right before the JWT expires
		setTimeout(() => {
			dispatch(refreshSession());
		}, sessionJWTExpire * 9 / 10);
		
		dispatch(push('/home'));
	} else {
		dispatch({
			type: types.LOGIN,
			status: types.FAILURE
		});
		
		// If login fails, send an error to the form.
		/*if (response.status === 400) {
			dispatch(sendFormErr('login', 'username', 'No account with this username exists.'))
		}
		else if (response.status === 401) {
			dispatch(sendFormErr('login', 'password', 'Wrong password.'));
		}
		else {
			dispatch(sendFormErr('login', 'email', 'Unexpected error when contacting server.'))
		}*/
	}
};

/**
 * Thunk action creator for logging out.
 */
export const logout = () => async dispatch => {
	// Remove the session JWT cookie.
	await cookie.remove('sessionJWT');
	
	// Dispatch an action to reset the redux store to be blank.
	dispatch({
		type: types.RESET
	});
	
	// Dispatch an action to refresh the session, and then push to front page.
	dispatch({
		type: types.LOGOUT
	});
	
	dispatch(push('/'));
};

/**
 * Redux Thunk action for creating an account.
 */
export const createAccount = (username, email, password) => async dispatch => {
	dispatch({
		type: types.CREATE_ACCOUNT,
		status: types.REQUEST
	});
	
	// Send a POST request to create the account.
	const response = await fetch(serverURL + '/api/createAccount', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			email,
			password
		})
	});
	
	if (response.ok) {
		// Initialize all of the information from the server.
		let json = await response.json();
		// dispatch(initUserInfo({...json.account, ...json.user}));
		
		// Store the session JWT as a cookie.
		await cookie.set('sessionJWT', json.sessionJWT);
		
		// Refresh the session and push to the account page.
		await dispatch(verifySession());
		dispatch(push('/home'));
		
		dispatch({
			type: types.CREATE_ACCOUNT,
			status: types.SUCCESS,
			successText: 'Account Created!'
		});
	} else if (response.status === httpStatus.conflict) {
		// If the account is not created successfully, dispatch an action to inform the user that the email has been taken.
		// dispatch(sendFormErr('createAccount', 'email', 'This email has been taken.'));
		
		dispatch({
			type: types.CREATE_ACCOUNT,
			status: types.FAILURE
		});
	}
};