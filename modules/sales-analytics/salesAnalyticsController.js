const { 
  getDailySalesHelper,
  getVendorRevenueHelper,
  getTopProductsHelper,
  getAverageOrderValueHelper
} = require('./salesAnalyticsHelper');
const { SUCCESS_MESSAGES, VALIDATION_MESSAGES } = require('./salesAnalyticsConstants');
const { throwValidationError } = require('../../utils/common-utils/common-utils');
const { successResponse, errorResponse } = require('../../utils/response/response.handler');

const getDailySales = async (req, res) => {
  try {
    const vendorId = req.userId;
    const data = await getDailySalesHelper({ vendorId });

    if (!data) {
      throwValidationError(VALIDATION_MESSAGES.NO_SALES_DATA);
    }

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.DAILY_SALES_FETCHED,
      data
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
};

const getVendorRevenue = async (req, res) => {
  try {
    const data = await getVendorRevenueHelper();

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.VENDOR_REVENUE_FETCHED,
      data
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { limit = '5' } = req.query;
    const data = await getTopProductsHelper({
      limit: parseInt(limit)
    });

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.TOP_PRODUCTS_FETCHED,
      data
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
};

const getAverageOrderValue = async (req, res) => {
  try {
    const data = await getAverageOrderValueHelper();

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.AVG_ORDER_VALUE_FETCHED,
      data
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
};

module.exports = {
  getDailySales,
  getVendorRevenue,
  getTopProducts,
  getAverageOrderValue
}; 