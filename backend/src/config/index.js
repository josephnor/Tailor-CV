require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: JWT_SECRET must be defined in production environment.');
    process.exit(1);
}

module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: JWT_SECRET || 'dev-secret-key-only',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME || 'mi-cv-data-default',
    CV_TABLE: 'cv_data_v2',
    IS_PROD: process.env.NODE_ENV === 'production'
};
