const pool = require('../utils/pool');

module.exports = class User {
    id;
    username;
    email;

    constructor(row) {
        this.id = row.id;
        this.username = row.username;
        this.email = row.email;
    }

    static async insert({ username, email }) {
        const { rows } = await pool.query(
        `
            INSERT INTO 
                users (username, email)
            VALUES
                ($1, $2)
            RETURNING
                *
            `,
            [username, email]
        );
        return new User(rows[0]);
    }

    static async getAll() {
        const { rows } = await pool.query(
        `
            SELECT
            *
            FROM 
            users
            `
        );
        return rows.map((row) => new User(row));
    }
}