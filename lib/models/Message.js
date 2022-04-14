const pool = require('../utils/pool');

module.exports = class Message {
  id;
  message;
  userId;
  createdAt;

  constructor(row) {
    this.id = row.id;
    this.message = row.message;
    this.userId = row.user_id;
    this.createdAt = row.created_at;
  }

  static async insert({ message, userId }) {
    const { rows } = await pool.query(
      `
            INSERT INTO 
                messages (message, user_id) 
            VALUES 
                ($1, $2) 
            RETURNING 
                *
            `,
      [message, userId]
    );
    // console.log('NEW MESSAGE', new Message(rows[0]))
    return new Message(rows[0]);
  }
};
