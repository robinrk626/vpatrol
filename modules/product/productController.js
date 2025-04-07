const { successResponse, errorResponse } = require('../../utils/response/response.handler');
const { 
  createProductHelper, 
  getProductDetailsHelper,
  checkProductUpdateAccess,
  updateProductHelper,
  deleteProductHelper,
  getLowStockProductsHelper
} = require('./productHelper');
const { SUCCESS_MESSAGES } = require('./productConstants');

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, categoryId } = req.body;
    const { userId: vendorId } = req;

    const product = await createProductHelper({
      name,
      price,
      stock,
      categoryId,
      vendorId
    });

    return successResponse({
      res,
      data: {
        productId: product._id
      },
      message: SUCCESS_MESSAGES.PRODUCT_CREATED
    });
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId: vendorId } = req;

    const productDetails = await getProductDetailsHelper({
      productId,
      vendorId
    });

    return successResponse({
      res,
      data: productDetails,
      message: SUCCESS_MESSAGES.PRODUCT_DETAILS_FETCHED
    });
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId: vendorId } = req;
    const updateData = req.body;

    await checkProductUpdateAccess({ productId, vendorId });

    await updateProductHelper({ 
      productId, 
      updateData 
    });

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT_UPDATED
    });
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId: vendorId } = req;

    await checkProductUpdateAccess({ productId, vendorId });

    await deleteProductHelper({ productId });

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT_DELETED
    });
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const { quantity = 100 } = req.query;
    const { userId: vendorId } = req;

    const { products } = await getLowStockProductsHelper({
      quantity: parseInt(quantity),
      vendorId
    });

    return successResponse({
      res,
      message: SUCCESS_MESSAGES.LOW_STOCK_PRODUCTS_FETCHED,
      data: { products }
    });
  } catch (error) {
    return errorResponse({
      res,
      error
    });
  }
};

module.exports = {
  createProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getLowStockProducts
}; 