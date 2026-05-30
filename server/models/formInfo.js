module.exports = (sequelize, Sequelize) => {
    const FormInfo = sequelize.define("formInfo", {
        // 原有业务字段（保持不变）
        senderAddr: {
            type: Sequelize.STRING(42),
            allowNull: false
        },
        logisticsCompanyName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        senderAddressInfo: {
            type: Sequelize.STRING(42),
            allowNull: false
        },
        senderContact: {
            type: Sequelize.BIGINT(11),
            allowNull: false
        },
        receiverAddr: {
            type: Sequelize.STRING(42),
            allowNull: false
        },
        receiverAddressInfo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        receiverContact: {
            type: Sequelize.BIGINT(11),
            allowNull: false
        },
        logisticsInfoAddr: {
            type: Sequelize.STRING(42),
            allowNull: false,
            unique: true
        },
        status: {
            type: Sequelize.ENUM('on', 'off'),
            allowNull: false,
            defaultValue: 'on'
        },
        productAddr: {
            type: Sequelize.STRING(42),
            allowNull: false
        },
        // 关联商品的外键（对应 goods.id）
        goodsId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'goods', // 关联的数据库表名
                key: 'id' // 关联表的主键
            },
            comment: '关联商品表的主键ID'
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        underscored: false,
        tableName: 'formInfo' // 明确指定表名
    });

    return FormInfo;
};

