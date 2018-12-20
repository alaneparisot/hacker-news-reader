const {expect} = require('chai');
const request = require('supertest');

const db = require('../../db/db');
const {app} = require('../../server');
const {User} = require('../../models/user');
const {users, populateUsers} = require('../seed/seed');

describe('POST /users', () => {

  before(async () => {
    await db.connect();
    await populateUsers();
  });

  it('should create a user', async () => {
    const email = 'joehn@doe.com';
    const password = '123456';

    await
      request(app)
        .post('/api/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).to.be.a('string');
          expect(res.body._id).to.be.a('string');
          expect(res.body.email).to.equal(email);
        });

    const user = await User.findOne({email});
    expect(user instanceof User).to.be.true;
    expect(user.password).to.not.equal(password);
  });

  it('should return validation error if email is invalid', async () => {
    await
      request(app)
        .post('/api/users')
        .send({
          email: 'invalid-email',
          password: '123456'
        })
        .expect(400);
  });

  it('should return validation error if password is invalid', async () => {
    await
      request(app)
        .post('/api/users')
        .send({
          email: 'valid@email.com',
          password: 'short'
        })
        .expect(400);
  });

  it('should not create user if email in use', async () => {
    await
      request(app)
        .post('/api/users')
        .send({
          email: users[0].email,
          password: '123456'
        })
        .expect(400);
  });

});