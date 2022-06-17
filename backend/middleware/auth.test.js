'use strict';

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../expressError');
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureAdminOrCorrectUser,
} = require('./auth');

const { SECRET_KEY } = require('../config');

const jwtTest = jwt.sign({ username: 'test', isAdmin: false }, SECRET_KEY);
const invalidJwt = jwt.sign({ username: 'test', isAdmin: false }, 'nope');

describe('authenticating JWT', function () {
  test('works with jwt in header', function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${jwtTest}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: 'test',
        isAdmin: false,
      },
    });
  });

  test('works with no headers', function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test('throws error with incorrect token', function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${invalidJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});

describe('testing ensureLoggedIn', function () {
  test('works properly', function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: 'test', is_admin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test('no access if not logged in', function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe('testing ensureAdmin', function () {
  test('works as admin', function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: 'test', isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test('no access if admin is false', function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: 'test', isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });

  test('no access if no login', function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });
});

describe('testing ensureAdminorCorrectUser', function () {
  test('works as admin', function () {
    expect.assertions(1);
    const req = { params: { username: 'test' } };
    const res = { locals: { user: { username: 'admin', isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdminOrCorrectUser(req, res, next);
  });

  test('works with correct user', function () {
    expect.assertions(1);
    const req = { params: { username: 'test' } };
    const res = { locals: { user: { username: 'test', isAdmin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdminOrCorrectUser(req, res, next);
  });

  test('throws error if not admin or user', function () {
    expect.assertions(1);
    const req = { params: { username: 'notuser' } };
    const res = { locals: { user: { username: 'test', isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminOrCorrectUser(req, res, next);
  });

  test('throws error is not logged in', function () {
    expect.assertions(1);
    const req = { params: { username: 'test' } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminOrCorrectUser(req, res, next);
  });
});
