const { OrdersModel } = require('../../mongodb/models');
const _get = require('lodash/get');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const getDailySalesHelper = async ({ vendorId }) => {

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const salesData = await OrdersModel.aggregate([
    {
      $match: {
        vendorId: new ObjectId(vendorId),
        createdAt: { $gte: sevenDaysAgo },
        status: { $ne: 'canceled' }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        },
        totalSales: { $sum: '$totalPrice' },
        ordersCount: { $sum: 1 },
      }
    },
    {
      $sort: { "_id.date": -1 }
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        totalSales: 1,
        ordersCount: 1
      }
    }
  ]);

  const allDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    allDates.push(date.toISOString().split('T')[0]);
  }

  const salesByDate = salesData.reduce((acc, item) => {
    acc[item.date] = item;
    return acc;
  }, {});

  let totalSales = 0;
  let totalOrders = 0;
  const completeSalesData = allDates.map((date) => {
    const saleOnDate = _get(salesByDate, `${date}.totalSales`, 0);
    const orderOnDate = _get(salesByDate, `${date}.ordersCount`, 0);
    totalSales += saleOnDate;
    totalOrders += orderOnDate;
    return {
      date,
      totalSales: saleOnDate,
      totalOrders: orderOnDate,
    };
  });

  return {
    dailySales: completeSalesData,
    summary: { totalSales, totalOrders },
  };
};

const getVendorRevenueHelper = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const vendorRevenue = await OrdersModel.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        status: { $ne: 'canceled' }
      }
    },
    {
      $group: {
        _id: '$vendorId',
        totalRevenue: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'vendorInfo'
      }
    },
    {
      $unwind: '$vendorInfo'
    },
    {
      $project: {
        _id: 0,
        vendorId: '$_id',
        vendorName: '$vendorInfo.name',
        vendorEmail: '$vendorInfo.email',
        totalRevenue: 1,
        orderCount: 1,
        averageOrderValue: { $divide: ['$totalRevenue', '$orderCount'] }
      }
    },
    {
      $sort: { totalRevenue: -1 }
    }
  ]);

  return { vendorRevenue };
};

const getTopProductsHelper = async ({ limit }) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const topProducts = await OrdersModel.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        status: { $ne: 'canceled' }
      }
    },
    {
      $unwind: '$products'
    },
    {
      $group: {
        _id: '$products.productId',
        totalQuantity: { $sum: '$products.quantity' },
        totalRevenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
        orderCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productInfo'
      }
    },
    {
      $unwind: '$productInfo'
    },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        productName: '$productInfo.name',
        vendorId: '$productInfo.vendorId',
        totalQuantity: 1,
        totalRevenue: 1,
        orderCount: 1,
        averagePrice: { $divide: ['$totalRevenue', '$totalQuantity'] }
      }
    },
    {
      $sort: { totalRevenue: -1 }
    },
    {
      $limit: limit
    }
  ]);

  return { topProducts };
};

const getAverageOrderValueHelper = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const result = await OrdersModel.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        status: { $ne: 'canceled' }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' },
        minOrderValue: { $min: '$totalPrice' },
        maxOrderValue: { $max: '$totalPrice' }
      }
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        orderCount: 1,
        averageOrderValue: 1,
        minOrderValue: 1,
        maxOrderValue: 1,
        period: { $literal: '30 days' }
      }
    }
  ]);

  return result;
};

module.exports = {
  getDailySalesHelper,
  getVendorRevenueHelper,
  getTopProductsHelper,
  getAverageOrderValueHelper
}; 