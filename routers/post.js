const express = require('express');
const router = express.Router();
const {getAllPosts,createPost,getPost,updatePost,deletePost,updateLike} = require('../controllers/post');
const authorize = require('../middlewares/authorize');

router.route('/')
    .get(getAllPosts)
    .post(authorize,createPost);

router.route('/:id')
    .get(getPost)
    .patch(authorize,updatePost)
    .delete(authorize,deletePost);

router.route('/:id/likes').patch(authorize,updateLike);

module.exports = router;