const { errorResponse, successResponse } = require("../../utils/response/response.handler");
const {
  SUCCESS_MESSAGES,
} = require('./signUpConstants');
const { signupHelper } = require("./signUpHelper");

const signUp = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    const data = await signupHelper({
      name, email, password, roleId,
    });
    return successResponse({
      res,
      data,
      message: SUCCESS_MESSAGES.SIGN_UP,
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
}

module.exports = {
  signUp,
};