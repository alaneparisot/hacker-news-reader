const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/**
 * Connects the app to database.
 * @returns {Promise<undefined|Error>} Resolves when connected.
 */
const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(
        () => {
          console.log('Connected to database.');
          return resolve();
        },
        (err) => {
          throw new Error(err);
        }
      )
      .catch((err) => {
        console.error('Unable to connect to database.\n', err);
        return reject(err);
      });
  });
};

/**
 * Disconnects the app from database.
 * @returns {Promise<undefined>} Resolves when disconnected.
 */
const disconnect = () => {
  return mongoose.disconnect();
};

module.exports = {connect, disconnect};