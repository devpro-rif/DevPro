const express = require('express');
const {Add , verify} = require('../controllers/flouciController');
const Router = express.Router();

Router.post('/payment', Add); 
Router.post('/verify/:paymentId', verify); 


module.exports = Router;