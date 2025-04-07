const express = require('express');
const router = express.Router();

const { checkApiPermission } = require('../../middlewares/authMiddleware');
const { ROLE_IDS } = require('../../utils/constants/constants');
const { validateCreateOrderData, validateOrderId } = require('./orderMiddleware');
const { createOrder, getOrderDetails } = require('./orderController');

router.post(
  '/',
  checkApiPermission([ROLE_IDS.CUSTOMER]),
  validateCreateOrderData,
  createOrder
);

// Get order details
router.get(
  '/:orderId',
  checkApiPermission([ROLE_IDS.CUSTOMER]),
  validateOrderId,
  getOrderDetails
);

module.exports = router; 