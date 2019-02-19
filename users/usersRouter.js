const express = require('express');

const Users = require('./userDb');

const usersRouter = express.Router();

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await Users.get();
        res.status(200).json(users);
    } catch (err) {
        next({code: 500, action: 'getting', subject: 'users'});
    }
});

usersRouter.get('/:id', async (req, res, next) => {
    const userID = req.params.id;
    try {
        const user = await Users.getById(userID);
        if (user) {
            res.status(200).json(user);
        } else {
            next({code: 404, action: 'getting', subject: 'user by specified ID.'});
        }
    } catch (err) {
        next({code: 500, action: 'getting', subject: 'user'});
    }
});

usersRouter.use(errorHandlerUser);

function errorHandlerUser(err, req, res, next) {
    res.status(err.code).json({ errorMessage: `Error ${err.action} the ${err.subject}` });
}

module.exports = usersRouter;