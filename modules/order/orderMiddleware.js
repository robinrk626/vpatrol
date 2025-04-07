const { z } = require('zod');
const { isValidObjectId } = require('mongoose');
const { validateZodSchema } = require('../../utils/common-utils/common-utils');
const { VALIDATION_MESSAGES } = require('./orderConstants');
const { errorResponse, throwValidationError } = require('../../utils/response/response.handler');

const orderProductSchema = z.object({
  productId: z.string().refine(val => isValidObjectId(val), {
    message: VALIDATION_MESSAGES.INVALID_PRODUCT_ID
  }),
  quantity: z.number().positive({
    message: VALIDATION_MESSAGES.INVALID_QUANTITY
  })
});

const createOrderSchema = z.object({
  products: z.array(orderProductSchema).min(1, {
    message: VALIDATION_MESSAGES.NO_PRODUCTS
  })
});

const validateCreateOrderData = async (req, res, next) => {
  try {
    const validationResult = validateZodSchema(createOrderSchema, req.body);
    if (!validationResult.success) {
      throwValidationError({
        message: validationResult.errors.join(', ')
      });
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

const validateOrderId = (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.orderId)) {
      throwValidationError({
        message: VALIDATION_MESSAGES.INVALID_ORDER_ID
      });
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

module.exports = {
  validateCreateOrderData,
  validateOrderId
}; 