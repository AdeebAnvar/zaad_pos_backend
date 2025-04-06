const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer_controllers');

router.post('/save_customer',customerController.saveCustomer)
router.get('/get_all_customers',customerController.getAllCustomers)
router.get('/submitData',customerController.submitData)
module.exports=router;