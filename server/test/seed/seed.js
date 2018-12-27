const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'john@doe.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign(
      {_id: userOneId, access: 'auth'},
      process.env.JWT_SECRET_OR_PRIVATE_KEY
    ).toString()
  }]
}, {
  _id: userTwoId,
  email: 'jane@doe.com',
  password: '123456'
}];

const populateUsers = async () => {
  await User.deleteMany({});

  // TODO: map
  const userOne = new User(users[0]).save();
  const userTwo = new User(users[1]).save();

  await Promise.all([userOne, userTwo]);
};

module.exports = {users, populateUsers};