const bcrypt = require('bcrypt');

const db = require('../database.js');

const { BCRYPT_WORK_FACTOR } = require('../config');

async function commonBeforeAll() {
  await db.query('TRUNCATE TABLE skills CASCADE');
  console.log('TRUNCATED SKILLS');
  await db.query('TRUNCATE TABLE advocate RESTART IDENTITY CASCADE');
  console.log('TRUNCATED ADVOCATE');
  await db.query('TRUNCATE TABLE users CASCADE');
  console.log('TRUNCATED USERS');

  let advocate = await db.query(
    `
    INSERT INTO advocate
    (first_name, last_name, email, hire_date, milestone, current_milestone_start_date, team_lead, manager)
    VALUES 
    ('jim', 'jones', 'jj@test.com', '2019-01-01', 'M3', '2020-01-01', 'TL1', 'MGMT1'),
    ('jane', 'doe', 'jd@test.com', '2019-02-02', 'M1', '2020-02-02', 'TL2', 'MGMT2'),
    ('bob', 'smith', 'bs@test.com', '2019-01-31', 'M2', '2020-03-03', 'TL1', 'MGMT1')
    RETURNING first_name, last_name`
  );
  console.log(`ADDED ${advocate.rows.length} ADOVCATES`);

  let users = await db.query(
    `
      INSERT INTO users
      (username, password, first_name, last_name, email)
      VALUES ('u1', $1, '1FN', '1LN', 'u1@test.com'),
      ('u2', $2, '2FN', '2LN', 'u2@test.com')
      RETURNING username
    `,
    [
      await bcrypt.hash('password1', BCRYPT_WORK_FACTOR),
      await bcrypt.hash('password2', BCRYPT_WORK_FACTOR),
    ]
  );
  console.log(`ADDED ${users.rows.length} USERS`);

  let skills = await db.query(
    `
      INSERT INTO skills (name)
      VALUES('sk1'),
      ('sk2'),
      ('sk3')
      RETURNING name`
  );
  console.log(`ADD ${skills.rows.length} SKILLS`);

  let advocateSkills = await db.query(
    `
      INSERT INTO advocate_skills (advocates_id, skill_name)
      VALUES 
        (1,'sk1'),
        (1, 'sk2'),
        (2, 'sk1'),
        (3, 'sk1')
      RETURNING advocates_id`
  );
  console.log(`ADDED ${advocateSkills.rows.length} SKILL TO ADVOCATES`);
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
