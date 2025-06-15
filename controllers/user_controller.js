const db = require('../config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;



exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query('CALL GetAllUsers()');  // Call the stored procedure
        res.status(200).json({ status: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
};
exports.deleteUser =  async(req,res)=>{
    try {
        const { id } = req.body;
 if (!id) {
            return res.status(400).json({
                status: false,
                message: "user ID must be provided"
            });
        }

        const [result] = await db.query('CALL deleteUser(?)', [id]);

      

        return res.status(200).json({
            status: true,
            message: "user deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error', error
        });
    }
}

exports.addUser = async (req, res) => {
    try {
        const { id, username, password, type, branch_id, branch_name } = req.body;
        if (!username || !password || !type || !branch_id || !branch_name) {
            return res.status(400).json({
                status: false,
                message: 'Missing mandatory fields.'
            });
        }

        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [rows] = await db.query('CALL AddUser(?,?,?,?,?,?)', [id, username, password, type, branch_id, branch_name]);
        console.log(rows);
        return res.status(200).json({
            status: true,
            message: rows[0][0].status
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
    console.log("fgdegf")
    const { username, password } = req.body;
    console.log('Login request received for:', username);
    console.log('Login request received for:', password);
    // const [roe]=  await db.query('SELECT 1');
    // console.log('roe:', roe);
    if (!username || !password) {
        return res.status(200).json({
            status: false,
            message: 'Username and password are mandatory.'
        });
    }

    try {
        const startTime = Date.now();

        const [rows] = await db.query('CALL login(?,?)', [username, password]);
        const duration = Date.now() - startTime;
        console.log(`DB query took ${duration} ms`);
        console.log(rows);
        if (rows[0].length === 0) {
            return res.status(200).json({
                status: false,
                message: 'Invalid username or password.'
            });
        }
        const user = rows[0][0]; // First row contains the user data


        // Generate JWT token (consider not including the password in the token)
        const token = jwt.sign(
            { id: user.id, username: user.name, type: user.type, branch_id: user.branch_id, branch_name: user.branch_name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            status: true,
            message: 'Login successful',
            user: user,
            token

        });
    } catch (error) {
        console.error('Error in login route:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error
        });
    }
};
