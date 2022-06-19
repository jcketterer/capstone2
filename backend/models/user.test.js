'use strict';

const { fail } = require('assert');
const parse = require('postgres-date');
const db = require('../database.js');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../expressError');
const User = require('./user.js');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//AUTHENTICATION

describe('authentication test', function () {
  test('shold authenticate user', async function () {
    const user = await User.authenticate('u1', 'password1');
    expect(user).toEqual({
      username: 'u1',
      firstName: '1FN',
      lastName: '1LN',
      email: 'u1@test.com',
      isAdmin: false,
    });
  });

  test('should throw error if on username entered', async function () {
    try {
      await User.authenticate('baduser', 'password1');
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test('should throw error with incorrect password', async function () {
    try {
      await User.authenticate('u1', 'bogusword');
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

//REGISTERING NEW USER

describe('registration of a user', function () {
  const newUser = {
    username: 'newuser',
    firstName: 'new',
    lastName: 'user',
    email: 'user@example.com',
    isAdmin: false,
  };

  test('works as expected', async function () {
    let user = await User.register({
      ...newUser,
      password: 'password',
    });
    expect(user).toEqual(newUser);
    const locatedUser = await db.query("SELECT * FROM users WHERE first_name = 'new'");
    expect(locatedUser.rows.length).toEqual(1);
    expect(locatedUser.rows[0].is_admin).toEqual(false);
    expect(locatedUser.rows[0].password.startsWith('$2b$')).toEqual(true);
  });

  test('works adding admin', async function () {
    let user = await User.register({
      ...newUser,
      password: 'password',
      isAdmin: true,
    });

    expect(user).toEqual({ ...newUser, isAdmin: true });

    const locatedUser = await db.query("SELECT * FROM users WHERE username = 'newuser'");

    expect(locatedUser.rows.length).toEqual(1);
    expect(locatedUser.rows[0].is_admin).toEqual(true);
    expect(locatedUser.rows[0].password.startsWith('$2b$')).toEqual(true);
  });

  test('throws error with duplicate user info', async function () {
    try {
      await User.register({
        ...newUser,
        password: 'password',
      });
      await User.register({
        ...newUser,
        password: 'password',
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

//REQUEST ALL USERS AND USER INFO

describe('find all users', function () {
  test('works at all pulling all users and their info only as admin', async function () {
    const users = await User.findAll();
    expect(users.length).toBe(2);
  });
});

//TESTING GET REQUEST FOR USERS BY USERNAME

describe('get routes', function () {
  test('should pull user information', async function () {
    let user = await User.get('u1');
    expect(user).toEqual({
      username: 'u1',
      firstName: '1FN',
      lastName: '1LN',
      email: 'u1@test.com',
      isAdmin: false,
    });
  });

  test('should throw error if no user is found', async function () {
    try {
      await User.get('billybob');
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

//UPDATING USER INFO

describe('updating user info', function () {
  const updatedUserInfo = {
    username: 'u1',
    firstName: 'firstname',
    lastName: 'lastname',
    email: 'user1@test.com',
    isAdmin: true,
  };

  test('should update info', async function () {
    let user = await User.update('u1', updatedUserInfo);
    expect(user).toEqual({
      username: 'u1',
      ...updatedUserInfo,
    });
  });

  test('should work at resetting password', async function () {
    let user = await User.update('u1', { password: 'new' });

    expect(user).toEqual({
      username: 'u1',
      firstName: '1FN',
      lastName: '1LN',
      email: 'u1@test.com',
      isAdmin: false,
    });
    const locatedUser = await db.query("SELECT * FROM users WHERE username = 'u1'");

    expect(locatedUser.rows.length).toEqual(1);
    expect(locatedUser.rows[0].password.startsWith('$2b$')).toEqual(true);
  });

  test('should throw error if user isnt found', async function () {
    try {
      await User.update('morty', { firstName: 'test' });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test('should throw error if no data provided', async function () {
    try {
      await User.update('u1', {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

//REMOVING USER

describe('removing a user', function () {
  test('should remove a user', async function () {
    await User.remove('u1');
    const res = await db.query("SELECT * FROM users WHERE username = 'u1'");
    expect(res.rows.length).toEqual(0);
  });

  test('should throw error if user not found', async function () {
    try {
      await User.remove('foo');
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
