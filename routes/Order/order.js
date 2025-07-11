const router = require('express').Router();
const {
    createOrder,
    completeOrder,
    getAllOrder,
    getOrderByOrderId
} = require('../../controllers/Order/order');
const protect = require('../../middlewares/auth');

router.post('/createOrder', protect(['user']), createOrder);
router.put('/completeOrder/:orderId', protect(['admin']), completeOrder);
router.get('/getAllOrder', protect(['admin']), getAllOrder);
router.get('/getOneOrder/:orderId', protect(['admin']), getOrderByOrderId);

module.exports = router;
