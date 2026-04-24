const { mongoose } = require('../helpers/mongoose');
const CategorySchema = require('../schemas/category-schema');

module.exports = mongoose.model('Category', CategorySchema);
