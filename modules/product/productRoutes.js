const express = require('express');
const router = express.Router();

const { checkApiPermission } = require('../../middlewares/authMiddleware');
const { ROLE_IDS } = require('../../utils/constants/constants');
const {
  validateProductData,
  validateProductId,
  validateUpdateProductData,
  validateLowStockQuery
} = require('./productMiddleware');
const { 
  createProduct, 
  getProductDetails, 
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('./productController');


router.get(
  '/low-stock',
  checkApiPermission([ROLE_IDS.VENDOR]),
  validateLowStockQuery,
  getLowStockProducts
);

router.get(
  '/:productId',
  checkApiPermission([ROLE_IDS.VENDOR]),
  validateProductId,
  getProductDetails
);

router.post(
  '/',
  checkApiPermission([ROLE_IDS.VENDOR]),
  validateProductData,
  createProduct
);

router.patch(
  '/:productId',
  checkApiPermission([ROLE_IDS.VENDOR]),
  validateProductId,
  validateUpdateProductData,
  updateProduct
);

// Delete product
router.delete(
  '/:productId',
  checkApiPermission([ROLE_IDS.VENDOR]),
  validateProductId,
  deleteProduct
);


module.exports = router;