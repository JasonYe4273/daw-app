import _ from 'lodash';
import httpStatus from 'http-status-codes';

// Note: only use next() if you are not handling the request!

/**
 * Builds the initial Redux store JSON object for the client side.
 *
 * @param id
 * @param [user]
 * @param [account]
 * @return {Promise.<{
 *     account: {email: String, username: String},
 *     sessionJWT: String
 * }>}
 */
export const buildInitialStore = async (id, account) => {
	account = account || await models.account.find({
		where: {
			user: id
		}
	});
	
	let store = {};
	
	store.account = _.pick(account, ['email', 'username']);
	store.sessionJWT = createSessionToken(id);
	
	return store;
};

/**
 * @param {{body: {
 *     username: String,
 *     email: String,
 *     password: String
 * }}} request
 * @param response
 */
export const createAccount = async (request, response) => {
	let account = await models.account.find({
		where: {
			email: request.body.email
		}
	});
	
	if (account) {
		// Email already exists.
		response.status(httpStatus.CONFLICT).end();
	} else {
		// OK
		let account = await models.account.create({
			username: request.body.username,
			email: request.body.email,
			password: request.body.password
		});
		
		let store = await buildInitialStore(account.id, account);
		
		response.status(httpStatus.OK).json(store);
	}
};

/**
 * This method will send UNAUTHORIZED if email and password do not match, and BAD_REQUEST if email is not in the database.
 *
 * @param {{body: {email: String, password: String}}} request
 * @param response
 * @return {Promise.<void>}
 */
export const verifyLogin = async (request, response) => {
	let account = await models.account.find({
		where: {
			email: request.body.email
		}
	});
	
	if (account) {
		if (account.password === request.body.password) {
			response.status(httpStatus.OK).json(await buildInitialStore(account.id, account));
		}
		else {
			response.status(httpStatus.UNAUTHORIZED).end();
		}
	}
	else {
		response.status(httpStatus.BAD_REQUEST).end();
	}
};

/**
 * Checks if the email already has an account.
 *
 * @param {{body: {email: String}}} request
 * @param response
 */
export const checkEmail = async (request, response) => {
	let account = await models.account.find({
		where: {
			email: request.body.email
		}
	});
	
	response.status(httpStatus.OK).json({taken: !!account});
};
