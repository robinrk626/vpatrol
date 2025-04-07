const SUCCESS_MESSAGES = {
  ORDER_PLACED: 'Order placed successfully',
  ORDER_DETAILS_FETCHED: 'Order details fetched successfully'
};

const VALIDATION_MESSAGES = {
  INVALID_PRODUCT_ID: 'Invalid product ID format',
  INVALID_QUANTITY: 'Quantity must be a positive number',
  NO_PRODUCTS: 'At least one product is required',
  INVALID_PRODUCTS_FORMAT: 'Invalid products format',
  PRODUCT_NOT_FOUND: 'One or more products not found',
  INSUFFICIENT_STOCK: 'Insufficient stock available for one or more products',
  ORDER_NOT_FOUND: 'Order not found',
  UNAUTHORIZED_ACCESS: 'You do not have access to this order',
  INVALID_ORDER_ID: 'Invalid order ID format'
};

module.exports = {
  SUCCESS_MESSAGES,
  VALIDATION_MESSAGES
}; 