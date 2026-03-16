const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../services/aws');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { GEMINI_API_KEY, CV_TABLE } = require('../config');

const router = express.Router();
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

async function scrapeJobDescription(url) {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);
        $('script, style, nav, footer, header, noscript').remove();
        return $('body').text().replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error('Scraping error:', error.message);
        return null;
    }
}

router.post('/tailor', authenticateToken, asyncHandler(async (req, res) => {
    if (!genAI) return res.status(500).json({ error: 'Gemini API Key not configured' });

    const { cvId, jobDescription, jobUrl } = req.body;
    const username = req.user.username;

    const result = await docClient.send(new GetCommand({ TableName: CV_TABLE, Key: { username, cvId } }));
    if (!result.Item) return res.status(404).json({ error: 'Base CV not found' });
    const baseCv = result.Item.data;

    let targetJobText = jobDescription || '';
    if (jobUrl) {
        const scrapedText = await scrapeJobDescription(jobUrl);
        if (scrapedText) targetJobText += `\n\n[From URL]: ${scrapedText}`;
    }
    if (!targetJobText.trim()) return res.status(400).json({ error: 'Job description or URL required' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
        You are a world-class career coach and CV writer. 
        I will provide you with a base CV in JSON format and a job description.
        Your goal is to tailor the CV for this specific job to maximize the chances of getting an interview.
        
        STRICT RULES:
        1. ONLY rewrite 'profile.summary', 'profile.quote', 'profile.subtitle', and the bullet points in 'experience[].achievements'.
        2. DO NOT change any dates, company names, degree names, or technical skills constants.
        3. Use the user's REAL experience provided in the base CV. Focus on the accomplishments that match the job requirements.
        4. The response MUST be ONLY a valid JSON object following the EXACT SAME schema as the base CV.
        5. Use professional, high-impact language.
        6. Keep the response concise and targeted.
        
        BASE CV JSON:
        ${JSON.stringify(baseCv)}
        
        JOB DESCRIPTION:
        ${targetJobText}
        
        TAILORED CV JSON:
    `;

    const responseResult = await model.generateContent(prompt);
    const text = responseResult.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini failed to return valid JSON');

    const tailoredCv = JSON.parse(jsonMatch[0]);
    res.json(tailoredCv);
}));

module.exports = router;
