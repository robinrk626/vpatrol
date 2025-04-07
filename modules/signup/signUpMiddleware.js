const z = require('zod');
const { errorResponse, STATUS_CODES } = require('../../utils/response/response.handler');
const { ROLE_IDS } = require('../../utils/constants/constants');
const { validateZodSchema } = require('../../utils/common-utils/common-utils');

const validRoleIds = Object.values(ROLE_IDS);

const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email must be a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  roleId: z.enum(validRoleIds, { message: "Invalid roleId" }),
});

const checkSignupParams = (req, res, next) => {
  try {
    const validationResult = validateZodSchema(signupSchema, req.body);
    if (!validationResult.success) {
      throwValidationError({
        message: validationResult.errors.join(', ')
      });
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
}

module.exports = {
  checkSignupParams,
};