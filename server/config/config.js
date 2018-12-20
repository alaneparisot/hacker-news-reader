const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) => process.env[key] = envConfig[key]);
}

/*
Example of config.json:
{
  "development": {
    "BCRYPT_SALT_ROUNDS": 10,
    "JWT_SECRET_OR_PRIVATE_KEY": "shhhhh",
    "MONGODB_URI": "mongodb://127.0.0.1:27017/HackerNewsReader",
    "PORT": 3000
  },
  "test": {
    "BCRYPT_SALT_ROUNDS": 10,
    "JWT_SECRET_OR_PRIVATE_KEY": "shhhhh",
    "MONGODB_URI": "mongodb://127.0.0.1:27017/HackerNewsReaderTest",
    "PORT": 3000
  }
}
*/