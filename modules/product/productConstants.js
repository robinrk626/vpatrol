const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_FETCHED: 'Product details fetched successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  LOW_STOCK_PRODUCTS_FETCHED: 'Low stock products fetched successfully'
};

const VALIDATION_MESSAGES = {
  CATEGORY_NOT_FOUND: 'Category not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  INVALID_PRODUCT_ID: 'Invalid product ID format',
  UNAUTHORIZED_ACCESS: 'You do not have access to this product',
  NO_UPDATE_DATA: 'No data provided for update',
  PRODUCT_DELETED: 'This product has been deleted',
  PRODUCT_ALREADY_DELETED: 'Product is already marked as deleted',
  INVALID_QUANTITY: 'Quantity must be a non-negative number'
};

module.exports = {
  SUCCESS_MESSAGES,
  VALIDATION_MESSAGES
}; 