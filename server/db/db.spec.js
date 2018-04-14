require('./../config/config');

const expect = require('chai').expect;
const mongoose = require('mongoose');

const db = require('./db');

describe('DB', () => {

  it('should connect the app to database', async () => {
    await db.connect();
    expect(mongoose.connection.readyState).to.equal(1);
  });

  it('should disconnect the app to database', async () => {
    await db.disconnect();
    expect(mongoose.connection.readyState).to.equal(0);
  });

});