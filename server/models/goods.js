module.exports = (sequelize, Sequelize) => {
    // 完全对齐数据库 goods 表实际字段
    const Goods = sequelize.define("goods", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        productAddr: {
            type: Sequelize.STRING(42),
            allowNull: false,
            unique: true
        },
        productName: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        productType: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        productNum: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        productionDate: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        expirationDate: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        barcode: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        // createdAt、updatedAt 表中已有，Sequelize 自动维护，无需重复定义
    }, {
        timestamps: true, // 启用自动时间戳（createdAt/updatedAt）
        freezeTableName: true, // 禁止表名自动加复数（保持 goods 表名）
        underscored: false, // 字段名与表一致（不转下划线）
        tableName: 'goods' // 明确指定表名（避免歧义）
    });

    return Goods;
};
