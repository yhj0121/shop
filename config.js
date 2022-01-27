const dotenv =require('dotenv');

dotenv.config();

function required(key,dafaultValue = undefined)
{
  const value = process.env[key] || dafaultValue;
  if(value == null)
  {
    throw new Error(`key ${key} is undieined`);
  }
  return value;
}

const config = {
  db: {
    host:required('DB_HOST'),
  },
  bc: {
    salt: parseInt(required('SALT', 12)),
  },
};

module.exports = config;