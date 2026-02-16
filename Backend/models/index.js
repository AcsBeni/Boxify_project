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



//Connects
User.hasMany(Box, {
  foreignKey: 'userId',
  as: 'boxes',
  onDelete: 'CASCADE'
});
    //USER
    Box.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
    });

    Item.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
    });
    AuthToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
    });
    //BOX
    Box_Item.belongsTo(Box, {
    foreignKey: 'boxId',
    as: 'box'
    });

    //Items
    Item.belongsTo(Item, {
    foreignKey: 'itemId',
    as: 'item'
    });

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
