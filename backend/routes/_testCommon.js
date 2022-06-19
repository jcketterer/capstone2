'use strict';

const db = require('../database.js');
const User = require('../models/user');
const Advocate = require('../models/advocate');
const Skill = require('../models/skill');
const { createToken } = require('../helper/token');
const parse = require('postgres-date');

async function commonBeforeAll() {
  await db.query('TRUNCATE TABLE skills CASCADE');
  await db.query('TRUNCATE TABLE advocate RESTART IDENTITY CASCADE');
  await db.query('TRUNCATE TABLE users CASCADE');

  await Advocate.newAdvo({
    firstName: 'test',
    lastName: 'advo',
    email: 'test@example.com',
    hireDate: '2019-01-01',
    milestone: 'M1',
    current_milestone_start_date: '2019-05-01',
    teamLead: 'TL1',
    manager: 'MGMT1',
  });
  await Advocate.newAdvo({
    firstName: 'test',
    lastName: 'advo2',
    email: 'test2@example.com',
    hireDate: '2019-02-02',
    milestone: 'M2',
    current_milestone_start_date: '2019-06-01',
    teamLead: 'TL2',
    manager: 'MGMT2',
  });
  await Advocate.newAdvo({
    firstName: 'test',
    lastName: 'advo3',
    email: 'test3@example.com',
    hireDate: '2019-03-03',
    milestone: 'M3',
    current_milestone_start_date: '2019-07-01',
    teamLead: 'TL2',
    manager: 'MGMT2',
  });

  await Skill.newSkill({
    name: 'Sk1',
  });
  await Skill.newSkill({
    name: 'Sk2',
  });
  await Skill.newSkill({
    name: 'Sk3',
  });
  await Skill.newSkill({
    name: 'Sk4',
  });

  await User.register({
    username: 'testuser',
    firstName: 'test',
    lastName: 'user',
    email: 'user@example.com',
    password: 'testpassword1',
    isAdmin: false,
  });
  await User.register({
    username: 'testuser2',
    firstName: 'test2',
    lastName: 'user2',
    email: 'user2@example.com',
    password: 'testpassword2',
    isAdmin: false,
  });
  await User.register({
    username: 'testuser3',
    firstName: 'test3',
    lastName: 'user3',
    email: 'user3@example.com',
    password: 'testpassword3',
    isAdmin: false,
  });

  await Advocate.addSkill(1, { name: 'Sk1' });
  await Advocate.addSkill(1, { name: 'Sk2' });
  await Advocate.addSkill(2, { name: 'Sk1' });
}

async function commonBeforeEach() {
  await db.query('BEGIN');
}

async function commonAfterEach() {
  await db.query('ROLLBACK');
}

async function commonAfterAll() {
  await db.end();
}

const user1Token = createToken({ username: 'testuser', isAdmin: false });
const user2Token = createToken({ username: 'testuser2', isAdmin: false });
const adminToken = createToken({ username: 'admin', isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  user1Token,
  user2Token,
  adminToken,
};
