const { successResponse, errorResponse } = require('../../utils/response/response.handler');
const { SUCCESS_MESSAGES } = require('./orderConstants');
const { placeOrderHelper, getOrderDetailsHelper } = require('./orderHelper');

const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const { userId } = req;

    const { masterOrderId, orderIds } = await placeOrderHelper({
      products,
      userId
    });

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.ORDER_PLACED,
      data: {
        masterOrderId,
        orderIds
      }
    });
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req;

    const orderDetails = await getOrderDetailsHelper({
      orderId,
      userId
    });

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.ORDER_DETAILS_FETCHED,
      data: orderDetails
    });
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

module.exports = {
  createOrder,
  getOrderDetails
}; 