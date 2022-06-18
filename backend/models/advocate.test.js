'use strict';

const { fail } = require('assert');
const parse = require('postgres-date');
const db = require('../database.js');
const { BadRequestError, NotFoundError } = require('../expressError');
const Advocate = require('./advocate.js');

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

// TESTING ADVOCATE CREATING

describe('add new advocate route', function () {
  let hDate = parse('2022-01-01');
  let mDate = parse('2022-01-29');
  const newAdvocate = {
    firstName: 'first',
    lastName: 'last',
    email: 'first@example.com',
    hireDate: hDate,
    milestone: 'M1',
    current_milestone_start_date: mDate,
    teamLead: 'TL1',
    manager: 'MGMT1',
  };

  test('works adding new advocate', async function () {
    let advocate = await Advocate.newAdvo(newAdvocate);
    expect(advocate).toEqual({ advocateId: 4, ...newAdvocate });

    const res = await db.query(
      `
        SELECT
          advocate_id AS "advocateId",
          first_name AS "firstName",
          last_name AS "lastName",
          email,
          hire_date AS "hireDate",
          milestone,
          current_milestone_start_date,
          team_lead AS "teamLead",
          manager
        FROM advocate
        WHERE first_name = 'first'
      `
    );
    expect(res.rows).toEqual([
      {
        advocateId: 4,
        firstName: 'first',
        lastName: 'last',
        email: 'first@example.com',
        hireDate: hDate,
        milestone: 'M1',
        current_milestone_start_date: mDate,
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
    ]);
  });
});

// TESTING FIND AND FIND WITH FILTERS

describe('testing find all function', function () {
  test('works with no filters added', async function () {
    let advocates = await Advocate.findAll();
    expect(advocates).toEqual([
      {
        advocateId: 1,
        firstName: 'jim',
        lastName: 'jones',
        email: 'jj@test.com',
        hireDate: parse('2019-01-01'),
        milestone: 'M3',
        current_milestone_start_date: parse('2020-01-01'),
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
      {
        advocateId: 2,
        firstName: 'jane',
        lastName: 'doe',
        email: 'jd@test.com',
        hireDate: parse('2019-02-02'),
        milestone: 'M1',
        current_milestone_start_date: parse('2020-02-02'),
        teamLead: 'TL2',
        manager: 'MGMT2',
      },
      {
        advocateId: 3,
        firstName: 'bob',
        lastName: 'smith',
        email: 'bs@test.com',
        hireDate: parse('2019-01-31'),
        milestone: 'M2',
        current_milestone_start_date: parse('2020-03-03'),
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
    ]);
  });
});

describe('testing find advocate with search filters', function () {
  test('works with all filters', async function () {
    let filters = {
      firstName: 'bob',
      lastName: 'smith',
      email: 'bs@test.com',
      milestone: 'M2',
      teamLead: 'TL1',
      manager: 'MGMT1',
    };
    let advocates = await Advocate.advoFilter(filters);

    expect(advocates).toEqual([
      {
        advocateId: 3,
        firstName: 'bob',
        lastName: 'smith',
        email: 'bs@test.com',
        hireDate: parse('2019-01-31'),
        milestone: 'M2',
        current_milestone_start_date: parse('2020-03-03'),
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
    ]);
  });

  test('works with only some or one filter(s)', async function () {
    let filters = {
      milestone: 'M2',
    };
    let advocates = await Advocate.advoFilter(filters);

    expect(advocates).toEqual([
      {
        advocateId: 3,
        firstName: 'bob',
        lastName: 'smith',
        email: 'bs@test.com',
        hireDate: parse('2019-01-31'),
        milestone: 'M2',
        current_milestone_start_date: parse('2020-03-03'),
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
    ]);
  });

  test('works with zero filters added', async function () {
    let filters = {};
    let advocates = await Advocate.advoFilter(filters);

    expect(advocates).toEqual([
      {
        advocateId: 1,
        firstName: 'jim',
        lastName: 'jones',
        email: 'jj@test.com',
        hireDate: parse('2019-01-01'),
        milestone: 'M3',
        current_milestone_start_date: parse('2020-01-01'),
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
      {
        advocateId: 2,
        firstName: 'jane',
        lastName: 'doe',
        email: 'jd@test.com',
        hireDate: parse('2019-02-02'),
        milestone: 'M1',
        current_milestone_start_date: parse('2020-02-02'),
        teamLead: 'TL2',
        manager: 'MGMT2',
      },
      {
        advocateId: 3,
        firstName: 'bob',
        lastName: 'smith',
        email: 'bs@test.com',
        hireDate: parse('2019-01-31'),
        milestone: 'M2',
        current_milestone_start_date: parse('2020-03-03'),
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
    ]);
  });
});

// TESTING GET by ID

describe('get', function () {
  test('should return advocate with skills', async function () {
    let advocate = await Advocate.get(1);
    expect(advocate).toEqual({
      advocateId: 1,
      firstName: 'jim',
      lastName: 'jones',
      email: 'jj@test.com',
      hireDate: parse('2019-01-01'),
      milestone: 'M3',
      current_milestone_start_date: parse('2020-01-01'),
      teamLead: 'TL1',
      manager: 'MGMT1',
      skills: [
        {
          skillName: 'sk1',
        },
        {
          skillName: 'sk2',
        },
      ],
    });
  });

  test('should throw not found error if no advocate is present', async function () {
    try {
      await Advocate.get(87683123);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// UPDATE

describe('updating an advocates info', function () {
  const update = {
    firstName: 'Jim',
    lastName: 'Jones',
    email: 'jjones@test.com',
    milestone: 'M4',
    current_milestone_start_date: parse('2022-04-01'),
    teamLead: 'TL3',
    manager: 'MGMT2',
  };

  test('should update advocate with new data', async function () {
    let advocate = await Advocate.update(1, update);

    expect(advocate).toEqual({
      advocateId: 1,
      hireDate: parse('2019-01-01'),
      ...update,
    });

    const res = await db.query(
      `
      SELECT
      advocate_id AS "advocateId",
      first_name AS "firstName",
      last_name AS "lastName",
      email,
      hire_date AS "hireDate",
      milestone,
      current_milestone_start_date,
      team_lead AS "teamLead",
      manager
    FROM advocate
    WHERE advocate_id = 1
      `
    );

    expect(res.rows).toEqual([
      {
        advocateId: 1,
        firstName: 'Jim',
        lastName: 'Jones',
        email: 'jjones@test.com',
        hireDate: parse('2019-01-01'),
        milestone: 'M4',
        current_milestone_start_date: parse('2022-04-01'),
        teamLead: 'TL3',
        manager: 'MGMT2',
      },
    ]);
  });

  test('works with partial data', async function () {
    const updateWithPartialData = {
      firstName: 'JIM',
    };

    let advocate = await Advocate.update(1, updateWithPartialData);
    expect(advocate).toEqual({
      advocateId: 1,
      lastName: 'jones',
      email: 'jj@test.com',
      hireDate: parse('2019-01-01'),
      milestone: 'M3',
      current_milestone_start_date: parse('2020-01-01'),
      teamLead: 'TL1',
      manager: 'MGMT1',
      ...updateWithPartialData,
    });

    const res = await db.query(
      `
      SELECT
      advocate_id AS "advocateId",
      first_name AS "firstName",
      last_name AS "lastName",
      email,
      hire_date AS "hireDate",
      milestone,
      current_milestone_start_date,
      team_lead AS "teamLead",
      manager
    FROM advocate
    WHERE advocate_id = 1
      `
    );

    expect(res.rows).toEqual([
      {
        advocateId: 1,
        firstName: 'JIM',
        lastName: 'jones',
        email: 'jj@test.com',
        hireDate: parse('2019-01-01'),
        milestone: 'M3',
        current_milestone_start_date: parse('2020-01-01'),
        teamLead: 'TL1',
        manager: 'MGMT1',
      },
    ]);
  });

  test('should throw error if there is no advocate found with ID', async function () {
    try {
      await Advocate.update(234242, update);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test('should throw error if there is no data provided', async function () {
    try {
      await Advocate.update(2, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

//REMOVING ADVOCATE

describe('removing advocate', function () {
  test('should remove advocate by ID', async function () {
    await Advocate.remove(1);
    const res = await db.query('SELECT advocate_id FROM advocate WHERE advocate_id = 1');
    expect(res.rows.length).toEqual(0);
  });

  test('throws error if id is not found', async function () {
    {
      try {
        await Advocate.remove(342342);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    }
  });
});

//ADDING SKILL TO ADVOCATE

describe('adding skill to advocates', function () {
  test('works as expected', async function () {
    const newAddedSkill = await Advocate.addSkill(1, { name: 'sk3' });
    expect(newAddedSkill).toEqual({
      advocatesId: 1,
      skillName: 'sk3',
    });
    const advocate = await Advocate.get(1);

    expect(advocate.skills).toEqual([
      {
        skillName: 'sk1',
      },
      {
        skillName: 'sk2',
      },
      {
        skillName: 'sk3',
      },
    ]);
  });

  test('throws error when bad skill is attemped to be updated', async function () {
    try {
      await Advocate.addSkill(2, { name: 'Skill Oopsies' });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test('throws error with invalid advocate', async function () {
    try {
      await Advocate.addSkill(123123, { name: 'sk3' });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test('throws error when no data is passed', async function () {
    try {
      await Advocate.addSkill(2, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test('throws error when skill is already added to advocate', async function () {
    try {
      await Advocate.addSkill(2, { name: 'sk1' });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

//REMOVING SKILL FROM ADVOCATE

describe('removing skill from advocate', function () {
  test('removes skill from advocate', async function () {
    const deletedSkill = await Advocate.removeSkill(1, 'sk2');
    expect(deletedSkill.skillRemoved).toEqual({
      advocateId: 1,
      skillName: 'sk2',
    });
  });

  test('throws error with invalid advocate ID', async function () {
    try {
      await Advocate.removeSkill(12312314, 'sk2');
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test('throws error when no data provided', async function () {
    try {
      await Advocate.removeSkill();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test('throws error when skill is not assigned to advocate', async function () {
    try {
      await Advocate.removeSkill(1, 'what skill?');
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
