const { mongoose } = require('../helpers/mongoose');
const PostsSchema = require('../schemas/posts-schema');

module.exports = mongoose.model('Posts', PostsSchema);
