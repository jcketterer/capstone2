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

/** User model for the Pantry Tracker */

class User {
  /** authenticate with username, password
   *
   *  returns { username, first_name, last_name, email, is_admin }
   *
   *  throws an UnauthorizedError if no such user or bad password
   */

  static async authenticate(username, password) {
    // look for the user
    const res = await db.query(
      `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
                FROM users
                WHERE username = $1`,
      [username]
    );

    const user = res.rows[0];

    if (user) {
      // check hashed password against new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError('Invalid username or password');
  }

  /** register with data
   *
   *  returns { username, firstName, lastName, email, isAdmin }
   *
   *  throws BadRequestError if duplicate
   */

  static async register({ username, password, firstName, lastName, email, isAdmin }) {
    const dupeCheck = await db.query(
      `SELECT username
                FROM users
                WHERE username = $1`,
      [username]
    );

    if (dupeCheck.rows[0]) throw new BadRequestError(`Duplicate username: ${username}`);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const res = await db.query(
      `INSERT INTO users
            (username,
             password,
             first_name,
             last_name,
             email,
             is_admin)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, email, isAdmin]
    );

    const user = res.rows[0];
    return user;
  }

  /** find all users
   *
   *  returns [{username, firstName, lastName, email, isAdmin}, ...]
   */
  static async findAll() {
    const res = await db.query(
      `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
                FROM users
                ORDER BY username`
    );
    return res.rows;
  }

  /** gets one user by username
   *
   *  returns { username, firstName, lastName, isAdmin, ingredients, favoriteRecipes }
   *
   *  throws NotFoundError if user doesn't exist
   */
  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
                FROM users
                WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** partial user update - updates whichever fields are provided
   *
   *  takes (username, data) as params: data object can include
   *  { firstName, lastName, password, email, [and/or] isAdmin }
   *
   *  returns { username, firstName, lastName, email, isAdmin }
   *
   *  NOTE: this function can change passwords and set admin privileges.
   *  Call with care.
   */
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: 'first_name',
      lastName: 'last_name',
      isAdmin: 'is_admin',
    });
    const usernameVarIdx = '$' + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const res = await db.query(querySql, [...values, username]);
    const user = res.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** delete user by username; returns undefined */

  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}
module.exports = User;
