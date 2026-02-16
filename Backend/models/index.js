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


const operatorMap = {
    eq: Op.eq,
    lt: Op.lt,
    lte: Op.lte,
    gt: Op.gt,
    gte: Op.gte,
    lk: Op.like,
    not: Op.not

}

module.exports = {sequelize, User,Box, operatorMap}
