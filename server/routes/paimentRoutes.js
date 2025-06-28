const express = require('express');
const {Add , verify} = require('../controllers/paimentControlleur');
const RouterPayment = express.Router();

RouterPayment.post('/payment', Add); 
RouterPayment.post('/verify/:paymentId', verify); 


module.exports = RouterPayment;