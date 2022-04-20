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

    return rows.map((row) => new Message(row));
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM
        messages
      WHERE
        id=$1
      RETURNING
        *
      `,
      [id]
    );

    console.log(rows[0]);
    if (!rows[0]) return null;
    return new Message(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        messages
      WHERE
        id=$1
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Message(rows[0]);
  }

  static async updateById(id, attributes) {
    const existingMessage = await Message.getById(id);
    const updatedMessage = {
      ...existingMessage,
      ...attributes,
    };

    const { message } = updatedMessage;
    const { rows } = await pool.query(
      `
      UPDATE
        messages
      SET
        message=$2
      WHERE
        id=$1
      RETURNING
        *
      `,
      [id, message]
    );

    if (!rows[0]) return null;
    return new Message(rows[0]);
  }
};
