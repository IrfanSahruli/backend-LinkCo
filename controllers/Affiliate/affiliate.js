const Affiliate = require('../../models/Affiliate/affiliate');
const User = require('../../models/Users/user');

const getReferralTree = async (req, res) => {
    const userId = req.user.id;
    const visited = new Set();

    try {
        const mainAffiliate = await Affiliate.findOne({
            where: { userId },
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        });

        if (!mainAffiliate) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Data affiliasi tidak ditemukan'
            });
        }

        const buildTree = async (parentId, relationLevel = 1) => {
            if (relationLevel > 6) return [];

            const affiliates = await Affiliate.findAll({
                where: { referralBy: parentId },
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            });

            const result = [];

            for (const affiliate of affiliates) {
                const childId = affiliate.user.id;

                if (visited.has(childId)) continue;
                visited.add(childId);

                const children = await buildTree(childId, relationLevel + 1);

                result.push({
                    userId: childId,
                    name: affiliate.user.name,
                    email: affiliate.user.email,
                    relationLevel,
                    children
                })
            }

            return result;
        }

        const tree = [{
            userId: mainAffiliate.user.id,
            name: mainAffiliate.user.name,
            email: mainAffiliate.user.email,
            relationLevel: 0,
            children: await buildTree(userId)
        }];

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Berhasil ambil semua data affiliasi',
            data: tree
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
    getReferralTree
};
