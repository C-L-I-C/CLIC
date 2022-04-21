const pool = require('../utils/pool');

module.exports = class Quote {
  id;
  name;
  quote;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.quote = row.quote;
  }

  static async insert({ name, quote }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        quotes (name, quote)
      VALUES
        ($1, $2)
      RETURNING
        *
      `,
      [name, quote]
    );

    if (!rows[0]) return null;
    return new Quote(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        quotes
      `
    );

    return rows.map((row) => new Quote(row));
  }

  static async getByName(name) {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        emoticons
      WHERE
        name=$1
      `,
      [name]
    );

    if (!rows[0]) return null;
    return new Emoticon(rows[0]);
  }

  static async updateByName(quote, attributes) {
    const existing = await Quote.getByName(quote);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...attributes,
    };

    const { name, quotes } = updated;

    const { rows } = await pool.query(
      `
      UPDATE
        quotes
      SET
        name=$2, string=$3
      WHERE
        name=$1
      RETURNING
        *
      `,
      [quote, name, string]
    );

    if (!rows[0]) return null;
    return new Quote(rows[0]);
  }

  static async deleteByName(name) {
    const { rows } = await pool.query(
      `
      DELETE FROM
        quotes
      WHERE
        name = $1
      RETURNING
        *
      `,
      [name]
    );

    if (!rows[0]) return null;
    return new Quote(rows[0]);
  }
};
