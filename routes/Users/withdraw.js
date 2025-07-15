const router = require('express').Router();
const {
    requestWithdraw,
    approveWithdraw,
    getAllWithdraws,
    getWithdrawById,
    getMyWithdraws
} = require('../../controllers/Users/withdraw');
const protect = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');

router.post('/withdraw', upload.single('selfiePhoto'), protect(['user']), requestWithdraw);
router.put('/withdraw/:id', protect(['admin']), approveWithdraw);
router.get('/getAllWithdraw', protect(['admin']), getAllWithdraws);
router.get('/getOneWithdraw/:id', protect(['admin']), getWithdrawById);
router.get('/getMyWithdraw', protect(['user']), getMyWithdraws);

module.exports = router;
