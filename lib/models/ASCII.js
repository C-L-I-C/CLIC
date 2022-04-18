const pool = require('../utils/pool');

module.exports = class ASCII {
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
          ascii (name, string)
        VALUES
          ($1, $2)
        RETURNING
          *
      `,
      [name, string]
    );
    // console.log('NEW MESSAGE', new Message(rows[0]))
    return new ASCII(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
        SELECT
          *
        FROM
          ascii
      `
    );

    // console.log('rows', rows);

    return rows.map((row) => new ASCII(row));
  }

  static async getByName(name) {
    const { rows } = await pool.query(
      `
          SELECT
            *
          FROM
            ascii
          WHERE
            name = $1
        `,
      [name]
    );

    if (!rows[0]) return 'No entry found :(';
    return new ASCII(rows[0]);
  }

  static async deleteByName(name) {
    const { rows } = await pool.query(
      `
        DELETE FROM
          ascii
        WHERE
          name = $1
        RETURNING
          *
      `,
      [name]
    );

    if (!rows[0]) return null;
    return new ASCII(rows[0]);
  }
};
