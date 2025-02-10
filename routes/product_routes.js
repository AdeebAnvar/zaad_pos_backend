const express = require('express');
const router = express.Router();
const productController = require('../controllers/product_controllers');

router.post('/add_category',productController.addProductCategory);
router.get('/get_all_categories',productController.getAllProductCategories);
router.delete('/delete_category/:category_id',productController.deleteCategory);
router.post('/save_product',productController.saveProduct);
router.delete('/delete_product/:id',productController.deleteProduct);
router.get('/get_all_products',productController.getAllProducts);
router.get('/get_product_detail/:id',productController.getProductDetail);

module.exports=router;