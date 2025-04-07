const { getConfig } = require("../config");
const { UsersModel } = require("../mongodb/models");
const { decodeToken } = require("../utils/jwt/jwt.utils");
const { errorResponse, STATUS_CODES, throwValidationError } = require("../utils/response/response.handler");

const validateToken = async ({ token, userId }) => {
  const userData = await UsersModel.findOne({ _id: userId }, { token: 1, roleId: 1 }).lean();
  const isValidToken = (userData && userData.token === token);
  const roleId = userData ? userData.roleId : '';
  return { isValidToken, roleId };
}

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;
    if (!token) {
      throwValidationError({
        code: STATUS_CODES.STATUS_CODE_UNAUTHORIZED,
        message: 'Token Missing',
      });
      return next();
    }
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.userId) {
      return throwValidationError({
        code: STATUS_CODES.STATUS_CODE_UNAUTHORIZED,
        message: 'Invalid Token',
      });
    }
    const { userId } = decodedToken;
    const config = getConfig();
    if (userId === config.masterUserId) {
      return next();
    }
    const { isValidToken, roleId } = await validateToken({ userId, token });
    if (!isValidToken) {
      throwValidationError({
        code: STATUS_CODES.STATUS_CODE_UNAUTHORIZED,
        message: 'Invalid Token',
      });
    }

    req.roleId = roleId.toString();
    req.userId = userId.toString();
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const checkApiPermission = (roleIds = []) => {
  return (req, res, next) => {
    try {
      const { roleId: userRoleId } = req;
      if (!roleIds.includes(userRoleId)) {
        throwValidationError({
          code: STATUS_CODES.STATUS_CODE_FORBIDDEN,
          message: 'User has not permission',
        });
      }
      return next();
    } catch (error) {
      return errorResponse({ res, error });
    }
  }
}

module.exports = {
  authMiddleware,
  checkApiPermission,
};