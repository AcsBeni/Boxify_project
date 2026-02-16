const router = require('express').Router();
const {Item, operatorMap} = require('../models/index')
const {authenticate} = require("../middlewares/auth.middleware")

//Item Crud operations
router.get('/',authenticate, async (req, res)=>{
   try{
     const items = await Item.findAll();
     res.status(200).json(items)
   }
   catch(e){
    res.status(500).json({message: "Server error", error : e.message})
   }
});
//get Items by id
router.get('/:id',authenticate, async (req, res)=>{
    try{
        const Item = await Item.findByPk(req.params.id);
        if(Item){
            res.status(200).json(Item)
        }else{
            res.status(404).json({message: "Item not found"})
        }
    }
    catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
    
});

//get Items by field
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

        const Items = await Item.findAll({where})

        res.status(200).json(Items)
    }
    catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
})

//add Item
router.post('/',authenticate, async (req, res)=>{
    try{

        const {userId,
            name,
            description,
            lengthCm,
            widthCm,
            heightCm,
            maxWeightKg,
            updatedAt,
            createdAt} = req.body;
        const Item = await Item.create({
            userId,
            name,
            description,
            lengthCm,
            widthCm,
            heightCm,
            maxWeightKg,
            updatedAt,
            createdAt
        })
        res.status(201).json(Item)
    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});
router.patch('/:id',authenticate, async (req, res)=>{
    try{

        const {userId,
            name,
            description,
            lengthCm,
            widthCm,
            heightCm,
            maxWeightKg,
            updatedAt,
            createdAt} = req.body;
        const Item = await Item.update({
            userId,
            name,
            description,
            lengthCm,
            widthCm,
            heightCm,
            maxWeightKg,
            updatedAt,
            createdAt
        }, {
            where: {
                id: req.params.id
            }
        })
        if(Item[0] > 0){
            res.status(200).json({message: "Item updated"})
        }else{
            res.status(404).json({message: "Item not found"})
        }
    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});
router.delete('/:id',authenticate, async (req, res)=>{
    try{
        const Item = await Item.destroy({
            where: {
                id: req.params.id
            }
        })
        if(Item > 0){
            res.status(200).json({message: "Item deleted"})
        }else{
            res.status(404).json({message: "Item not found"})
        }

    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});




module.exports = router