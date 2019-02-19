const express = require('express');

const Users = require('./userDb');

const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
    try {
        const users = await Users.get();
        res.status(200).json(users)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error retrieving the users.'})
    }
});

module.exports = usersRouter;