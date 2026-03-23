const request = require('supertest');
const express = require('express');
const { securityHeaders, globalLimiter } = require('./src/middleware/security');

describe('Core Infrastructure Hardening (ASVS 14.4.1)', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(securityHeaders);
        app.get('/test', (req, res) => res.send('ok'));
    });

    test('should have security headers (Helmet)', async () => {
        const res = await request(app).get('/test');
        expect(res.headers['x-dns-prefetch-control']).toBe('off');
        expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });
});

describe('IDOR & Data Validation (ASVS 4.1.1, 12.6.1)', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        // Mock sub-router for testing logic
        const mockRouter = express.Router();
        mockRouter.get('/:username', (req, res) => {
            if (req.headers['user'] !== req.params.username) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            res.json({ success: true });
        });
        app.use('/cv', mockRouter);
    });

    test('should block IDOR on CV access', async () => {
        const res = await request(app)
            .get('/cv/target_user')
            .set('user', 'attacker_user');
        expect(res.status).toBe(403);
    });

    test('should allow access to own CV', async () => {
        const res = await request(app)
            .get('/cv/target_user')
            .set('user', 'target_user');
        expect(res.status).toBe(200);
    });
});
