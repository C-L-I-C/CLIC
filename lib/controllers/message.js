const { Router } = require('express');
const Message = require('../models/Message');

module.exports = Router()
.post('/', async (req, res) => {
    const message = await Message.insert(req.body);
    res.send(message);
})