const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(
    () => {
      console.log('Connected to database.');
    },
    (err) => {
      throw new Error(err);
    }
  )
  .catch((err) => {
    console.error('Unable to connect to database.\n', err);
  });

module.exports = mongoose;