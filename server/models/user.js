const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {Schema} = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const access = 'auth';
  const payload = {
    _id: user._id.toHexString(),
    access
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_OR_PRIVATE_KEY).toString();

  user.tokens = user.tokens.filter((item) => item.access !== 'auth');

  user.tokens.push({access, token});

  try {
    await user.save();
    return token;
  } catch (e) {
    return new Error(e.message);
  }
};

userSchema.statics.findByCredentials = async function (email, password) {
  const User = this;

  try {
    const user = await User.findOne({email});

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }

    throw new Error();
  } catch (e) {
    return new Error(`Email or password don't match.`);
  }
};

userSchema.statics.findByToken = async function (token) {
  const User = this;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_OR_PRIVATE_KEY);

    const user = await User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });

    return user;
  } catch (e) {
    throw new Error();
  }
};

userSchema.pre('save', async function (next) {
  const User = this;

  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, +process.env.BCRYPT_SALT_ROUNDS);
    next();
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};