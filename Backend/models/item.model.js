const { DataTypes, UUID } = require('sequelize');
const {v4: uuidv4} = require('uuid')

module.exports = (sequelize)=>{
    const Item = sequelize.define(
        'items',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING(50),
                allowNull: true,
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
            maxWeightKg:{
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
             createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        },
        {
            timestamps: true,
            indexes: [
                { fields: ['name'] },
                { fields: ['userId'] }
            ]
        }
        
    );
    
    return Item;

}