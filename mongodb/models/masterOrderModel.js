const mongoose = require('mongoose');
const { Schema } = mongoose;

const { ORDER_STATUS } = require('../constants/constants');
const OrdersModel = require('./orderModel');
const userModel = require('./userModel');

const masterOrderSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: userModel.collection.name,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: OrdersModel.collection.name,
    required: true,
  }],
}, { timestamps: true });

masterOrderSchema.index({ createdBy: 1 });
masterOrderSchema.index({ status: 1 });

const MasterOrdersModel = mongoose.model('MasterOrders', masterOrderSchema);

module.exports = MasterOrdersModel; 