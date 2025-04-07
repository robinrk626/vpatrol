const loginRoutes = require('../modules/login/loginRoutes');
const signUpRoutes = require('../modules/signup/signUpRoutes');
const productsRoutes = require('../modules/product/productRoutes');
const orderRoutes = require('../modules/order/orderRoutes');
const salesAnalyticsRoutes = require('../modules/sales-analytics/salesAnalyticsRoutes');

module.exports = (app) => {
  app.use('/signUp', signUpRoutes);
  app.use('/login', loginRoutes);
  app.use('/auth/products', productsRoutes);
  app.use('/auth/orders', orderRoutes);
  app.use('/auth/sales-analytics', salesAnalyticsRoutes);
}