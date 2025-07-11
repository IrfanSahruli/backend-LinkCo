const router = require('express').Router();
const {
    registerAdmin,
    register,
    login,
    logOut,
    getMe,
    getAllUser
} = require('../../controllers/Users/user');
const protect = require('../../middlewares/auth');

router.post('/register/admin', registerAdmin);
router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logOut);
router.get('/getMe', protect(['user']), getMe);
router.get('/getAllUser', getAllUser);

module.exports = router;
