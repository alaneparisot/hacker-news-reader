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
  const User = this;
  const access = 'auth';
  const payload = {
    _id: User._id.toHexString(),
    access
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_OR_PRIVATE_KEY).toString();

  try {
    await User.save();
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