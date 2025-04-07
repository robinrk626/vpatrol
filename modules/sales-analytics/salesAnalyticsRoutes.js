const express = require('express');
const router = express.Router();
const { 
  getDailySales,
  getVendorRevenue,
  getTopProducts,
  getAverageOrderValue
} = require('./salesAnalyticsController');
const { checkApiPermission } = require('../../middlewares/authMiddleware');
const { ROLE_IDS } = require('../../utils/constants/constants');

router.get(
  '/daily-sales',
  checkApiPermission([ROLE_IDS.VENDOR]),
  getDailySales
);

router.get(
  '/vendor-revenue',
  checkApiPermission([ROLE_IDS.ADMIN]),
  getVendorRevenue
);

router.get(
  '/top-products',
  checkApiPermission([ROLE_IDS.ADMIN]),
  getTopProducts
);

router.get(
  '/average-order-value',
  checkApiPermission([ROLE_IDS.ADMIN]),
  getAverageOrderValue
);

module.exports = router; 