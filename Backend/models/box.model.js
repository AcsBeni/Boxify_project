const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Box = sequelize.define('box', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            // unique: true  // remove if a user can have multiple boxes
        },
        code: {
            type: DataTypes.STRING(100),
            allowNull: false,
            // unique: true
        },
        labelType: {
            type: DataTypes.ENUM("QR", "BARCODE"),
            allowNull: false,
        },
        lengthCm: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        widthCm: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        heightCm: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        maxWeightKg: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: "Unknown"
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("ACTIVE","ARCHIVED","DAMAGED"),
            allowNull: false,
            defaultValue: "ACTIVE"
        }
    }, {
        timestamps: true
    });

    return Box;
};