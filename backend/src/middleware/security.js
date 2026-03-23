const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Standard Security Headers (ASVS 14.4.1)
 * Mapped to NIST SSDF PW.1.2
 */
const securityHeaders = helmet();

/**
 * Global Rate Limiting (ASVS 4.3.1)
 * Protection against brute-force and DoS
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

/**
 * Auth-specific Rate Limiting (Brute-force protection)
 */
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login/register attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts, please try again in an hour.' }
});

module.exports = {
    securityHeaders,
    globalLimiter,
    authLimiter
};
