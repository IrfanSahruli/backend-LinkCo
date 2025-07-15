const Withdraw = require('../../models/Users/withdraw');
const User = require('../../models/Users/user');

const requestWithdraw = async (req, res) => {
    const userId = req.user.id;
    const selfiePhoto = req.file ? `/uploads/${req.file.filename}` : null;
    const {
        withdrawTo,
        noRekening,
        totalWithdraw
    } = req.body;

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (totalWithdraw < 12500) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Jumlah minimal penarikan Rp. 12.500'
            });
        }

        if (user.saldo < totalWithdraw) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Saldo tidak cukup untuk melakukan penarikan'
            });
        }

        const withdraw = await Withdraw.create({
            userId,
            withdrawTo,
            noRekening,
            totalWithdraw,
            selfiePhoto,
            status: 'pending'
        });

        res.status(201).json({
            code: 201,
            success: true,
            message: 'Permintaan penarikan berhasil, menunggu verifikasi admin',
            data: withdraw
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const approveWithdraw = async (req, res) => {
    const { id } = req.params;
    const {
        status,
        rejectedReason
    } = req.body;

    try {
        const withdraw = await Withdraw.findOne({
            where: { id },
            include: {
                model: User
            }
        });

        if (!withdraw || withdraw.status !== 'pending') {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Penarikan tidak ditemukan atau sudah selesai'
            });
        }

        if (status === 'rejected') {
            withdraw.status = status;
            withdraw.rejectedReason = rejectedReason;
            await withdraw.save();
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Request penarikan ditolak oleh admin',
                data: withdraw
            });
        }

        const user = withdraw.user;

        if (user.saldo < withdraw.totalWithdraw) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Saldo user tidak mencukupi'
            });
        }

        user.saldo -= withdraw.totalWithdraw;
        await user.save();

        withdraw.status = 'approved';
        await withdraw.save();

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Saldo sudah di transfer dan saldo dikurangi'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getAllWithdraws = async (req, res) => {
    const { status } = req.query;

    try {
        const whereClause = status ? { status } : {};

        const withdraws = await Withdraw.findAll({
            where: whereClause,
            include: {
                model: User,
                attributes: ['id', 'name', 'email']
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Data penarikan berhasil diambil',
            data: withdraws
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getWithdrawById = async (req, res) => {
    const { id } = req.params;

    try {
        const withdraw = await Withdraw.findOne({
            where: { id },
            include: {
                model: User,
                attributes: ['id', 'name', 'email']
            },
        });
        if (!withdraw) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Withdraw tidak ditemukan'
            });
        }

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil ambil data withdraw',
            data: withdraw
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getMyWithdraws = async (req, res) => {
    const userId = req.user.id;
    const { status } = req.query;

    try {
        const whereClause = status ? { userId, status } : { userId };

        const withdraws = await Withdraw.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Riwayat penarikan berhasil diambil',
            data: withdraws
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
    requestWithdraw,
    approveWithdraw,
    getAllWithdraws,
    getWithdrawById,
    getMyWithdraws
};
