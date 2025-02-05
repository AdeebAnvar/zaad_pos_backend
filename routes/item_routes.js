const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item_controllers');

router.post('/add_category',itemController.addItemCategory);
module.exports=router;