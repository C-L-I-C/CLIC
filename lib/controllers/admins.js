const { Router } = require('express');
const AdminService = require('../services/AdminService');
const Admin = require('../models/Admin');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const admin = await AdminService.create(req.body);
      res.send(admin);
    } catch (error) {
      next(error);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const admin = await AdminService.signIn(req.body);
      const token = admin.authToken();
      res.cookie('session', token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      });

      res.send({
        message: 'Signed in successfully!',
        admin,
      });
    } catch (error) {
      next(error);
    }
  });
