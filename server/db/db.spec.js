require('./../config/config');

const expect = require('chai').expect;
const globalMongoose = require('mongoose');

const mongoose = require('./../db/mongoose');

describe.only('Mongoose', () => {

  it('should connect the app to database', async () => {
    await mongoose.connect();
    console.log(globalMongoose.connection.readyState);
  });

});