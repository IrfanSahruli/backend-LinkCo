const router = require('express').Router();
const {
    createKyc,
    getAllKyc,
    getKycById,
    verifiedKyc
} = require('../../controllers/Users/kyc');
const protect = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');

router.post(
    '/kyc',
    upload.fields([
        { name: 'ktpPhoto', maxCount: 1 },
        { name: 'selfiePhoto', maxCount: 1 }
    ]),
    protect(['user']),
    createKyc
);
router.get('/getAllKyc', protect(['admin']), getAllKyc);
router.get('/getOneKyc/:id', protect(['admin']), getKycById);
router.put('/verifiedKyc/:id', protect(['admin']), verifiedKyc);

module.exports = router;
