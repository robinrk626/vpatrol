const mongoose = require('mongoose');
const UsersModel = require('./userModel');
const { Schema } = mongoose;

const ProductCategorySchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: UsersModel.collection.name, required: true },
}, { timestamps: true });

module.exports = mongoose.model('productCategories', ProductCategorySchema, 'productCategories');
