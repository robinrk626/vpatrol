const mongoose = require('mongoose');

const isValidMobileNumber = (mobileNumber = '') => {
  return /^[0-9]{10}$/.test(mobileNumber);
};

const isValidObjectId = (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  return true;
};

const validateZodSchema = (schema, payload) => {
  try {
    schema.parse(payload);
    return { success: true };
  } catch (error) {
    const errorMessages = error.errors.map(err => `${err.path.join(".")} ${err.message}`);
    return {
      success: false,
      errors: errorMessages
    };
  }
};

module.exports = {
  isValidMobileNumber,
  isValidObjectId,
  validateZodSchema
};
