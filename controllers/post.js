const {Post} = require('../models/Post');
const mongoose =  require('mongoose');

module.exports.getAllPosts = async (req,res) => {
    const {page} = req.query;
    try {
        const LIMIT = 12;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Post.countDocuments();

        const posts = await Post.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);

        return res.status(200).send({data: posts, currentPage: Number(page), totalNumberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {
        return res.status(404).send({ message: error.message });
    }
}

module.exports.createPost = async (req,res) => {
    const newPost = new Post({
        authorId: req.body.authorId,
        title: req.body.title,
        message: req.body.message,
        author: req.body.author,
        tags: req.body.tags,
        selectedFile: req.body.selectedFile
    });
    try {
        await newPost.save();
        return res.status(201).send(newPost);
    } catch (error) {
        return res.status(409).send({ message: error.message });
    }
}


module.exports.getPost = async (req,res) => {
    const {id: _id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id: ${_id}`);

    const post = await Post.findOne({_id: _id});
    if(!post) return res.status(404).send(`No post with id: ${_id}`);

    return res.status(200).send(post);
}

module.exports.updatePost = async (req,res) => {
    const {id: _id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id: ${_id}`);

    const post = await Post.findOne({_id: _id});
    if(!post) return res.status(404).send(`No post with id: ${_id}`);

    if(post.authorId !== req.user._id) return res.status(400).send("Unauthorized");

    const result = await Post.findOneAndUpdate({_id: _id},req.body,{new: true});
    return res.status(200).send(result);
}

module.exports.deletePost = async (req,res) => {
    const {id: _id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id: ${_id}`);

    const post = await Post.findOne({_id: _id});
    if(!post) return res.status(404).send(`No post with id: ${_id}`);

    if(post.authorId != req.user._id) return res.status(400).send("Unauthorized");
    
    const result = await Post.findOneAndDelete({_id: _id});
    return res.status(200).send(result);
}

module.exports.updateLike = async (req,res) => {
    const {id: _id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id: ${_id}`);

    const post = await Post.findOne({_id: _id});
    if(!post) return res.status(404).send(`No post with id: ${_id}`);

    /*if(post.likers.length > 0){
        post.likers.forEach(async (liker,index) => {
            if(liker == req.user._id){
                const resultMinus = await Post.findOneAndUpdate({_id: _id},{likes: (post.likes - 1), likers: post.likers.splice(index,1)},{new: true});
                return res.status(200).send(resultMinus);
            }
        });
    }*/

    const result = await Post.findOneAndUpdate({_id: _id},{likes: (post.likes + 1)},{new: true});
    return res.status(200).send(result);
}