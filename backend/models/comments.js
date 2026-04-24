const { mongoose } = require('../helpers/mongoose');
const CommentSchema = require('../schemas/comment-schema');

module.exports = mongoose.model('Comments', CommentSchema);
