require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { PORT } = require('./src/config');
const authRoutes = require('./src/routes/auth');
const cvRoutes = require('./src/routes/cv');
const aiRoutes = require('./src/routes/ai');

const { securityHeaders, globalLimiter } = require('./src/middleware/security');

const app = express();

app.use(securityHeaders);
app.use(globalLimiter);
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Restricted limit (ASVS 13.1.2)
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Request logging
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/ai', aiRoutes);

// Local dev server
if (!process.env.LAMBDA_TASK_ROOT) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend server running on http://0.0.0.0:${PORT}`);
    });
}

const serverless = require('serverless-http');
module.exports.handler = serverless(app);
