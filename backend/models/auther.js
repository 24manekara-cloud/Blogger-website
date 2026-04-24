const { mongoose } = require('../helpers/mongoose');
const AutherSchema = require('../schemas/auther-schema');

module.exports = mongoose.model('Auther', AutherSchema);
