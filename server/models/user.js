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

  try {
    await user.save();
    return token;
  } catch (e) {
    console.error('Unable to save user while generating authentication token.', e);
  }
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, +process.env.BCRYPT_SALT_ROUNDS);
    next();
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};