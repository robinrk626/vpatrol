const { promisify } = require('util');
const redisClient = require('./redis-connection');

const setKey = promisify(redisClient.SET).bind(redisClient);
const getKey = promisify(redisClient.get).bind(redisClient);
const setRedisKeyExpiry = promisify(redisClient.expire).bind(redisClient);

module.exports = {
  setKey,
  getKey,
  setRedisKeyExpiry,
};
