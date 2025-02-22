const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_controllers');

router.post('/saveOrder',orderController.saveOrder)
router.get('/getOrdersByCustomerId/:customerId',orderController.getOrderByCustomer)

module.exports=router;
