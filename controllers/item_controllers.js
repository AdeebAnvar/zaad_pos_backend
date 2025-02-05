const db = require('../config/db');

exports.addItemCategory = async (req, res) => {
    const { category_name_eng, category_name_arabic } = req.body;
    if (!category_name_arabic || !category_name_eng) {
        return res.status(400).json({
            status: false,
            message: "Arabic and English names must be provided"
        })
    }
    try {

        const [rows] = await db.query('CALL addCategory(?,?)',[category_name_eng,category_name_arabic]);
        return res.status(200).json({
            status: true,
            message: "Category Added Successfully"
        })
    } catch (error) {
        if (error.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                status: false,
                message: 'User already exists'
            });
        }
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
            , error
        })

    }
}