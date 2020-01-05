import express from 'express';

import { createAccount, verifyLogin, checkEmail } from './functions/session.js';

const router = express.Router();

const wrapTryCatch = handler => async (request, response, next) => {
	try {
		await handler(request, response, next)
	}
	catch (error) {
		next(error)
	}
};

router.post('/createAccount', wrapTryCatch(createAccount));
router.post('/login', wrapTryCatch(verifyLogin));
router.post('/checkEmail', wrapTryCatch(checkEmail));

export default router;