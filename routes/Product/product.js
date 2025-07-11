const router = require('express').Router();
const {
    addProduct,
    getAllProduct,
    getOneProduct,
    updateProduct
} = require('../../controllers/Product/product');
const protect = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');

router.post('/addProduct', upload.single('productImage'), protect(['admin']), addProduct);
router.get('/getAllProduct', getAllProduct);
router.get('/getOneProduct/:id', getOneProduct);
router.put('/updateProduct/:id', upload.single('productImage'), protect(['admin']), updateProduct);

module.exports = router;
