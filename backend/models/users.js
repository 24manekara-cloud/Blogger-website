const { mongoose } = require('../helpers/mongoose');
const UsersSchema = require('../schemas/users-schema');

module.exports = mongoose.model('Users', UsersSchema);
