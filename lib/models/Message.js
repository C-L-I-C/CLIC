const pool = require('../utils/pool');

module.exports = class Message {
  id;
  message;
  userId;
  createdAt;
  username;

  constructor(row) {
    this.id = row.id;
    this.message = row.message;
    this.userId = row.user_id;
    this.createdAt = row.created_at;
    this.username = row.username;
  }

  static async insert({ message, userId, username }) {
    const { rows } = await pool.query(
      `
        INSERT INTO 
          messages (message, user_id, username)
        VALUES 
          ($1, $2, $3) 
        RETURNING 
          *
      `,
      [message, userId, username]
    );
    // console.log('NEW MESSAGE', new Message(rows[0]))
    return new Message(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
        SELECT
          *
        FROM
          messages
      `
    );
    return rows.map((row) => new Message(row));
  }

  static async getHistory() {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        messages
      ORDER BY
        created_at ASC
      LIMIT
        10;
      `
    );

    console.log('rows from model', rows);

    return rows.map((row) => new Message(row));
  }
};
