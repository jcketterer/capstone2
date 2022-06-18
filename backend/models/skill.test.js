'use strict';

const { fail } = require('assert');
const parse = require('postgres-date');
const db = require('../database.js');
const { BadRequestError, NotFoundError } = require('../expressError');
const Skill = require('./skill.js');

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

// CREATING A SKILL

describe('creating a skill', function () {
  const newSkill = {
    name: 'sk4',
  };

  test('should add skill to skill list', async function () {
    let skill = await Skill.newSkill(newSkill);
    expect(skill).toEqual(newSkill);

    const res = await db.query(
      `
        SELECT
          name
        FROM skills
        WHERE name = 'sk4'
      `
    );
    expect(res.rows[0]).toEqual(newSkill);
  });

  test('throws error if there is a duplicate', async function () {
    try {
      await Skill.newSkill(newSkill);
      await Skill.newSkill(newSkill);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// GETTING ALL SKILLS LISTED

describe('finding all skills', function () {
  test('will show all skills with no filters', async function () {
    let skills = await Skill.findAll();
    expect(skills.length).toBe(3);
  });
});

// GETTING SKILLS WITH FILTER

describe('finding emails associated with a skill', function () {
  test('should show all emails associated with a skill', async function () {
    let emailFilter = { name: 'sk1' };
    let skill = await Skill.findEmailsPerSkill(emailFilter);

    expect(skill).toEqual([
      {
        name: 'sk1',
        email: 'jj@test.com',
      },
      {
        name: 'sk1',
        email: 'jd@test.com',
      },
      {
        name: 'sk1',
        email: 'bs@test.com',
      },
    ]);
  });

  test('should still work with no filter added', async function () {
    let emailFilter = {};
    let skill = await Skill.findEmailsPerSkill(emailFilter);
    expect(skill.length).toBe(3);
  });
});

//UPDATING SKILL NAME

describe('updating skill name', function () {
  const newSkillName = {
    name: 'newSk1',
  };

  test('should update the name to the new name provided', async function () {
    let skill = await Skill.renameSkill('sk1', newSkillName);
    expect(skill).toEqual({
      ...newSkillName,
    });

    const res = await db.query(
      `
        SELECT 
          name
        FROM skills
        WHERE name = 'newSk1'
      `
    );

    expect(res.rows).toEqual([
      {
        name: 'newSk1',
      },
    ]);
  });

  test('throws error if no skill found', async function () {
    try {
      await Skill.renameSkill('rebuild', newSkillName);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test('throws error if no data provided', async function () {
    try {
      await Skill.renameSkill('sk1', {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

//REMOVING SKILL

describe('removing skills', function () {
  test('should remove skills', async function () {
    await Skill.removeSkill('sk3');
    const res = await db.query("SELECT name FROM skills WHERE name = 'sk3'");
    expect(res.rows.length).toBe(0);
  });

  test('throws error if no skill found', async function () {
    try {
      await Skill.removeSkill('Cap1');
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
