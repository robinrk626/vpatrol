const mongoose = require('mongoose');

const init = (params) => {
  mongoose.Promise = global.Promise;
  const connectionUrl = `mongodb+srv://${params.username}:${params.password}@${params.databaseName}.jniyvfp.mongodb.net/?retryWrites=true&w=majority`;

  mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error. Please make sure MongoDB is running.', err);
    process.exit();
  });

  mongoose.connect(connectionUrl)
    .then(() => {
      console.log('Successfully connected to db');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit();
    });
}

module.exports = {
  init,
}