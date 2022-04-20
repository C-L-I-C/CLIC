const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class Admin {
  id;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        admins (email, password_hash)
      VALUES
        ($1, $2)
      RETURNING
        *
      `,
      [email, passwordHash]
    );

    return new Admin(rows[0]);
  }

  static async findByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        admins
      WHERE
        email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;
    return new Admin(rows[0]);
  }

  authToken() {
    return jwt.sign({ ...this }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
