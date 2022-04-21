const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

module.exports = class AdminService {
  static async create({ email, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const admin = await Admin.insert({ email, passwordHash });
    return admin;
  }

  static async signIn({ email, password }) {
    const admin = await Admin.findByEmail(email);

    if (!admin) throw new Error('Invalid email/password');
    const passwordsMatch = bcrypt.compareSync(password, admin.passwordHash);

    if (!passwordsMatch) throw new Error('Invalid email/password');

    return admin;
  }
};
