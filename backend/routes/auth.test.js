'use strict';

const request = require('supertest');
const app = require('../app');

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

// POST

describe('POST /auth/token', function () {
  test('works and provides token with correct password and username', async function () {
    const res = await request(app).post('/auth/token').send({
      username: 'testuser',
      password: 'testpassword1',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      token: expect.any(String),
    });
  });

  test('throws error with incorrect username', async function () {
    const res = await request(app).post('/auth/token').send({
      username: 'wrong',
      password: 'testpassword1',
    });
    expect(res.statusCode).toEqual(401);
  });

  test('throws error with incorrect password', async function () {
    const res = await request(app).post('/auth/token').send({
      username: 'testuser',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toEqual(401);
  });

  test('throws bad request with missing info', async function () {
    const res = await request(app).post('/auth/token').send({
      username: 'testuser',
    });
    expect(res.statusCode).toEqual(400);
  });

  test('throws bad request with invalid data', async function () {
    const res = await request(app).post('/auth/token').send({
      username: 4353,
      password: 'wordpass',
    });
    expect(res.statusCode).toEqual(400);
  });
});

describe('POST /auth/reg', function () {
  test('works for new user', async function () {
    const res = await request(app).post('/auth/reg').send({
      username: 'user4',
      firstName: 'U',
      lastName: 'ser',
      email: 'user4@example.com',
      password: 'testpassword4',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      token: expect.any(String),
    });
  });

  test('throws bad request with missing data', async function () {
    const res = await request(app).post('/auth/reg').send({
      username: 'user',
    });
    expect(res.statusCode).toEqual(400);
  });

  test('throws bad request with invalid data', async function () {
    const res = await request(app).post('/auth/reg').send({
      username: 'user4',
      firstName: 'U',
      lastName: 'ser',
      email: 'bademail',
      password: 'testpassword4',
    });
    expect(res.statusCode).toEqual(400);
  });
});
