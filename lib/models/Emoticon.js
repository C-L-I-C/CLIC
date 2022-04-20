const pool = require('../utils/pool');

module.exports = class Emoticon {
  id;
  name;
  string;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.string = row.string;
  }

  static async insert({ name, string }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
          emoticon (name, string)
        VALUES
          ($1, $2)
        RETURNING
          *
      `,
      [name, string]
    );

    if (!rows[0]) return null;
    return new Emoticon(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
        SELECT
          *
        FROM
          emoticon
      `
    );

    return rows.map((row) => new Emoticon(row));
  }

  static async getByName(name) {
    const { rows } = await pool.query(
      `
          SELECT
            *
          FROM
            emoticon
          WHERE
            name = $1
        `,
      [name]
    );

    if (!rows[0]) return 'No entry found :(';
    return new Emoticon(rows[0]);
  }

  static async deleteByName(name) {
    const { rows } = await pool.query(
      `
        DELETE FROM
          emoticon
        WHERE
          name = $1
        RETURNING
          *
      `,
      [name]
    );

    if (!rows[0]) return null;
    return new Emoticon(rows[0]);
  }
};
