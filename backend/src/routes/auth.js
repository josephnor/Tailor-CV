const { z } = require('zod');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

// ASVS 2.1.1: Password Complexity
const registerSchema = z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
    password: z.string().min(8).max(128)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

router.post('/register', authLimiter, asyncHandler(async (req, res) => {
    const { username, password } = registerSchema.parse(req.body);

    const existingUser = await docClient.send(new GetCommand({ TableName: 'cv_users', Key: { username } }));
    if (existingUser.Item) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 12); // ASVS recommendation
    await docClient.send(new PutCommand({
        TableName: 'cv_users',
        Item: { id: Date.now().toString(), username, password: hashedPassword }
    }));
    // ... (rest of registration) ...
    res.status(201).json({ success: true, message: 'User registered' });
}));

router.post('/login', authLimiter, asyncHandler(async (req, res) => {
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
