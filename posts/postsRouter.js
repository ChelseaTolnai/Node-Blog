const express = require('express');

const Posts = require('./postDb');

const postsRouter = express.Router();

postsRouter.get('/', async (req, res, next) => {
    try {
        const posts = await Posts.get(req.query);
        res.status(200).json(posts);
    } catch (err) {
        next({code: 500, action: 'getting', subject: 'posts'});
    }
});

postsRouter.get('/:id', async (req, res, next) => {
    const postID = req.params.id;
    try {
        const post = await Posts.getById(postID);
        if (post) {
            res.status(200).json(post);
        } else {
            next({code: 404, action: 'getting', subject: 'post. Post with specified ID does not exist'});
        }
    } catch (err) {
        next({code: 500, action: 'getting', subject: 'post'});
    }
});

postsRouter.use(errorHandlerPost);

function errorHandlerPost(err, req, res, next) {
    res.status(err.code).json({ errorMessage: `Error ${err.action} the ${err.subject}.` });
}

module.exports = postsRouter;