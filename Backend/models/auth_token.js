const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const AuthToken = sequelize.define(
    'auth_tokens',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      type: {
        type: DataTypes.ENUM('VERIFY_EMAIL', 'RESET_PASSWORD'),
        allowNull: false
      },

      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        defaultValue: () => uuidv4()
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },

      usedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      timestamps: true,
      indexes: [
        { fields: ['token'] },
        { fields: ['userId'] }
      ]
    }
  );

  return AuthToken;
};
