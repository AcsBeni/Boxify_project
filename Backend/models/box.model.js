const { DataTypes, UUID } = require('sequelize');
const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid')

module.exports = (sequelize)=>{
    const Box = sequelize.define(
        'box',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            code: {
                type: DataTypes.STRING(100),
                unique: true,
                allowNull: false
            },
            labelType: {
                type: DataTypes.ENUM("QR","BARCODE"),
                allowNull: false,
            },
            lengthCm:{
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            widthCm:{
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            heightCm:{
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING(100),
                allowNull: true,
                defaultValue: DataTypes.NOW
            },
            note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("ACTIVE","ARCHIVED","DAMAGED"),
                allowNull: false,
                defaultValue: "ACTIVE"
            },
             createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        },
        {
            timestamps: true,
        }
        
    );
    
    return Box;

}