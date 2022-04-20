const { Router } = require('express');
const AdminService = require('../services/AdminService');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    // call to admin service for pw hash
    const admin = await AdminService.hash(req.body);
    res.send(admin);
  } catch (error) {
    next(error);
  }
});
