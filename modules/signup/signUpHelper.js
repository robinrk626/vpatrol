const { UsersModel } = require("../../mongodb/models");
const { throwValidationError } = require("../../utils/response/response.handler");
const { VALIDATION_MESSAGES } = require("./signUpConstants");
const { createAndSaveToken } = require('../../utils/user/user-utils');

const signupHelper = async ({
  name, email, password, roleId,
}) => {
  const isEmailUsed = await UsersModel.findOne({ email }).lean();
  if (isEmailUsed) {
    throwValidationError({
      message: VALIDATION_MESSAGES.EMAIL_ALREADY_USED,
    });
  }
  const user = new UsersModel({ name, email, password, roleId });
  await user.save();
  const userId = user._id;
  const { token } = await createAndSaveToken({ userId, roleId });
  return { token };
}

module.exports = {
  signupHelper,
}