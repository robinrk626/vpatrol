require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { UsersModel, ProductCategoryModel } = require('../mongodb/models');
const { ROLE_IDS } = require('../utils/constants/constants');

const SALT_FACTOR = 10;

const connectDB = async () => {
  try {
    const { username, password, databaseName } = require('../config/development.config.json').database;
    const connectionUrl = `mongodb+srv://${username}:${password}@${databaseName}.jniyvfp.mongodb.net/?retryWrites=true&w=majority`;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connectionUrl);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createVendorUser = async () => {
  try {
    const vendorData = {
      name: 'Test Vendor',
      email: 'vendor@test.com',
      password: await bcrypt.hash('password123', SALT_FACTOR),
      roleId: new mongoose.Types.ObjectId(ROLE_IDS.VENDOR)
    };

    console.log('Checking for existing vendor...');
    const existingUser = await UsersModel.findOne({ email: vendorData.email });
    if (existingUser) {
      console.log('Vendor user already exists');
      return existingUser;
    }

    console.log('Creating new vendor user...');
    const vendor = new UsersModel(vendorData);
    await vendor.save();
    console.log('Vendor user created successfully');
    return vendor;
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};

const createProductCategories = async (vendorId) => {
  try {
    const categories = [
      { name: 'Electronics', createdBy: vendorId },
      { name: 'Clothing', createdBy: vendorId },
      { name: 'Books', createdBy: vendorId },
      { name: 'Home & Kitchen', createdBy: vendorId },
      { name: 'Sports & Outdoors', createdBy: vendorId }
    ];

    console.log('Creating product categories...');
    for (const category of categories) {
      const existingCategory = await ProductCategoryModel.findOne({ name: category.name });
      if (!existingCategory) {
        const newCategory = new ProductCategoryModel(category);
        await newCategory.save();
        console.log(`Category "${category.name}" created successfully`);
      } else {
        console.log(`Category "${category.name}" already exists`);
      }
    }
  } catch (error) {
    console.error('Error creating categories:', error);
    throw error;
  }
};

const setup = async () => {
  try {
    await connectDB();
    const vendor = await createVendorUser();
    await createProductCategories(vendor._id);
    console.log('Setup completed successfully');
  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

setup(); 