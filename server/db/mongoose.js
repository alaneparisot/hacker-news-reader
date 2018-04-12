const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/**
 * Connects the app to the database.
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

module.exports = {connect};