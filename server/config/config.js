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
    "MONGODB_URI": "mongodb://localhost:27017/HackerNewsReader",
    "PORT": 3000
  },
  "test": {
    "MONGODB_URI": "mongodb://localhost:27017/HackerNewsReaderTest",
    "PORT": 3000
  }
}
*/