const db = require('../database');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helper/sql');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ExpressError,
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config');

class User {
  static async authenticate(username, password) {
    const res = await db.query(
      `SELECT
        username,
        password,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    const user = res.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError('Username and/or Password incorrect');
  }

  static async register({ username, password, firstName, lastName, email, isAdmin }) {
    const duplicateCheck = await db.query(
      `
      SELECT username
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const res = await db.query(
      `
      INSERT INTO users
      (username, password, first_name, last_name, email, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING username, password, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"
      `,
      [username, password, firstName, lastName, email, isAdmin]
    );

    const user = res.row[0];
    return user;
  }

  static async findAll() {
    const res = await db.query(
      `
      SELECT 
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"
      FROM users
      ORDER BY username
      `
    );
    return res.rows;
  }

  static async getOneUser(username) {
    const res = await db.query(
      `
      SELECT
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"
      FROM user
      WHERE username = $1
      `,
      [username]
    );
    const user = res.rows[0];

    if (!user) throw new NotFoundError(`No User: ${username}`);
  }

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: 'first_name',
      lastName: 'last_name',
      isAdmin: 'is_admin',
    });

    const usernameIndex = '$' + (values.length + 1);

    const query = `
      UPDATE users 
      SET ${setCols}
      WHERE username = ${usernameIndex}
      RETURNING 
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"`;

    const res = await db.query(query, [...values, username]);
    const user = res.rows[0];

    if (!user) throw new NotFoundError(`No User: ${username}`);

    delete user.password;
    return user;
  }

  static async deleteUser(username) {
    let res = await db.query(
      `
      DELETE
      FROM users
      WHERE username = $1
      RETURNING username
      `,
      [username]
    );
    const user = res.rows[0];
    if (!user) throw new NotFoundError(`No User: ${username}`);
  }
}

module.exports = User;
