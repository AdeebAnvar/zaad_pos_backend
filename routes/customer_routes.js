const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer_controllers');

router.post('/save_customer',customerController.saveCustomer)
router.get('/get_all_customers',customerController.getAllCustomers)
module.exports=router;