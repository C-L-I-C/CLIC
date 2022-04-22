const { Router } = require('express');
const AdminService = require('../services/AdminService');
const authenticate = require('../middleware/authenticate');
const Message = require('../models/Message');
const Emoticon = require('../models/Emoticon');
const User = require('../models/User');
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
  .post('/session', async (req, res, next) => {
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
  })
  .get('/user', authenticate, async (req, res, next) => {
    try {
      const users = await User.getAll();
      res.send(users);
    } catch (error) {
      next(error);
    }
  })
  .get('/user/:id', authenticate, async (req, res, next) => {
    try {
      const user = await User.getById(req.params.id);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })
  .get('/message', authenticate, async (req, res, next) => {
    try {
      const messages = await Message.getAll();
      res.send(messages);
    } catch (error) {
      next(error);
    }
  })
  .get('/message/:id', authenticate, async (req, res, next) => {
    try {
      const message = await Message.getById(req.params.id);
      res.send(message);
    } catch (error) {
      next(error);
    }
  })
  .patch('/message/:id', authenticate, async (req, res, next) => {
    try {
      const message = await Message.updateById(req.params.id, req.body);
      res.send(message);
    } catch (error) {
      next(error);
    }
  })
  .delete('/message/:id', authenticate, async (req, res, next) => {
    try {
      const message = await Message.deleteById(req.params.id);
      res.send(message);
    } catch (error) {
      next(error);
    }
  })
  .get('/emoticon', authenticate, async (req, res, next) => {
    try {
      const emoticons = await Emoticon.getAll();
      res.send(emoticons);
    } catch (error) {
      next(error);
    }
  })
  .get('/emoticon/:name', authenticate, async (req, res, next) => {
    try {
      const emoticon = await Emoticon.getByName(req.params.name);
      res.send(emoticon);
    } catch (error) {
      next(error);
    }
  })
  .patch('/emoticon/:name', authenticate, async (req, res, next) => {
    try {
      const emoticon = await Emoticon.updateByName(req.params.name, req.body);
      res.send(emoticon);
    } catch (error) {
      next(error);
    }
  })
  .delete('/emoticon/:name', authenticate, async (req, res, next) => {
    try {
      const emoticon = await Emoticon.deleteByName(req.params.name);
      res.send(emoticon);
    } catch (error) {
      next(error);
    }
  });
