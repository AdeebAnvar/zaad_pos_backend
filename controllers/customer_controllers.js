const db = require('../config/db');


exports.saveCustomer = async (req, res) => {
    const { id, isEdit, name, phone, email, gender, address } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !gender || !address) {
        return res.status(400).json({
            status: false,
            message: "Mandatory fields are missing"
        });
    }

    const action = isEdit ? "edit" : "add"; // Use 'edit' for consistency

    try {
         await db.query(
            'CALL addCustomer(?, ?, ?, ?, ?, ?, ?)', 
            [action, id || null, name, phone, email, gender, address]
        );

        return res.status(200).json({
            status: true,
            message: isEdit ? "Customer updated successfully" : "Customer added successfully",
        });

    } catch (error) {
        console.error("Database Error:", error);

        if (error.code === 'ER_DUP_ENTRY' || error.message.includes("Duplicate entry")) {
            return res.status(400).json({
                status: false,
                message: "User with this email or phone already exists"
            });
        }

        return res.status(500).json({
            status: false,
            message: "An unexpected error occurred",
            error: error.message
        });
    }
};
exports.getAllCustomers = async (req, res) => {
    try {
        const [rows] = await db.query("CALL getAllCustomers()");
        
        return res.status(200).json({
            status: true,
            message: "Customers retrieved successfully",
            data: rows[0] 
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to fetch customers",
            error: error.message
        });
    }
};
exports.submitData = async (req, res) => {
    try {
        const [name,email,message,option] =req.body;
        console.log(`name ${name} email ${email} message ${message} option ${option}` )
        
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to fetch customers",
            error: error.message
        });
    }
};
