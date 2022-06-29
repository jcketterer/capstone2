const db = require('../database');
const { BadRequestError, NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helper/sql');

class Skill {
  static async newSkill({ name }) {
    if (!name) throw new BadRequestError('Must give new skill a Name');

    const duplicateCheck = await db.query(
      `
        SELECT 
          name
        FROM skills
        WHERE name = $1
      `,
      [name]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Skill name: ${name} already exists`);

    const res = await db.query(
      `
        INSERT INTO skills
          (name)
        VALUES ($1)
        RETURNING name
      `,
      [name]
    );

    const skill = res.rows[0];
    return skill;
  }

  static async findAll() {
    const res = await db.query(
      `
        SELECT 
          name,
          skill_id AS "skillId"
        FROM skills
        ORDER BY skill_id
      `
    );
    return res.rows;
  }

  static async findSkillByName(filters) {
    const { name } = filters || {};

    if (!name) return Skill.findAll();

    let filterStr = '';
    let vals = [];

    if (name) {
      filterStr += 'name ILIKE $1';
      vals.push(`%${name}%`);
    }

    const res = await db.query(
      `
        SELECT 
          name
        FROM skills 
        WHERE ${filterStr}
      `,
      vals
    );
    return res.rows;
  }

  static async getSkill(name) {
    let skillRes;

    if (name) {
      skillRes = await db.query(
        `
          SELECT 
            name
          FROM skills
          WHERE name = $1
        `,
        [name]
      );
    } else throw new BadRequestError('Please a skill name');

    let skill = skillRes.rows[0];

    if (!skill) throw new NotFoundError('Skill Not Found');

    return skill;
  }

  static async renameSkill(name, data) {
    if (Object.entries(data).length === 0) {
      throw new BadRequestError('No data provided to update');
    }

    const { setCols, values } = sqlForPartialUpdate(data, {});

    const nameIdx = '$' + (values.length + 1);

    const query = `UPDATE skills SET ${setCols} WHERE name = ${nameIdx}
                    RETURNING name`;

    const res = await db.query(query, [...values, name]);

    const skill = res.rows[0];

    if (!skill) throw new NotFoundError(`Skill with Name ${name} not found.`);
    return skill;
  }

  static async removeSkill(name) {
    const res = await db.query(
      `
        DELETE 
        FROM skills
        WHERE name = $1
        RETURNING name
      `,
      [name]
    );

    const skill = res.rows[0];

    if (!skill) throw new NotFoundError(`Skill with Name ${name} not found.`);
  }
}

module.exports = Skill;
