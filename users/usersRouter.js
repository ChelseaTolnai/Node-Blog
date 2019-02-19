const express = require('express');

const Users = require('./userDb');

const usersRouter = express.Router();

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await Users.get(req.query);
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

usersRouter.post('/', nameUpperCase, async (req, res, next) => {
    try {
        const users = await Users.get(req.query);
        const userNames = users.map(user => user.name.toUpperCase());
        if (userNames.includes(userNameCap)) {
            next({code: 400, action: 'adding', subject: 'user. User name is already taken'})
            return;
        } else {
            const user = await Users.insert({...req.body, name: userNameCap});
            res.status(201).json(user);
        }
    } catch (err) {
        next({code: 500, action: 'adding', subject: 'user'});
    }
});

function nameUpperCase(req, res, next) {
    if (!req.body.name) {
        next({code: 400, action: 'adding', subject: 'user. User name is required'})
        return;
    } else {
        userNameCap = req.body.name.toUpperCase();
        console.log(userNameCap);
        next();
    }
};

usersRouter.use(errorHandlerUser);

function errorHandlerUser(err, req, res, next) {
    res.status(err.code).json({ errorMessage: `Error ${err.action} the ${err.subject}.` });
}

module.exports = usersRouter;