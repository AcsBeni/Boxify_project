const { Sequelize, Op } = require('sequelize');
const dbConfig = require("../config/database")

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.pass,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
        logging: dbConfig.logging
    }

);

const User = require('./user.model')(sequelize)
const Box = require('./box.model')(sequelize)
const Box_Item = require('./box_item.model')(sequelize)
const Item = require('./item.model')(sequelize)
const AuthToken = require('./auth_token')(sequelize)

/* =========================
   USER RELATIONSHIPS
========================= */

// User → Boxes
User.hasMany(Box, {
  foreignKey: 'userId',
  as: 'boxes',
  onDelete: 'CASCADE'
});
Box.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User → Items
User.hasMany(Item, {
  foreignKey: 'userId',
  as: 'items',
  onDelete: 'CASCADE'
});
Item.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User → Auth Tokens
User.hasMany(AuthToken, {
  foreignKey: 'userId',
  as: 'authTokens',
  onDelete: 'CASCADE'
});
AuthToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

/* =========================
   BOX / ITEM RELATIONSHIPS
========================= */

// Box → Box_Items
Box.hasMany(Box_Item, {
  foreignKey: 'boxId',
  as: 'box_Items',
  onDelete: 'CASCADE'
});
Box_Item.belongsTo(Box, {
  foreignKey: 'boxId',
  as: 'box'
});

// Item → Box_Items
Item.hasMany(Box_Item, {
  foreignKey: 'itemId',
  as: 'box_Items',
  onDelete: 'CASCADE'
});
Box_Item.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item'
});

/* =========================
   OPERATORS
========================= */

const operatorMap = {
    eq: Op.eq,
    lt: Op.lt,
    lte: Op.lte,
    gt: Op.gt,
    gte: Op.gte,
    lk: Op.like,
    not: Op.not

}

module.exports = {sequelize,
     User,
     Box,
     Box_Item,
     Item,
     AuthToken,
    operatorMap}
