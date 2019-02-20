const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

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
            next({code: 404, action: 'getting', subject: 'user. User with specified ID does not exist'});
        }
    } catch (err) {
        next({code: 500, action: 'getting', subject: 'user'});
    }
});

usersRouter.get('/:id/posts', async (req, res, next) => {
    const userID = req.params.id;
    try {
        const user = await Users.getById(userID);
        if (user) {
            const posts = await Posts.get();
            const userPosts = posts.filter(post => post.user_id == userID)
            if (userPosts.length > 0) {
                res.status(200).json(userPosts);
            } else {
                next({code: 404, action: 'getting', subject: 'posts. User with specified ID does not have any posts'});
            }
        } else {
            next({code: 404, action: 'getting', subject: 'posts. User with specified ID does not exist'});
        }
    } catch (err) {
        next({code: 500, action: 'getting', subject: 'posts'});
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

usersRouter.delete('/:id', async (req, res, next) => {
    const userID = req.params.id;
    try {
        const user = await Users.getById(userID);
        if (user) {
            await Users.remove(userID);
            res.status(200).json({...user, deleted: 'successful'});
        } else {
            next({code: 404, action: 'deleting', subject: 'user. User with specified ID does not exist'});
        }
    } catch (error) {
        next({code: 500, action: 'deleting', subject: 'user'});
    }
});

usersRouter.put('/:id', nameUpperCase, async (req, res, next) => {
    const userID = req.params.id;
    try {
        const user = await Users.getById(userID);
        if (user) {
            const users = await Users.get(req.query);
            const userNames = users.map(user => user.name.toUpperCase());
            if (userNames.includes(userNameCap)) {
                next({code: 400, action: 'adding', subject: 'user. User name is already taken'})
                return;
            } else {
                await Users.update(userID, {...req.body, name: userNameCap});
                const updatedUser = await Users.getById(userID);
                res.status(200).json({...updatedUser, updated: 'successful'});
            }
        } else {
            next({code: 404, action: 'updating', subject: 'user. User with specified ID does not exist'});
        }
    } catch (error) {
        next({code: 500, action: 'updating', subject: 'user'});
    }
});

function nameUpperCase(req, res, next) {
    if (!req.body.name) {
        next({code: 400, action: 'updating', subject: 'user. User name is required'})
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