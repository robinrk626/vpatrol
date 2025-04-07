const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { ProductsModel, OrdersModel, MasterOrdersModel } = require('../../mongodb/models');
const { throwValidationError } = require('../../utils/response/response.handler');
const { VALIDATION_MESSAGES } = require('./orderConstants');

const getOrderDetailsHelper = async ({ orderId, userId }) => {
  const masterOrder = await MasterOrdersModel.findById(orderId)
    .lean();

  if (!masterOrder) {
    throw throwValidationError({ message: VALIDATION_MESSAGES.ORDER_NOT_FOUND });
  }

  if (masterOrder.createdBy.toString() !== userId) {
    throw throwValidationError({ message: VALIDATION_MESSAGES.UNAUTHORIZED_ACCESS });
  }

  const orders = await OrdersModel
    .find({ _id: { $in: masterOrder.orders } })
    .populate({ path: 'products.productId', select: 'name' })
    .lean();

  let totalPrice = 0;

  const orderDetails = orders.map(order => {
    totalPrice += order.totalPrice;
    return {
      orderId: order._id,
      status: order.status,
      vendorId: order.vendorId,
      products: order.products.map(product => ({
        productId: product.productId._id,
        name: product.productId.name,
        quantity: product.quantity,
        price: product.price
      })),
      totalPrice: order.totalPrice
    };
  });
  return { orderDetails, totalPrice };
};

const getProductDetailsMap = async ({ productIds, session }) => {
  const findClause = {
    _id: { $in: productIds },
    isDeleted: false
  };
  const productsData = await ProductsModel.find(findClause, '_id stock price vendorId')
    .session(session)
    .lean();
  const productDetailsMap = new Map();
  productsData.forEach(product => {
    productDetailsMap[product._id.toString()] = product;
  });
  return productDetailsMap;
};

const validateProductQuantity = ({ products, productsMap }) => {
  products.forEach(product => {
    const productDetails = productsMap[product.productId];
    if (!productDetails) {
      throw throwValidationError({
        message: VALIDATION_MESSAGES.PRODUCT_NOT_FOUND
      });
    }
    if (productDetails.stock < product.quantity) {
      throw throwValidationError({
        message: VALIDATION_MESSAGES.INSUFFICIENT_STOCK
      });
    }
  });
};

const groupProductsByVendor = ({ products, productsMap }) => {

  const vendorOrdersMap = new Map();
  products.forEach(product => {
    const { productId, quantity } = product;
    const productDetails = productsMap[productId];
    const vendorId = productDetails.vendorId.toString();
    const orderItem = {
      productId,
      quantity,
      price: productDetails.price
    };

    if (!vendorOrdersMap.has(vendorId)) {
      vendorOrdersMap[vendorId] = {
        products: [],
        totalPrice: 0,
        vendorId,
      };
    }
    vendorOrdersMap[vendorId].products.push(orderItem);
    vendorOrdersMap[vendorId].totalPrice += productDetails.price * product.quantity;
  });
  return vendorOrdersMap;
};

const createSingleOrder = async ({
  orderData, customerId, session, vendorId,
}) => {
  const newOrder = OrdersModel({
    createdBy: customerId,
    vendorId,
    products: orderData.products,
    totalPrice: orderData.totalPrice
  });
  await newOrder.save({ session });
  const bulkOps = orderData.products.map(product => ({
    updateOne: {
      filter: { _id: new ObjectId(product.productId) },
      update: { $inc: { stock: -product.quantity } },
    }
  }));
  await ProductsModel.bulkWrite(bulkOps, { session });
  return newOrder._id;
};

const createVendorOrders = async ({ vendorOrdersMap, customerId, session }) => {
  const promises = Object.keys(vendorOrdersMap).map((vendorId) =>
    createSingleOrder({ orderData: vendorOrdersMap[vendorId], customerId, session, vendorId }));
  const orderIds = await Promise.all(promises);
  return orderIds;
};

const createMasterOrder = async ({ customerId, orderIds, session }) => {
  const masterOrder = await MasterOrdersModel.create({
    createdBy: customerId,
    orders: orderIds
  }, { session });

  return masterOrder._id;
};

const placeOrderHelper = async ({ products, userId: customerId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productIds = products.map(p => p.productId);
    const productsMap = await getProductDetailsMap({ productIds, session });
    validateProductQuantity({ products, productsMap });
    const vendorOrdersMap = groupProductsByVendor({ products, productsMap });
    const orderIds = await createVendorOrders({
      vendorOrdersMap,
      customerId,
      session
    });
    const masterOrderId = await createMasterOrder({
      customerId,
      orderIds,
      session
    });
    await session.commitTransaction();
    return { masterOrderId, orderIds };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  placeOrderHelper,
  getOrderDetailsHelper
}; 