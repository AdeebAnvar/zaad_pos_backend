const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_controllers');

router.post('/saveOrder',orderController.saveOrder)
router.get('/getOrdersByCustomerId/:customerId',orderController.getOrderByCustomer)
router.get('/getAllOrders',orderController.getAllOrders)

module.exports=router;
