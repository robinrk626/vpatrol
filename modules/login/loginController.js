const { errorResponse, successResponse } = require("../../utils/response/response.handler");
const {
  SUCCESS_MESSAGES,
} = require('./loginConstants');
const { loginHelper } = require("./loginHelper");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginHelper({
      email, password,
    });
    return successResponse({
      res,
      data,
      message: SUCCESS_MESSAGES.LOGIN,
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
}

module.exports = {
  login,
};