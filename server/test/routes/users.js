const {expect} = require('chai');
const request = require('supertest');

const db = require('../../db/db');
const {app} = require('../../server');
const {User} = require('../../models/user');
const {users, populateUsers} = require('../seed/seed');

describe('/users', () => {

  before(async () => {
    await db.connect();
    await populateUsers();
  });

  describe('POST /users/register', () => {

    it('should create a user', async () => {
      const email = 'joehn@doe.com';
      const password = '123456';

      await
        request(app)
          .post('/api/users/register')
          .send({email, password})
          .expect(200)
          .expect(async (res) => {
            expect(res.headers['x-auth']).to.be.a('string');
            expect(res.body._id).to.be.a('string');
            expect(res.body.email).to.equal(email);

            const user = await User.findOne({email});
            expect(user instanceof User).to.be.true;
            expect(user.password).to.not.equal(password);
          });
    });

    it('should return validation error if email is invalid', async () => {
      await
        request(app)
          .post('/api/users/register')
          .send({
            email: 'invalid-email',
            password: '123456'
          })
          .expect(400);
    });

    it('should return validation error if password is invalid', async () => {
      await
        request(app)
          .post('/api/users/register')
          .send({
            email: 'valid@email.com',
            password: 'short'
          })
          .expect(400);
    });

    it('should not create user if email in use', async () => {
      await
        request(app)
          .post('/api/users/register')
          .send({
            email: users[0].email,
            password: '123456'
          })
          .expect(400);
    });

  });

  describe('POST /users/login', () => {

    it('should log in user and return auth token', async () => {
      const userData = {email, password} = users[0];

      await
        request(app)
          .post('/api/users/login')
          .send(userData)
          .expect(200)
          .expect(async (res) => {
            const token = res.headers['x-auth'];
            expect(token).to.be.a('string');

            const user = await User.findById(users[0]._id);
            expect(user.tokens[0]).to.include({access: 'auth', token});
          });
    });

    it('should fail due to invalid password', async () => {
      const {email} = users[0];
      const password = 'incorrect-password';

      await
        request(app)
          .post('/api/users/login')
          .send({email, password})
          .expect(400)
          .expect(async (res) => {
            expect(res.headers['x-auth']).to.not.exist;

            const user = await User.findById(users[0]._id);
            expect(user.tokens.length).to.equal(0);
          });
    });

  });

  describe('GET /users/me', () => {
    it('should return user if authenticated', async () => {
      await
        request(app)
          .get('/api/users/me')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body._id).to.equal(users[0]._id.toHexString());
            expect(res.body.email).to.equal(users[0].email);
          });
    });

    it('should return 401 if not authenticated', async () => {
      await
        request(app)
          .get('/api/users/me')
          .expect(401)
          .expect((res) => {
            expect(res.body).to.be.deep.equal({});
          });
    });

  });

  describe('DELETE /users/logout', () => {
    it('should remove auth token on logout', async () => {
      await
        request(app)
          .delete('/api/users/logout')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect(async () => {
            const user = await User.findById(users[0]._id);
            expect(user.tokens.length).to.equal(0);
          });
    });
  });

});