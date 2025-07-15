const Product = require('../../models/Product/product');

const addProduct = async (req, res) => {
    const productImage = req.file ? `/uploads/${req.file.filename}` : null;
    const {
        productName,
        price,
        description,
        linkProduct
    } = req.body;

    try {
        const existingProductName = await Product.findOne({ where: { productName } });
        if (existingProductName) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Nama produk sudah ada'
            });
        }

        const product = await Product.create({
            productName,
            price,
            description,
            imageUrl: productImage,
            linkProduct
        });

        res.status(201).json({
            code: 201,
            success: true,
            message: 'Berhasil menambahkan produk',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const product = await Product.findAll();

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil mengambil semua data produk',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getOneProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil mengambil data produk',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const productImage = req.file ? `/uploads/${req.file.filename}` : null;
    const {
        productName,
        price,
        description,
        linkProduct
    } = req.body;

    try {
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        const updatedProduct = await product.update({
            productName: productName || product.productName,
            price: price || product.price,
            description: description || product.description,
            imageUrl: productImage || product.imageUrl,
            linkProduct: linkProduct || product.linkProduct
        });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil update produk',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ where: { id } });

        if (!product) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Product tidak ditemukan'
            });
        }

        await product.destroy();

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil hapus product'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addProduct,
    getAllProduct,
    getOneProduct,
    updateProduct,
    deleteProduct
};
