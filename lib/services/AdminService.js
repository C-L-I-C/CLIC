const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

module.exports = class AdminService {
  static async hash({ email, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const admin = await Admin.insert({ email, passwordHash });
    return admin;
  }
};
