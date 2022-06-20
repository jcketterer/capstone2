'use strict';
const request = require('supertest');
const db = require('../database.js');
const app = require('../app');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  user1Token,
  adminToken,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST

describe('POST /skill', function () {
  const newSkill = {
    name: 'newSkill',
  };

  test('works for admin users', async function () {
    const res = await request(app)
      .post('/skill')
      .send(newSkill)
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      skill: { ...newSkill },
    });
  });

  test('throws error for non-admin users', async function () {
    const res = await request(app)
      .post('/skill')
      .send(newSkill)
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('throws error when user is not logged in', async function () {
    const res = await request(app)
      .post('/skill')
      .send(newSkill)
      .set('authorization', `Bearer undefined`);
    expect(res.statusCode).toEqual(401);
  });

  test('throws error when missing data', async function () {
    const res = await request(app)
      .post('/skill')
      .send({})
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test('throws error with extra data', async function () {
    const res = await request(app)
      .post('/skill')
      .send({
        name: 'newSkill',
        anotherValue: 'value',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

//GET

describe('GET /skill', function () {
  test('works for nonadmin', async function () {
    const res = await request(app).get('/skill').set('authorization', `Bearer ${user1Token}`);
    expect(res.body).toEqual({
      skills: [
        {
          name: 'Sk1',
          skillId: 1,
        },
        {
          name: 'Sk2',
          skillId: 2,
        },
        {
          name: 'Sk3',
          skillId: 3,
        },
        {
          name: 'Sk4',
          skillId: 4,
        },
      ],
    });
  });

  test('works for admin', async function () {
    const res = await request(app).get('/skill').set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      skills: [
        {
          name: 'Sk1',
          skillId: 1,
        },
        {
          name: 'Sk2',
          skillId: 2,
        },
        {
          name: 'Sk3',
          skillId: 3,
        },
        {
          name: 'Sk4',
          skillId: 4,
        },
      ],
    });
  });

  test('work with filter for emails', async function () {
    const query = { name: 'Sk1' };
    const res = await request(app)
      .get('/skill')
      .query(query)
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.body).toEqual({
      skills: [
        {
          name: 'Sk1',
          email: 'test@example.com',
        },
        {
          name: 'Sk1',
          email: 'test2@example.com',
        },
      ],
    });
  });

  test('throws empty array if no emails are associated with skill', async function () {
    const query = { name: '34242' };
    const res = await request(app)
      .get('/skill')
      .query(query)
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      skills: [],
    });
  });

  test('test the next() handler', async function () {
    await db.query('DROP TABLE skills CASCADE');
    const res = await request(app).get('/skill').set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(500);
  });
});

//PATCH

describe('PATCH /skill/:name', function () {
  test('should work as admin', async function () {
    const res = await request(app)
      .patch('/skill/Sk1')
      .send({
        name: 'skill1',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      skills: {
        name: 'skill1',
      },
    });
  });

  test('should throw unauthorized error if not admin', async function () {
    const res = await request(app)
      .patch('/skill/Sk1')
      .send({
        name: 'skill1',
      })
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('should throw unauthorized someone not logged in', async function () {
    const res = await request(app).patch('/skill/Sk1').send({
      name: 'skill1',
    });
    expect(res.statusCode).toEqual(401);
  });

  test('should throw not found if skill is not valid', async function () {
    const res = await request(app)
      .patch('/skill/Sk1234')
      .send({
        name: 'skill1234',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

//DELETE

describe('DELETE /skill/:name', function () {
  test('should work as admin', async function () {
    const res = await request(app)
      .delete('/skill/Sk4')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      deleted: 'Sk4',
    });
  });

  test('should not work for non-admin users', async function () {
    const res = await request(app)
      .delete('/skill/Sk4')
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('should not work someone not logged in', async function () {
    const res = await request(app).delete('/skill/Sk4');
    expect(res.statusCode).toEqual(401);
  });

  test('should not work if skill is not valid', async function () {
    const res = await request(app)
      .delete('/skill/Sk555666')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});
