const User = require('../../models/Users/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Affiliate = require('../../models/Affiliate/affiliate');
const dotenv = require('dotenv').config();

const registerAdmin = async (req, res) => {
    const {
        name,
        email,
        noHandPhone,
        password,
        referralCode
    } = req.body;

    try {
        const role = 'admin';
        let referralBy = null;
        const existingName = await User.findOne({ where: { name } });
        if (existingName) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Nama telah digunakan'
            });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Nama telah digunakan'
            });
        }

        const existingNoHandPhone = await User.findOne({ where: { noHandPhone } });
        if (existingNoHandPhone) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Nama telah digunakan'
            });
        }

        if (referralCode) {
            const referrer = await User.findOne({ where: { referral: referralCode } });
            referralBy = referrer.id;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const generateReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const user = await User.create({
            name,
            email,
            noHandPhone,
            password: hashedPassword,
            role,
            referral: generateReferralCode,
            referralCode,
            referralBy
        });

        res.status(201).json({
            code: 201,
            success: true,
            message: 'Regstrasi berhasil',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const register = async (req, res) => {
    const {
        name,
        email,
        noHandPhone,
        password,
        referralCode
    } = req.body;

    try {
        const role = 'user';
        const existingName = await User.findOne({ where: { name } });
        if (existingName) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Nama telah digunakan'
            });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Email telah digunakan'
            });
        }

        const existingNoHandPhone = await User.findOne({ where: { noHandPhone } });
        if (existingNoHandPhone) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Nomor Hand Phone telah digunakan'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            noHandPhone,
            password: hashedPassword,
            role
        });

        let referralBy = null;

        if (referralCode) {
            const referrer = await Affiliate.findOne({ where: { referral: referralCode } });
            if (referrer) {
                referralBy = referrer.userId;
            }
        }

        const generateReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const affiliate = await Affiliate.create({
            userId: user.id,
            referral: generateReferralCode,
            referralCode,
            referralBy
        });

        res.status(201).json({
            code: 201,
            success: true,
            message: 'Regstrasi berhasil',
            data: {
                user,
                affiliate
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Email belum terdaftar'
            });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(409).json({
                code: 409,
                success: false,
                message: 'Password salah'
            });
        }

        const token = jwt.sign({
            id: user.id,
            role: user.role,
            name: user.name
        }, process.env.SECRET_KEY
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/'
        });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Login berhasil',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const logOut = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/'
        });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Logout berhasil'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getMe = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] },
            include: {
                model: Affiliate,
                as: 'affiliate'
            }
        });

        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil mengambil data user',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            success: false,
            message: error.message
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const user = await User.findAll();

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil ambil semua data user',
            data: user
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
    registerAdmin,
    register,
    login,
    logOut,
    getMe,
    getAllUser
};
