const request = require('supertest');

const app = require('./app');
const db = require('./database');

test('should throw not found error with incorrect route', async function () {
  const res = await request(app).get('/not-right-path');
  expect(res.statusCode).toEqual(404);
});

test('404 - and error messages', async function () {
  process.env.NODE_ENV = '';
  const res = await request(app).get('/not-right-path');
  expect(res.statusCode).toEqual(404);
  delete process.env.NODE_ENV;
});

afterAll(function () {
  db.end();
});
