const express = require('express');
const helmet = require('helmet');
const path = require('path');

const usersRouter = require('./users/usersRouter')

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/users', usersRouter);

server.get('*', async (req, res, next) => {
    const filePath = path.join(__dirname);
    res.sendFile(filePath, err => {
        if (err) {
            next(err); 
        } else {
            next();
        }
    });
});

server.use(errorHandler);

function errorHandler(err, req, res, next) {
    res.status(404).json({ errorMessage: 'Not Found', errorCode: err.code });
}

module.exports = server;