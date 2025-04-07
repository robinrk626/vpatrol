const mongoose = require('mongoose');
const userModel = require('./userModel');
const productCategoriesModel = require('./productCategoriesModel');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, min: 0, default: 0 },
  vendorId: { type: Schema.Types.ObjectId, ref: userModel.collection.name, required: true },
  category: { type: Schema.Types.ObjectId, ref: productCategoriesModel.collection.name },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('products', ProductSchema, 'products');
