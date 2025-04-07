const { UsersModel } = require("../../mongodb/models");
const { throwValidationError } = require("../../utils/response/response.handler");
const { createAndSaveToken } = require("../../utils/user/user-utils");
const { VALIDATION_MESSAGES } = require("./loginConstants");

const loginHelper = async ({
  email, password,
}) => {
  const userData = await UsersModel.findOne({ email });
  if (!userData) {
    throwValidationError({
      message: VALIDATION_MESSAGES.EMAIL_NOT_FOUND,
    });
  }
  const passwordMatched = userData.comparePassword(password);
  if (!passwordMatched) {
    throwValidationError({
      message: VALIDATION_MESSAGES.PASSWORD_DID_NOT_MATCH,
    });
  }
  const userDetails = userData.toObject();
  const { _id: userId, roleId } = userDetails;
  const { token } = await createAndSaveToken({ userId, roleId });
  return { token };
}

module.exports = {
  loginHelper,
}