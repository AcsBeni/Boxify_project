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

router.post('/registration', async (req, res)=>{
   try{
     const {name, email, password, confirm} = req.body

    const user = await User.create({name, email, password})
    res.status(201).json(user)
   }
   catch(e){
    res.status(500).json({message: 'Registration failed!', error: e.message});
   }
});
//user login
router.post('/login', async (req, res)=>{
    try{
     const {email, password, } = req.body

    const user = await User.scope("withPassword").findOne({ where: {email}})
    if(!user) return res.status(401).json({message: "Nincs ilyen felhasználó"})
    if(!user.status) return res.status(403).json({message: 'this User is banned'})
    
    const ok = await user.comparePassword(password);

    if(!ok) return res.status(401).json({message: "Jelszó nem jó"})
    
    await user.update({last: new Date()})
    //token
    const token = await generateToken(user)
    //siker
    res.status(200).json({token})
   }
   catch(e){
    res.status(500).json({message: 'Login failed!', error: e.message});
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