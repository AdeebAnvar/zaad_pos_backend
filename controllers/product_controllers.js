const db = require('../config/db');

exports.addProductCategory = async (req, res) => {
    const { id, category_name_eng, category_name_arabic } = req.body;
    if (!category_name_arabic || !category_name_eng) {
        return res.status(400).json({
            status: false,
            message: "Arabic and English names must be provided"
        })
    }
    try {

        await db.query('CALL addCategory(?,?,?)', [id || 0, category_name_eng, category_name_arabic]);
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

        const [row] = await db.query('call getAllCategories()');
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
    const { product_id, product_name,product_image, product_category_name_eng, product_category_name_arabic, product_category_id, unit_price, discount_price } = req.body;
    if (!product_name ||!product_image|| !product_category_name_eng || !product_category_name_arabic || !product_category_id || !unit_price || !discount_price) {
        return res.status(400).json({
            status: false,
            message: "Missing mandatory fields"
        })

    }

    try {
        const [rows] = await db.query('call saveProduct(?,?,?,?,?,?,?,?)', [product_id, product_name,product_image, product_category_name_eng, product_category_name_arabic, product_category_id, unit_price, discount_price])
        const message = product_id == 0 || product_id == null ? 'Product added successfully' : 'Product updated successfully';
        console.log(rows);
        return res.status(200).json({
            status: true,
            message: message
        });
    } catch (error) {
        if (error.sqlState === '45000') {
            return res.status(400).json({
                status: false,
                message: error.sqlMessage
            });
        }
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}
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
        const [rows] = await db.query('call getAllProducts()')
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
