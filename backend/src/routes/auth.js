const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../services/aws');
const { asyncHandler } = require('../utils/asyncHandler');
const { JWT_SECRET, CV_TABLE } = require('../config');

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const existingUser = await docClient.send(new GetCommand({ TableName: 'cv_users', Key: { username } }));
    if (existingUser.Item) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await docClient.send(new PutCommand({
        TableName: 'cv_users',
        Item: { id: Date.now().toString(), username, password: hashedPassword }
    }));

    const now = new Date().toISOString();
    const emptyCv = {
        profile: { firstName: username, lastName: '', subtitle: '', photoPath: '', summary: '', quote: '' },
        contact: { phone: '', email: '', location: '', linkedin: '', linkedinUrl: '' },
        skills: [], languages: [], experience: [], education: [], coreValues: [], certifications: []
    };
    await docClient.send(new PutCommand({
        TableName: CV_TABLE,
        Item: { username, cvId: `cv_${Date.now()}`, label: 'My CV', isDefault: true, createdAt: now, updatedAt: now, data: emptyCv }
    }));

    res.status(201).json({ success: true, message: 'User registered' });
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const result = await docClient.send(new GetCommand({ TableName: 'cv_users', Key: { username } }));
    const user = result.Item;
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, username: user.username });
}));

module.exports = router;
