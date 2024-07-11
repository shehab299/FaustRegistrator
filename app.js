const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const publishController = require('./controllers/publishController');
const {errorHandler, errorLogger, notFoundHandler} = require('./controllers/errorController');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.get('/publisher' ,  publishController.getPublisher);
app.get('/publish', publishController.publish);
app.get('/success', publishController.success);
app.use(notFoundHandler, errorLogger, errorHandler);


module.exports = app;





