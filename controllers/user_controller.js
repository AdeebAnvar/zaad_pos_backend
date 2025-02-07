const db = require('../config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query('CALL GetAllUsers()');  // Call the stored procedure
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.addUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                status: false,

                message: 'Please provide username and password.'
            });
        }
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [rows] = await db.query('CALL AddUser(?, ?)', [username, password]);
        return res.status(200).json({
            status: true,

            message: 'User added successfully', data: rows
        });
    } catch (error) {
        if (error.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                status: false,
                message: 'User already exists'
            });
        }
        console.error('Error adding user:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error', error
        });
    }
};
exports.login = async (req, res) => {
    const { username, password } = req.body;
console.log(username);
    if (!username || !password) {
        return res.status(400).json({
            status: false,
            message: 'Username and password are mandatory.'
        });
    }

    try {
        const [rows] = await db.query('CALL login(?, ?)', [username, password]);
        if (rows[0].length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        const user = rows[0][0]; // First row contains the user data
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const token = jwt.sign({ id: user.id, username: user.name, password: user.password }, JWT_SECRET, { expiresIn: '10h' });

        return res.status(200).json({
            message: 'Login successful',
            user: user,
            token
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error
        });
    }
};
