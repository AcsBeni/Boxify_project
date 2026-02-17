const { DataTypes, UUID } = require('sequelize');
const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid')

module.exports = (sequelize)=>{
    const User = sequelize.define(
        'users',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING(64),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique:true
            },
            password:{
                type: DataTypes.STRING(255),
                allowNull: false
            },
            role:{
                type: DataTypes.ENUM("user","admin"),
                allowNull: false,
                defaultValue: 'user'
            },
            
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            lastLoginAt: {
                 type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            timestamps: true,
            hooks:{
                beforeCreate: async(user)=>{
                    user.password = await bcrypt.hash(user.password, 10)
                },
                beforeUpdate: async (user) => {
                    if (user.changed("password")) {
                        user.password = await bcrypt.hash(user.password, 10);
                        user.secret = uuidv4()
                    }
                },
            },
            defaultScope: {
                attributes:{exclude: ['password', 'secret']}
            },
            scopes:{
                withPassword:{attributes:{}}
            }
        }
        
    );
    User.prototype.comparePassword = function (password) {
        return bcrypt.compare(password, this.getDataValue('password'));
    };
    return User;

}