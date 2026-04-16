const express = require('express');
const { GetCommand, PutCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { docClient, s3Client } = require('../services/aws');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { BUCKET_NAME, CV_TABLE } = require('../config');

const router = express.Router();

async function uploadImageToS3(base64Data, username) {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Data;

    const ext = matches[1].split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    const imageKey = `profiles/${username}-${Date.now()}.${ext}`;

    await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME, Key: imageKey, Body: buffer, ContentType: matches[1]
    }));

    return `https://${BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
}

async function queryUserCvs(username) {
    const result = await docClient.send(new QueryCommand({
        TableName: CV_TABLE,
        KeyConditionExpression: 'username = :u',
        ExpressionAttributeValues: { ':u': username }
    }));
    return result.Items || [];
}

router.get('/:username', authenticateToken, asyncHandler(async (req, res) => {
    // ASVS 4.1.1: Ensure user can only access their own CVs or provide public visibility logic
    if (req.user.username !== req.params.username) {
        return res.status(403).json({ error: 'Forbidden: Cannot access other users’ resources' });
    }
    const items = await queryUserCvs(req.params.username);
    if (items.length === 0) return res.status(404).json({ error: 'No CVs found' });

    const cvList = items.map(({ cvId, label, isDefault, createdAt, updatedAt, data }) => ({
        cvId, label, isDefault: isDefault || false, createdAt, updatedAt, template: data?.template || 'default'
    }));
    res.json(cvList);
}));

router.get('/:username/default', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.username !== req.params.username) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const items = await queryUserCvs(req.params.username);
    if (items.length === 0) return res.status(404).json({ error: 'CV not found' });

    const defaultCv = items.find(item => item.isDefault) || items[0];
    res.json({ ...defaultCv.data, cvId: defaultCv.cvId, label: defaultCv.label });
}));

router.get('/:username/:cvId', authenticateToken, asyncHandler(async (req, res) => {
    const { username, cvId } = req.params;
    if (req.user.username !== username) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await docClient.send(new GetCommand({ TableName: CV_TABLE, Key: { username, cvId } }));
    if (!result.Item) return res.status(404).json({ error: 'CV not found' });

    res.json({ ...result.Item.data, cvId: result.Item.cvId, label: result.Item.label });
}));

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const username = req.user.username;
    const { label, data } = req.body;
    const now = new Date().toISOString();
    const cvId = `cv_${Date.now()}`;

    let cvData = data || {
        profile: { firstName: username, lastName: '', subtitle: '', photoPath: '', summary: '', quote: '' },
        contact: { phone: '', email: '', location: '', linkedin: '', linkedinUrl: '' },
        skills: [], languages: [], experience: [], education: [], coreValues: [], certifications: [], template: 'default'
    };

    if (cvData.profile?.photoPath?.startsWith('data:image')) {
        cvData.profile.photoPath = await uploadImageToS3(cvData.profile.photoPath, username);
    }

    await docClient.send(new PutCommand({
        TableName: CV_TABLE,
        Item: { username, cvId, label: label || 'New CV', isDefault: false, createdAt: now, updatedAt: now, data: cvData }
    }));

    res.status(201).json({ success: true, cvId, message: 'CV created' });
}));

router.put('/:cvId', authenticateToken, asyncHandler(async (req, res) => {
    const username = req.user.username;
    const { cvId } = req.params;
    const { label, data } = req.body;

    const existing = await docClient.send(new GetCommand({ TableName: CV_TABLE, Key: { username, cvId } }));
    if (!existing.Item) return res.status(404).json({ error: 'CV not found' });

    let cvData = data || existing.Item.data;

    if (cvData.profile?.photoPath?.startsWith('data:image')) {
        cvData.profile.photoPath = await uploadImageToS3(cvData.profile.photoPath, username);
    }

    await docClient.send(new PutCommand({
        TableName: CV_TABLE,
        Item: {
            ...existing.Item,
            label: label || existing.Item.label,
            updatedAt: new Date().toISOString(),
            data: cvData
        }
    }));

    res.json({ success: true, message: 'CV updated' });
}));

router.delete('/:cvId', authenticateToken, asyncHandler(async (req, res) => {
    const { cvId } = req.params;
    await docClient.send(new DeleteCommand({ TableName: CV_TABLE, Key: { username: req.user.username, cvId } }));
    res.json({ success: true, message: 'CV deleted' });
}));

router.post('/:cvId/duplicate', authenticateToken, asyncHandler(async (req, res) => {
    const username = req.user.username;
    const { cvId } = req.params;
    const { label } = req.body;

    const original = await docClient.send(new GetCommand({ TableName: CV_TABLE, Key: { username, cvId } }));
    if (!original.Item) return res.status(404).json({ error: 'CV not found' });

    const now = new Date().toISOString();
    const newCvId = `cv_${Date.now()}`;

    await docClient.send(new PutCommand({
        TableName: CV_TABLE,
        Item: {
            username, cvId: newCvId,
            label: label || `${original.Item.label} (Copy)`,
            isDefault: false, createdAt: now, updatedAt: now,
            data: original.Item.data
        }
    }));

    res.status(201).json({ success: true, cvId: newCvId, message: 'CV duplicated' });
}));

router.put('/:cvId/default', authenticateToken, asyncHandler(async (req, res) => {
    const username = req.user.username;
    const { cvId } = req.params;

    const items = await queryUserCvs(username);

    for (const item of items) {
        await docClient.send(new PutCommand({
            TableName: CV_TABLE,
            Item: { ...item, isDefault: item.cvId === cvId }
        }));
    }

    res.json({ success: true, message: 'Default CV updated' });
}));

module.exports = router;
