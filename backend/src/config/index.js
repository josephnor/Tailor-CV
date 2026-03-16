require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret-key-change-me',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    BUCKET_NAME: 'mi-cv-data-867344442987',
    CV_TABLE: 'cv_data_v2'
};
