const { UsersModel } = require("../../mongodb/models");
const { generateToken } = require("../jwt/jwt.utils");

const createAndSaveToken = async ({ userId, roleId }) => {
  const token = generateToken({ userId, roleId });
  await UsersModel.updateOne({ _id: userId }, { $set: { token } });
  return { token };
};

module.exports = {
  createAndSaveToken,
}