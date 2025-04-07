const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ORDER_STATUS } = require('../constants/constants');
const ProductsModel = require('./productModel');
const userModel = require('./userModel');

const orderedProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: ProductsModel.collection.name, required: true },
  price: { type: Number, required: true }, 
  quantity: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: userModel.collection.name,
    required: true,
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: userModel.collection.name,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
  },
  products: [orderedProductSchema],
  totalPrice: { type: Number, required: true },
}, { timestamps: true });

OrderSchema.index({ createdBy: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ vendorId: 1 });

const OrdersModel = mongoose.model('Orders', OrderSchema);

module.exports = OrdersModel; 