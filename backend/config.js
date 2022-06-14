'use strict';

const SECRET_KEY = process.env.SECRET_KEY || 'secret-key';

const PORT = +process.env.PORT || 3001;

//Conditional to use prod DB or test DB
function getDatabase() {
  return process.env.NODE_ENV === 'test'
    ? 'advocate_test'
    : process.env.DATABASE_URL || 'advocate';
}

//speed up bcrypt in test env...lowering work factor
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 13;

console.log('Advocate Config');
console.log('SECRET_KEY', SECRET_KEY);
console.log('PORT:', PORT.toString());
console.log('BCRYPT_WORK_FACTOR:', BCRYPT_WORK_FACTOR);
console.log('Database:', getDatabase());
console.log('==========');

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabase,
};
