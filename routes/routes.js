const router = require('express').Router();

//User
router.use('/', require('./Users/user'));

//Product
router.use('/', require('./Product/product'));

//Order
router.use('/', require('./Order/order'));

//Affiliate
router.use('/', require('./Affiliate/affiliate'));

module.exports = router;