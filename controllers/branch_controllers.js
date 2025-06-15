const db = require('../config/db');

exports.saveBranch = async (req, res) => {
    try {
        const {
            id,
            name,
            inv_prefix,
            location,
            contact_number,
            email,
            social_media,
            vat,
            vat_percent,
            trn_number,
            installation_date,
            expiry_date,
        } = req.body;

        // If image was uploaded, use its filename or full URL
        console.log(req.file)
        const host = req.get('host'); // e.g., "localhost:3000"
        const protocol = req.protocol; // e.g., "http"
        const image = req.file ? `uploads/${req.file.filename}` : null;


        const [result] = await db.execute(
            'CALL saveBranch(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                name,
                image,
                inv_prefix,
                location,
                contact_number,
                email,
                social_media,
                vat,
                vat_percent,
                trn_number,
                installation_date,
                expiry_date,
            ]
        );

        const status = result[0]?.status || 'unknown';

        res.json({ status: true, message: `Branch ${status} successfully.` });
    } catch (error) {
        console.error('Error saving branch:', error);
        res
            .status(500)
            .json({ status: false, message: 'Error saving branch', error: error.message });
    }
};


exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "ID must be provided"
            });
        }

        const [result] = await db.query('CALL deleteBranch(?)', [id]);



        return res.status(200).json({
            status: true,
            message: "branch deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error', error
        });
    }
}
exports.getAllBranches = async (req, res) => {
    try {
        const [rows] = await db.query('CALL GetAllBranches()');
        res.status(200).json({ status: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
}