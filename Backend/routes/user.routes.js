const router = require('express').Router();
const { generateToken } = require('../middlewares/auth.middleware');
const {User, operatorMap} = require('../models/index')
const {authenticate} = require("../middlewares/auth.middleware")



//User Crud operations
router.get('/',authenticate, async (_req, res)=>{
    try{

        const users = await User.findAll();
        res.status(200).json(users)
    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});


router.get('/:id',authenticate, async (req, res)=>{
    try{
        const id = req.params.id;
        const user = await User.findByPk(id)
        if(!user){
            return res.status(404).json({message: "User not found!"})
        }
        res.status(200).json(user)

    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});

//get users by field
router.get('/:field/:op/:value',authenticate, async (req, res)=>{
    try{
        const {field, op, value} = req.params;

        if(!operatorMap[op]){
            return res.status(400).json({message: "invalid operator"})
        }
        const where= {
            [field]: {
                [operatorMap[op]]: op === 'lk' ? `%${value}%`: value
            }
        };

        const users = await User.findAll({where})

        res.status(200).json(users)
    }
    catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
})

router.patch('/:id',authenticate, async (req, res) => {
    try{
        const id = req.params.id;
    
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
    
        const updatedUser = await user.update(req.body);
        res.status(200).json(updatedUser);

    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});

router.delete('/:id',authenticate, async (req, res)=>{
    try{
        const id = req.params.id;
    
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        await user.destroy();
        res.status(200).json({message: 'User deleted ╰(*°▽°*)╯'});

    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});

module.exports = router