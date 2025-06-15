const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/product_controllers');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    },
  });  const upload = multer({ storage });
  
router.post('/add_category',productController.addProductCategory);
router.get('/get_all_categories',productController.getAllProductCategories);
router.delete('/delete_category/:category_id',productController.deleteCategory);
router.post('/save_product',upload.single('product_image'),productController.saveProduct);
router.delete('/delete_product/:id',productController.deleteProduct);
router.get('/get_all_products',productController.getAllProducts);
router.get('/get_product_detail/:id',productController.getProductDetail);

module.exports=router;