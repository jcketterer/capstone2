'use strict';
const request = require('supertest');
const db = require('../database.js');
const app = require('../app');
const User = require('../models/user');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  user1Token,
  user2Token,
  adminToken,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//POST

describe('POST /users', function () {
  test('works with admin users creating a non-admin user', async function () {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'newuser',
        firstName: 'new',
        lastName: 'user',
        email: 'newuser@example.com',
        password: 'testpasswordnew',
        isAdmin: false,
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      user: {
        username: 'newuser',
        firstName: 'new',
        lastName: 'user',
        email: 'newuser@example.com',
        isAdmin: false,
      },
      token: expect.any(String),
    });
  });

  test('works for admin creating an admin user', async function () {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'newuser',
        firstName: 'new',
        lastName: 'user',
        email: 'newuser@example.com',
        password: 'testpasswordnew',
        isAdmin: true,
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      user: {
        username: 'newuser',
        firstName: 'new',
        lastName: 'user',
        email: 'newuser@example.com',
        isAdmin: true,
      },
      token: expect.any(String),
    });
  });

  test('throws error with non-admin user', async function () {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'newuser',
        firstName: 'new',
        lastName: 'user',
        email: 'newuser@example.com',
        password: 'testpasswordnew',
        isAdmin: true,
      })
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('throws error with if not logged in', async function () {
    const res = await request(app).post('/users').send({
      username: 'newuser',
      firstName: 'new',
      lastName: 'user',
      email: 'newuser@example.com',
      password: 'testpasswordnew',
      isAdmin: true,
    });
    expect(res.statusCode).toEqual(401);
  });

  test('throws error with missing data', async function () {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'newuser',
        firstName: 'new',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test('throws error with bad data', async function () {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'newuser',
        firstName: 'new',
        lastName: 'user',
        email: 'bademail',
        password: 'testpasswordnew',
        isAdmin: true,
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

//GET

describe('GET /users', function () {
  test('should work with admin users', async function () {
    const res = await request(app).get('/users').set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      users: [
        {
          username: 'testuser',
          firstName: 'test',
          lastName: 'user',
          email: 'user@example.com',
          isAdmin: false,
        },
        {
          username: 'testuser2',
          firstName: 'test2',
          lastName: 'user2',
          email: 'user2@example.com',
          isAdmin: false,
        },
        {
          username: 'testuser3',
          firstName: 'test3',
          lastName: 'user3',
          email: 'user3@example.com',
          isAdmin: false,
        },
      ],
    });
  });

  test('should throw error for non-admin users', async function () {
    const res = await request(app).get('/users').set('authorization', `Bearer ${user1Token}`);

    expect(res.statusCode).toEqual(401);
  });

  test('should throw error anyone not logged in', async function () {
    const res = await request(app).get('/users');

    expect(res.statusCode).toEqual(401);
  });

  test('test the next() handler...should fail', async function () {
    await db.query('DROP TABLE users CASCADE');
    const res = await request(app).get('/users').set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });
});

//GET USERS BY USERNAME

describe('GET /users/:username', function () {
  test('works for admin users', async function () {
    const res = await request(app)
      .get('/users/testuser')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: 'testuser',
        firstName: 'test',
        lastName: 'user',
        email: 'user@example.com',
        isAdmin: false,
      },
    });
  });

  test('works for user searching for themselve', async function () {
    const res = await request(app)
      .get('/users/testuser')
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.body).toEqual({
      user: {
        username: 'testuser',
        firstName: 'test',
        lastName: 'user',
        email: 'user@example.com',
        isAdmin: false,
      },
    });
  });

  test('should throw error if a non-user searches for another user', async function () {
    const res = await request(app)
      .get('/users/testuser')
      .set('authorization', `Bearer ${user2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('should throw error if a user is not logged in', async function () {
    const res = await request(app).get('/users/testuser');
    expect(res.statusCode).toEqual(401);
  });

  test('should throw error if username is not valid', async function () {
    const res = await request(app)
      .get('/users/bogususer')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

//PATCH

describe('PATCH /users/:username', function () {
  test('works for admin users', async function () {
    const res = await request(app)
      .patch('/users/testuser')
      .send({
        firstName: 'TestUser',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: 'testuser',
        firstName: 'TestUser',
        lastName: 'user',
        email: 'user@example.com',
        isAdmin: false,
      },
    });
  });

  test('works for current users', async function () {
    const res = await request(app)
      .patch('/users/testuser')
      .send({
        firstName: 'TestUser',
      })
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.body).toEqual({
      user: {
        username: 'testuser',
        firstName: 'TestUser',
        lastName: 'user',
        email: 'user@example.com',
        isAdmin: false,
      },
    });
  });

  test('should throw error if it is not current user or admin', async function () {
    const res = await request(app)
      .patch('/users/testuser')
      .send({
        firstName: 'TestUser',
      })
      .set('authorization', `Bearer ${user2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('should throw error if user is not logged in', async function () {
    const res = await request(app).patch('/users/testuser').send({
      firstName: 'TestUser',
    });
    expect(res.statusCode).toEqual(401);
  });

  test('should throw error if user name is not found', async function () {
    const res = await request(app)
      .patch('/users/who?')
      .send({
        firstName: 'TestUser',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test('should throw error if data is invalid', async function () {
    const res = await request(app)
      .patch('/users/testuser')
      .send({
        firstName: 45764,
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test('should work to reset password', async function () {
    const res = await request(app)
      .patch('/users/testuser')
      .send({ password: 'newpassword' })
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.body).toEqual({
      user: {
        username: 'testuser',
        firstName: 'test',
        lastName: 'user',
        email: 'user@example.com',
        isAdmin: false,
      },
    });

    const successfulPasswordUpdateCheck = await User.authenticate('testuser', 'newpassword');
    expect(successfulPasswordUpdateCheck).toBeTruthy();
  });
});

//DELETE

describe('DELETE /users/:username', function () {
  test('works for admin user', async function () {
    const res = await request(app)
      .delete('/users/testuser')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      deleted: 'testuser',
    });
  });

  test('works for proper user', async function () {
    const res = await request(app)
      .delete('/users/testuser')
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      deleted: 'testuser',
    });
  });

  test('throws error if a non-admin user attempts to delete another user', async function () {
    const res = await request(app)
      .delete('/users/testuser')
      .set('authorization', `Bearer ${user2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('throws error if user is not logged in', async function () {
    const res = await request(app).delete('/users/testuser');

    expect(res.statusCode).toEqual(401);
  });

  test('throws error if user is not found', async function () {
    const res = await request(app)
      .delete('/users/wronguserwhodis')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});
