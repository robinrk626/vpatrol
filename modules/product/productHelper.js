const _set = require('lodash/set');

const { ProductsModel, ProductCategoryModel } = require('../../mongodb/models');
const { throwValidationError } = require('../../utils/response/response.handler');
const { VALIDATION_MESSAGES } = require('./productConstants');

const getLowStockProductsHelper = async ({ quantity = 100, vendorId }) => {
  const productsData = await ProductsModel.find({
    vendorId,
    isDeleted: false,
    stock: { $lt: quantity }
  })
  .select('_id name stock')
  .lean();

  const products = productsData.map(product => ({
    productId: product._id,
    name: product.name,
    stock: product.stock
  }));
  return { products };
};

const createProductHelper = async ({
  name, price, stock, categoryId, vendorId
}) => {
  // Validate if category exists
  const categoryExists = await ProductCategoryModel.findById(categoryId).lean();
  if (!categoryExists) {
    throwValidationError({
      message: VALIDATION_MESSAGES.CATEGORY_NOT_FOUND
    });
  }

  const product = new ProductsModel({
    name,
    price,
    stock,
    vendorId,
    category: categoryId
  });

  await product.save();
  return product;
};

const getProductDetailsHelper = async ({ productId, vendorId }) => {
  const product = await ProductsModel.findById(productId)
    .select('name price stock category vendorId isDeleted')
    .populate('category', 'name')
    .lean();

  if (!product) {
    throwValidationError({
      message: VALIDATION_MESSAGES.PRODUCT_NOT_FOUND
    });
  }

  if (product.isDeleted) {
    throwValidationError({
      message: VALIDATION_MESSAGES.PRODUCT_DELETED
    });
  }

  // Check if the product belongs to the requesting vendor
  if (product.vendorId.toString() !== vendorId.toString()) {
    throwValidationError({
      message: VALIDATION_MESSAGES.UNAUTHORIZED_ACCESS
    });
  }

  return {
    name: product.name,
    price: product.price,
    stock: product.stock,
    categoryId: product.category._id,
    categoryName: product.category.name
  };
};

const checkProductUpdateAccess = async ({ productId, vendorId }) => {
  const product = await ProductsModel.findById(productId)
    .select('vendorId isDeleted')
    .lean();

  if (!product) {
    throwValidationError({
      message: VALIDATION_MESSAGES.PRODUCT_NOT_FOUND
    });
  }

  if (product.vendorId.toString() !== vendorId.toString()) {
    throwValidationError({
      message: VALIDATION_MESSAGES.UNAUTHORIZED_ACCESS
    });
  }

  if (product.isDeleted) {
    throwValidationError({
      message: VALIDATION_MESSAGES.PRODUCT_DELETED
    });
  }

  return product;
};

const updateProductHelper = async ({ productId, updateData }) => {
  const updateClause = {};
  
  if (updateData.name !== undefined) {
    _set(updateClause, '$set.name', updateData.name);
  }
  if (updateData.price !== undefined) {
    _set(updateClause, '$set.price', updateData.price);
  }
  if (updateData.stock !== undefined) {
    _set(updateClause, '$inc.stock', updateData.stock);
  }

  await ProductsModel.updateOne(
    { _id: productId },
    updateClause
  );
};

const deleteProductHelper = async ({ productId }) => {

  await ProductsModel.updateOne(
    { _id: productId },
    { $set: { isDeleted: true } }
  );
};

module.exports = {
  createProductHelper,
  getProductDetailsHelper,
  checkProductUpdateAccess,
  updateProductHelper,
  deleteProductHelper,
  getLowStockProductsHelper
}; 