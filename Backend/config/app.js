require('dotenv').config()
const { uploadDir } = require("../middlewares/upload.middleware")
const express =require('express')
const cors = require('cors')

const userRoutes = require("../routes/user.routes");
const itemRoutes = require("../routes/item.routes");
const boxRoutes = require("../routes/box.routes");
const box_itemRoutes = require("../routes/box_item.routes");
const authRoutes = require("../routes/auth_token.routes");


const app = express();

app.use(cors());
app.use(express.json())



//routes
app.use('/users', userRoutes);
app.use('/items', itemRoutes)
app.use('/boxes', boxRoutes)
app.use('/box_items', box_itemRoutes)
app.use('/auth', authRoutes)





module.exports = app