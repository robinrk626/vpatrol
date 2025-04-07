const redis = require('redis');
const config = require('../../config').getConfig();

const redisClient = redis.createClient(
  config.redisConnection.port,
  config.redisConnection.hostname,
);

redisClient.on('connect', () => {
  module.exports.client = redisClient;
});

redisClient.on('error', (err) => {
  console.log(err);
});

module.exports = redisClient;
