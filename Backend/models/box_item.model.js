const { DataTypes, UUID } = require('sequelize');
const {v4: uuidv4} = require('uuid')

module.exports = (sequelize)=>{
    const Box_Item = sequelize.define(
        'box_items',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            boxId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            itemId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
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
        }
        
    );
    
    return Box_Item;

}