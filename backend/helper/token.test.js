const jwt = require('jsonwebtoken');
const { createToken } = require('./token');
const { SECRET_KEY } = require('../config');

describe('functionality of the token file', function () {
  test('works as admin', function () {
    const token = createToken({ username: 'test', isAdmin: true });
    const payload = jwt.verify(token, SECRET_KEY);

    expect(payload).toEqual({
      iat: expect.any(Number),
      username: 'test',
      isAdmin: true,
    });
  });

  test('works as not admin', function () {
    const token = createToken({ username: 'test', is_admin: false });
    const payload = jwt.verify(token, SECRET_KEY);

    expect(payload).toEqual({
      iat: expect.any(Number),
      username: 'test',
      isAdmin: false,
    });
  });

  test('works as default not admin', function () {
    const token = createToken({ username: 'test' });
    const payload = jwt.verify(token, SECRET_KEY);

    expect(payload).toEqual({
      iat: expect.any(Number),
      username: 'test',
      isAdmin: false,
    });
  });
});
