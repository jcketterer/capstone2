const db = require('../database');
const { BadRequestError, NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helper/sql');

class Advocate {
  /**
   * Returns All Advocates
   *
   * Ideally would add pagination since there are a lot more than 25 advocates
   */

  static async findAll(orderBy = 'name') {
    const advocateRes = await db.query(
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
        ORDER BY $1
      `,
      [orderBy]
    );
    return advocateRes.rows;
  }

  /**
   * Creates one advocate
   */

  static async newAdvo({
    firstName,
    lastName,
    email,
    hireDate,
    milestone,
    current_milestone_start_date,
    teamLead,
    manager,
  }) {
    if (!(firstName && lastName)) throw new BadRequestError('Must provide first and name');

    const res = await db.query(
      `
        INSERT INTO advocate
        (first_name, last_name, email, hire_date, milestone, current_milestone_start_date, team_lead, manager)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING advocate_id AS "advocateId", first_name AS "firstName", last_name AS "lastName", email, hire_date AS "hireDate", milestone, current_milestone_start_date, team_lead AS "teamLead", manager
      `,
      [
        firstName,
        lastName,
        email,
        hireDate,
        milestone,
        current_milestone_start_date,
        teamLead,
        manager,
      ]
    );

    const advocate = res.rows[0];

    return advocate;
  }

  static async advoFilter(filters, orderBy = 'name') {
    const { firstName, lastName, email, milestone, teamLead, manager } = filters || {};

    if (!(firstName || lastName || email || milestone || teamLead || manager))
      return Advocate.findAll(orderBy);

    let filterStr = '';
    let val = [];

    if (firstName) {
      filterStr += 'first_name ILIKE $1';
      val.push(`%${firstName}%`);
    }

    if (lastName) {
      if (val.length > 0) filterStr += ' AND ';

      filterStr += 'last_name ILIKE $' + (val.length + 1);
      val.push(`%${lastName}%`);
    }

    if (email) {
      if (val.length > 0) filterStr += ' AND ';

      filterStr += 'email ILIKE $' + (val.length + 1);
      val.push(`%${email}%`);
    }
    if (milestone) {
      if (val.length > 0) filterStr += ' AND ';

      filterStr += 'milestone ILIKE $' + (val.length + 1);
      val.push(`%${milestone}%`);
    }

    if (teamLead) {
      if (val.length > 0) filterStr += ' AND ';

      filterStr += 'team_lead ILIKE $' + (val.length + 1);
      val.push(`%${teamLead}%`);
    }

    if (manager) {
      if (val.length > 0) filterStr += ' AND ';

      filterStr += 'manager ILIKE $' + (val.length + 1);
      val.push(`%${manager}%`);
    }

    const advocateRes = await db.query(
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
        WHERE ${filterStr}
        ORDER BY $${val.length + 1}
      `,
      [...val, orderBy]
    );
    return advocateRes.rows;
  }

  static async get(id) {
    let advocateRes = await db.query(
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
        WHERE advocate_id = $1
      `,
      [id]
    );

    let advocate = advocateRes.rows[0];

    if (!advocate) throw new NotFoundError(`Adovcate Not Found: ${id}`);

    let skillRes = await db.query(
      `
      SELECT ads.skill_name 
      FROM advocate_skills AS ads
      INNER JOIN advocate AS a 
      ON a.advocate_id = ads.advocates_id
      WHERE a.advocate_id = $1;
      `,
      [id]
    );
    advocate.skills = skillRes.rows;

    return advocate;
  }

  static async update(id, data) {
    if (Object.entries(data).length === 0)
      throw new BadRequestError('No data provided for update.');

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: 'first_name',
      lastName: 'last_name',
      hireDate: 'hire_date',
      teamLead: 'team_lead',
    });
    console.log(setCols);

    const idIndex = '$' + (values.length + 1);

    const query = `UPDATE advocate 
                    SET ${setCols}
                    WHERE advocate_id = ${idIndex}
                  RETURNING advocate_id AS "advocateId", 
                            first_name AS "firstName",
                            last_name AS "lastName", 
                            email,
                            hire_date AS "hireDate",
                            milestone, 
                            team_lead AS "teamLead", 
                            manager`;

    console.log(query);

    const res = await db.query(query, [...values, id]);
    const advocate = res.rows[0];

    if (!advocate) throw new NotFoundError(`Advocate with id of ${id} not found.`);

    return advocate;
  }

  static async remove(id) {
    const res = await db.query(
      `
        DELETE
        FROM advocate
        WHERE advocate_id = $1
        RETURNING advocate_id AS "advocateId"
      `,
      [id]
    );

    const advocate = res.rows[0];

    if (!advocate) throw new NotFoundError(`Advocate with id of ${id} not found`);
  }

  static async addSkill(advocateId, skill) {
    const { name } = skill || {};

    if (!name) throw new BadRequestError('Cannot add skill without name');

    let advocateCheck = await db.query(
      `
        SELECT 
          advocate_id,
          first_name,
          last_name
        FROM advocate
        WHERE advocate_id = $1
      `,
      [advocateId]
    );
    if (!advocateCheck.rows[0])
      throw new NotFoundError(`Advocate with id ${advocateId} not found`);

    let skillCheck = await db.query(
      `
        SELECT
          name
        FROM skills
        WHERE name = $1
      `,
      [name]
    );

    if (!skillCheck.rows[0]) throw new NotFoundError(`Skill with name ${name} not found.`);

    let duplicateCheck = await db.query(
      `
        SELECT 
          advocates_id,
          skill_name
        FROM advocate_skills
        WHERE advocates_id = $1 AND skill_name = $2
      `,
      [advocateId, name]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Adovcate ${advocateId} already is skilled for ${name}`);

    let res = await db.query(
      `
        INSERT INTO advocate_skills (advocates_id, skill_name)
        VALUES ($1, $2)
        RETURNING 
          advocates_id AS "advocatesId",
          skill_name AS "skillName"
      `,
      [advocateId, name]
    );

    return res.rows[0];
  }

  static async removeSkill(advocateId, skillName) {
    if (!advocateId || !skillName)
      throw new BadRequestError('Please state an skill and an advocate to remove skill.');

    let advoCheck = await db.query(
      `
        SELECT 
          advocate_id,
          first_name, 
          last_name
        FROM advocate
        WHERE advocate_id = $1
      `,
      [advocateId]
    );

    if (!advoCheck.rows[0])
      throw new NotFoundError(`Advocate with id ${advocateId} not found`);

    let advoDoesHaveSkill = await db.query(
      `
        SELECT
          advocates_id,
          skill_name
        FROM advocate_skills
        WHERE advocates_id = $1 AND skill_name = $2
      `,
      [advocateId, skillName]
    );

    if (!advoDoesHaveSkill.rows[0])
      throw new NotFoundError(`Advocate with id is not skilled for ${skillName}`);

    let res = await db.query(
      `
        DELETE FROM advocate_skills
        WHERE advocates_id = $1 AND skill_name = $2
        RETURNING advocates_id AS "advocateId", skill_name AS "skillName"
      `,
      [advocateId, skillName]
    );

    if (!res.rows[0]) throw new Error('ERROR DURING SKILL REMOVAL');

    return { skillRemoved: res.rows[0] };
  }
}

module.exports = Advocate;
