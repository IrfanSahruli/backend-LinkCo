const Product = require('../../models/Product/product');
const Order = require('../../models/Order/order');
const User = require('../../models/Users/user');
const Affiliate = require('../../models/Affiliate/affiliate');
const Commission = require('../../models/Affiliate/commission');

const createOrder = async (req, res) => {
    const userId = req.user.id;
    const {
        productId,
        jumlah
    } = req.body;

    try {
        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        let orderId = 0;
        const total = product.price * jumlah;
        const status = 'pending';

        const order = await Order.create({
            orderId,
            userId,
            productId,
            jumlah,
            total,
            status
        });

        //Membuat order id
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2); // ambil 2 digit terakhir
        const orderCode = `${day}${month}${year}${String(order.id).padStart(4, '0')}`;

        order.orderId = orderCode;
        await order.save();

        res.status(201).json({
            code: 201,
            success: true,
            message: 'Berhasil membuat order',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const completeOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findOne({ where: { orderId } });
        if (!order) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Order tidak ditemukan'
            });
        }

        if (order.status === 'selesai') {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Order sudah selesai'
            });
        }

        order.status = 'selesai';
        await order.save();

        const total = order.total;
        let currentUserId = order.userId;
        let relationLevel = 1;

        while (relationLevel <= 6) {
            const affiliate = await Affiliate.findOne({ where: { userId: currentUserId } });
            if (!affiliate?.referralBy) break;

            const commissionPercent = relationLevel === 1 ? 0.10 : 0.02;
            const commission = total * commissionPercent;

            await User.increment(
                { saldo: commission },
                { where: { id: affiliate.referralBy } }
            );

            await Commission.create({
                userId: affiliate.referralBy,
                fromUserId: order.userId,
                orderId: order.id,
                total: commission
            });

            currentUserId = affiliate.referralBy;
            relationLevel++;
        }

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Order selesai dan komisi dikirim',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getAllOrder = async (req, res) => {
    try {
        const order = await Order.findAll({
            include: [
                { model: Product },
                { model: User }
            ]
        });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil ambil semua data order',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getOrderByOrderId = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findOne({
            where: { orderId },
            include: [
                { model: Product },
                { model: User }
            ]
        });
        if (!order) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Order tidak ditemukan'
            });
        }

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil ambil data order',
            data: order
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
    createOrder,
    completeOrder,
    getAllOrder,
    getOrderByOrderId
};
