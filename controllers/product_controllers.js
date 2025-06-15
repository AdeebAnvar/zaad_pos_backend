const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.addProductCategory = async (req, res) => {
    const { id, category_name_eng, category_name_arabic } = req.body;
    if (!category_name_arabic || !category_name_eng) {
        return res.status(400).json({
            status: false,
            message: "Arabic and English names must be provided"
        })
    }
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const secret = process.env.SECRET_KEY ;
        const user = jwt.verify(token, secret);
        await db.query('CALL addCategory(?,?,?,?,?)', [id || 0, category_name_eng, category_name_arabic,user.branch_id,user.branch_name]);
        const message = id == 0 || id == null ? 'Category Added Successfully' : 'Category Updated Successfully';
        return res.status(200).json({
            status: true,
            message: message
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

exports.getAllProductCategories = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const secret = process.env.SECRET_KEY ;
        const user = jwt.verify(token, secret);
        const [row] = await db.query('call getAllCategories(?)',[user.branch_id]);
        return res.status(200).json({
            status: true,
            message: "Categories fetched successfully",
            data: row[0]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
            , error
        })

    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        console.log('Category ID:', category_id);

        if (!category_id) {
            return res.status(400).json({
                status: false,
                message: "Category ID must be provided"
            });
        }

        const [result] = await db.query('CALL deletecategory(?)', [category_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error('Error in deleteCategory:', error);

        if (error.errno === 1451) {  // Handle foreign key constraint error
            return res.status(400).json({
                status: false,
                message: "Category cannot be deleted because it is referenced by other records."
            });
        }

        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
exports.saveProduct = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const user = jwt.verify(token, secret);

    // Extract product fields from the request body
    const { 
        product_id, 
        product_name, 
        product_category_name_eng, 
        product_category_name_arabic, 
        product_category_id, 
        unit_price, 
        unit_type, 
        item_other_name, 
        min_stock_qty, 
        barcode, 
        add_ingredient, 
        stock_applicable, 
        hidden_in_pos, 
        item_type 
    } = req.body;

    // Validate the mandatory fields
    if (!product_name || !product_category_name_eng || !product_category_name_arabic || 
        !product_category_id || !unit_price ) {
        return res.status(400).json({
            status: false,
            message: "Missing mandatory fields"
        });
    }
    const host = req.get('host'); // e.g., "localhost:3000"
    const protocol = req.protocol; // e.g., "http"
    const image = req.file ? `uploads/${req.file.filename}` : null;

    try {
        // Call the stored procedure with the necessary parameters
        const [rows] = await db.query('call saveProduct(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
            product_id, 
            product_name, 
            image, 
            product_category_name_eng, 
            product_category_name_arabic, 
            product_category_id, 
            unit_price, 
            user.branch_id, 
            user.branch_name, 
            unit_type, 
            item_other_name, 
            min_stock_qty, 
            barcode, 
            add_ingredient, 
            stock_applicable, 
            hidden_in_pos, 
            item_type
        ]);

        // Set a message based on whether it's an insert or an update
        const message = product_id == 0 || product_id == null ? 'Product added successfully' : 'Product updated successfully';
        console.log(rows);
        
        // Respond with success message
        return res.status(200).json({
            status: true,
            message: message
        });
    } catch (error) {
        // Handle specific SQL errors
        if (error.sqlState === '45000') {
            return res.status(400).json({
                status: false,
                message: error.sqlMessage
            });
        }

        // Handle general errors
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: false,
            message: "Missing mandatory fields"
        })

    }

    try {
        const [rows] = await db.query('call deleteProduct(?)', [id])
        console.log(rows);
        return res.status(200).json({
            status: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
       
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}
exports.getAllProducts = async (req, res) => {

    
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const secret = process.env.SECRET_KEY ;
        const user = jwt.verify(token, secret);
        const [rows] = await db.query('call getAllProducts(?)',[user.branch_id])
        console.log(rows);
        return res.status(200).json({
            status: true,
            message: "Products fetched successfully"
            ,data : rows[0]
        });
    } catch (error) {
       
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}
exports.getProductDetail = async (req, res) => {

    const { id } = req.params;


    try {
        const [rows] = await db.query('call getProductdetail(?)',[id])
        console.log(rows);
        return res.status(200).json({
            status: true,
            message: "Product fetched successfully"
            ,data : rows[0]
        });
    } catch (error) {
       
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}
