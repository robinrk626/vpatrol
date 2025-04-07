const z = require('zod');
const { errorResponse, STATUS_CODES, throwValidationError } = require('../../utils/response/response.handler');
const { isValidObjectId, validateZodSchema } = require('../../utils/common-utils/common-utils');
const { VALIDATION_MESSAGES } = require('./productConstants');

const productSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  stock: z.number().int().min(0, { message: "Stock must be a non-negative integer" }),
  categoryId: z.string().refine(val => isValidObjectId(val), {
    message: "Invalid category ID format"
  })
});

const updateProductSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 character" }).optional(),
  price: z.number().positive({ message: "Price must be a positive number" }).optional(),
  stock: z.number().int().min(0, { message: "Stock must be a non-negative integer" }).optional()
});

const lowStockQuerySchema = z.object({
  quantity: z.string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val >= 0, {
      message: VALIDATION_MESSAGES.INVALID_QUANTITY
    })
    .optional()
});

const validateProductData = async (req, res, next) => {
  try {
    const validationResult = validateZodSchema(productSchema, req.body);
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

const validateUpdateProductData = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throwValidationError({
        message: VALIDATION_MESSAGES.NO_UPDATE_DATA
      });
    }

    const validationResult = validateZodSchema(updateProductSchema, req.body);
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

const validateProductId = (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.productId)) {
      throwValidationError({
        message: VALIDATION_MESSAGES.INVALID_PRODUCT_ID
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

const validateLowStockQuery = async (req, res, next) => {
  try {
    const validationResult = validateZodSchema(lowStockQuerySchema, req.query);
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

module.exports = {
  validateProductData,
  validateProductId,
  validateUpdateProductData,
  validateLowStockQuery
}; 