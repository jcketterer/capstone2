'use strict';
const request = require('supertest');
const db = require('../database.js');
const app = require('../app');
const parse = require('postgres-date');

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

// POST

describe('POST /advo', function () {
  // const hDate = new Date('2022-01-01').toISOString();
  // const mDate = new Date('2022-03-01').toISOString();
  const newAdvocate = {
    firstName: 'new',
    lastName: 'advocate',
    email: 'new@example.com',
    hireDate: '2022-01-01T07:00:00.000Z',
    milestone: 'M1',
    current_milestone_start_date: '2022-03-01T07:00:00.000Z',
    teamLead: 'TL1',
    manager: 'MGMT1',
  };

  test('works for admin user', async function () {
    const res = await request(app)
      .post('/advo')
      .send(newAdvocate)
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ advocate: { advocateId: 4, ...newAdvocate } });
  });

  test('works for non-admin user', async function () {
    const res = await request(app)
      .post('/advo')
      .send(newAdvocate)
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ advocate: { advocateId: 5, ...newAdvocate } });
  });

  test('throws unauthorized error if not logged in', async function () {
    const res = await request(app)
      .post('/advo')
      .send(newAdvocate)
      .set('authorization', `Bearer undefined`);
    expect(res.status).toEqual(401);
  });

  test('throws bad request when no data is provided', async function () {
    const res = await request(app)
      .post('/advo')
      .send({
        name: 'NewAdvo',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.status).toEqual(400);
  });
});

//GET

describe('GET /advo', function () {
  test('works for any user', async function () {
    const res = await request(app).get('/advo');
    expect(res.body).toEqual({
      advocates: [
        {
          advocateId: 1,
          firstName: 'test',
          lastName: 'advo',
          email: 'test@example.com',
          hireDate: '2019-01-01T07:00:00.000Z',
          milestone: 'M1',
          current_milestone_start_date: '2019-05-01T07:00:00.000Z',
          teamLead: 'TL1',
          manager: 'MGMT1',
        },
        {
          advocateId: 2,
          firstName: 'test',
          lastName: 'advo2',
          email: 'test2@example.com',
          hireDate: '2019-02-02T07:00:00.000Z',
          milestone: 'M2',
          current_milestone_start_date: '2019-06-01T07:00:00.000Z',
          teamLead: 'TL2',
          manager: 'MGMT2',
        },
        {
          advocateId: 3,
          firstName: 'test',
          lastName: 'advo3',
          email: 'test3@example.com',
          hireDate: '2019-03-03T07:00:00.000Z',
          milestone: 'M3',
          current_milestone_start_date: '2019-07-01T07:00:00.000Z',
          teamLead: 'TL2',
          manager: 'MGMT2',
        },
      ],
    });
  });

  test('works with most filters', async function () {
    const query = {
      firstName: 't',
      lastName: 'ad',
      email: '@example.com',
      milestone: 'M1',
      teamLead: 'TL1',
      manager: 'MGMT1',
    };
    const res = await request(app).get('/advo').query(query);
    expect(res.body).toEqual({
      advocates: [
        {
          advocateId: 1,
          firstName: 'test',
          lastName: 'advo',
          email: 'test@example.com',
          hireDate: '2019-01-01T07:00:00.000Z',
          milestone: 'M1',
          current_milestone_start_date: '2019-05-01T07:00:00.000Z',
          teamLead: 'TL1',
          manager: 'MGMT1',
        },
      ],
    });
  });

  test('works with one filter', async function () {
    const query = {
      milestone: 'M2',
    };
    const res = await request(app).get('/advo').query(query);
    expect(res.body).toEqual({
      advocates: [
        {
          advocateId: 2,
          firstName: 'test',
          lastName: 'advo2',
          email: 'test2@example.com',
          hireDate: '2019-02-02T07:00:00.000Z',
          milestone: 'M2',
          current_milestone_start_date: '2019-06-01T07:00:00.000Z',
          teamLead: 'TL2',
          manager: 'MGMT2',
        },
      ],
    });
  });

  test('fails with incorrect filters', async function () {
    const query = { favoriteFood: 'pizza' };
    const res = await request(app).get('/advo').query(query);
    expect(res.statusCode).toEqual(400);
  });
});

//GET WITH ID PASSED IN

describe('GET /advo/:id', function () {
  test('works with any user', async function () {
    const res = await request(app).get('/advo/2');
    expect(res.body).toEqual({
      advocate: {
        advocateId: 2,
        firstName: 'test',
        lastName: 'advo2',
        email: 'test2@example.com',
        hireDate: '2019-02-02T07:00:00.000Z',
        milestone: 'M2',
        current_milestone_start_date: '2019-06-01T07:00:00.000Z',
        teamLead: 'TL2',
        manager: 'MGMT2',
        skills: [
          {
            skillName: 'Sk1',
          },
        ],
      },
    });
  });

  test('should work for any use using with no skills', async function () {
    const res = await request(app).get('/advo/3');
    expect(res.body).toEqual({
      advocate: {
        advocateId: 3,
        firstName: 'test',
        lastName: 'advo3',
        email: 'test3@example.com',
        hireDate: '2019-03-03T07:00:00.000Z',
        milestone: 'M3',
        current_milestone_start_date: '2019-07-01T07:00:00.000Z',
        teamLead: 'TL2',
        manager: 'MGMT2',
        skills: [],
      },
    });
  });

  test('throws error with invalid advocate id', async function () {
    const res = await request(app).get('/advo/34234');
    expect(res.statusCode).toEqual(404);
  });
});

//PATCH

describe('PATCH /advo/:id', function () {
  test('updates advocate information only for admin users', async function () {
    const res = await request(app)
      .patch('/advo/1')
      .send({
        firstName: 'User1 New',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      advocate: {
        advocateId: 1,
        firstName: 'User1 New',
        lastName: 'advo',
        email: 'test@example.com',
        hireDate: '2019-01-01T07:00:00.000Z',
        milestone: 'M1',
        current_milestone_start_date: '2019-05-01T07:00:00.000Z',
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
    });
  });

  test('throws unauth error for non-admin users', async function () {
    const res = await request(app)
      .patch('/advo/1')
      .send({
        firstName: 'User1 New',
      })
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('throws unauth error for user not logged in', async function () {
    const res = await request(app).patch('/advo/1').send({
      firstName: 'User1 New',
    });
    expect(res.statusCode).toEqual(401);
  });

  test('throws not found error with invalid advocate id', async function () {
    const res = await request(app)
      .patch('/advo/345345')
      .send({
        firstName: 'New Name',
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test('throws bad req if the id is attemped to be changed', async function () {
    const res = await request(app)
      .patch('/advo/2')
      .send({
        advocateId: 52525,
      })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

//POST FOR ADDING SKILLS TO ADVOCATES

describe('POST /advo/:id/addskill/:name', function () {
  test('should allow admin users to add skills', async function () {
    const res = await request(app)
      .post('/advo/1/addskill/Sk4')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      added: {
        advocatesId: 1,
        skillName: 'Sk4',
      },
    });
  });

  test('should not allow non-admin users to add skills', async function () {
    const res = await request(app)
      .post('/advo/1/addskill/Sk4')
      .set('authorization', `Bearer ${user1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test('should throw unauth for no token provided', async function () {
    const res = await request(app)
      .post('/advo/1/addskill/Sk4')
      .set('authorization', `Bearer undefined`);
    expect(res.statusCode).toEqual(401);
  });

  test('should throw unauth for anyone not logged in', async function () {
    const res = await request(app).post('/advo/1/addskill/Sk4');
    expect(res.statusCode).toEqual(401);
  });

  test('should throw NotFoundError for invalid advocate id', async function () {
    const res = await request(app)
      .post('/advo/48943534/addskill/Sk4')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test('should throw not found for invalid skill', async function () {
    const res = await request(app)
      .post('/advo/1/addskill/Sk1000')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test('should throw bad request if skill is already skilled to advocate', async function () {
    const res = await request(app)
      .post('/advo/1/addskill/Sk1')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

//REMOVING SKILLS FROM ADVOCATES

describe('DELETE /advo/:id/delskill/:name', function () {
  test('should work for admin users', async function () {
    const res = await request(app)
      .delete('/advo/1/delskill/Sk1')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      deletedSkill: {
        advocateId: '1',
        skillName: 'Sk1',
      },
    });
  });
});
