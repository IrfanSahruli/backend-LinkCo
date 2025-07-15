const Kyc = require("../../models/Users/kyc");
const User = require("../../models/Users/user");

const createKyc = async (req, res) => {
    const userId = req.user.id;
    const ktpPhoto = req.files?.ktpPhoto?.[0]?.filename
        ? `/uploads/${req.files.ktpPhoto[0].filename}`
        : null;

    const selfiePhoto = req.files?.selfiePhoto?.[0]?.filename
        ? `/uploads/${req.files.selfiePhoto[0].filename}`
        : null;
    const {
        fullName,
        nik,
        placeOfBirth,
        dateOfBirth,
        address
    } = req.body;

    try {
        const user = await User.findOne({ where: { id: userId } });
        if (user.isKYCApproved) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User telah melakukan kyc'
            });
        }

        const kyc = await Kyc.create({
            userId,
            fullName,
            nik,
            placeOfBirth,
            dateOfBirth,
            address,
            ktpPhoto,
            selfiePhoto,
            status: 'pending'
        });

        res.status(201).json({
            code: 201,
            success: true,
            message: 'Kyc berhasil, menunggu verifikasi admin',
            data: kyc
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getAllKyc = async (req, res) => {
    const { status } = req.query;

    try {
        const whereClause = status ? { status } : {};

        const kyc = await Kyc.findAll({
            where: whereClause,
            include: {
                model: User
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil ambil semua data KYC',
            data: kyc
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getKycById = async (req, res) => {
    const { id } = req.params;

    try {
        const kyc = await Kyc.findOne({
            where: { id },
            include: {
                model: User
            }
        });
        if (!kyc) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Data KYC tidak ditemukan'
            });
        }

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil ambil data KYC',
            data: kyc
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const verifiedKyc = async (req, res) => {
    const { id } = req.params;
    const {
        status,
        rejectedReason
    } = req.body;

    try {
        const kyc = await Kyc.findOne({
            where: { id },
            include: {
                model: User,
            }
        });

        const user = kyc.user;

        if (!kyc) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Data Kyc tidak ditemukan'
            });
        }
        if (kyc.status === 'verified') {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Data Kyc sudah di verifikasi'
            });
        }

        if (status === 'rejected') {
            kyc.status = status;
            kyc.rejectedReason = rejectedReason;
            await kyc.save();
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Request KYC ditolak oleh admin',
                data: kyc
            });
        }

        kyc.status = status;
        await kyc.save();

        user.isKYCApproved = true;
        await user.save();

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil verifikasi data kyc user',
            data: kyc
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
    createKyc,
    getAllKyc,
    getKycById,
    verifiedKyc
};
