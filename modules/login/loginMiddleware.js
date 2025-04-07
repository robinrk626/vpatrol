const z = require('zod');
const { errorResponse, STATUS_CODES } = require('../../utils/response/response.handler');
const { validateZodSchema } = require('../../utils/common-utils/common-utils');

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password is required" }),
});


const checkLoginParams = (req, res, next) => {
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
      code: STATUS_CODES.STATUS_CODE_VALIDATION_FAILED });
  }
}

module.exports = {
  checkLoginParams,
};