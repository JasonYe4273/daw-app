import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';

import router from './router/api.js';

var app = express();
var port = 8000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('../public'));

// Server requests should all start with /api
app.use('/api', router);

// All other requests should be for loading webpages
app.get(/^\/(?!api)/, (req, res) => {
	res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500).end();
});

// make sure all responses are ended
app.use((request, response) => {
	response.end();
});

app.listen(port, () => console.log(`Dead Action Worm app listening on port ${port}!`));