const router = require('express').Router();
const {
    getReferralTree
} = require('../../controllers/Affiliate/affiliate');
const protect = require('../../middlewares/auth');

router.get('/getAffiliate', protect(['user']), getReferralTree);

module.exports = router;
