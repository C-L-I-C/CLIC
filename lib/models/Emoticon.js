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
          emoticons (name, string)
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
          emoticons
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
            emoticons
          WHERE
            name = $1
        `,
      [name]
    );

    if (!rows[0]) return 'No entry found :(';
    return new Emoticon(rows[0]);
  }

  static async updateByName(emoticon, attributes) {
    const existing = await Emoticon.getByName(emoticon);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...attributes,
    };

    const { name, string } = updated;

    const { rows } = await pool.query(
      `
      UPDATE
        emoticons
      SET
        name=$2, string=$3
      WHERE
        name=$1
      RETURNING
        *
      `,
      [emoticon, name, string]
    );

    if (!rows[0]) return null;
    return new Emoticon(rows[0]);
  }

  static async deleteByName(name) {
    const { rows } = await pool.query(
      `
        DELETE FROM
          emoticons
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
