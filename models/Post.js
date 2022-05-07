const {Schema,model} = require('mongoose');

const PostSchema = new Schema({
    authorId: Schema.Types.ObjectId,
    title: String,
    message: String,
    author: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: Number,
        default: 0,
    },
    likers: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports.Post = model('Post', PostSchema);