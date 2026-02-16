const router = require('express').Router();
const {Box_Item, operatorMap} = require('../models/index')
const {authenticate} = require("../middlewares/auth.middleware")

//Box_Item Crud operations
router.get('/',authenticate, async (req, res)=>{
   try{
     const Box_Items = await Box_Item.findAll();
     res.status(200).json(Box_Items)
   }
   catch(e){
    res.status(500).json({message: "Server error", error : e.message})
   }
});
//get Box_Item by id
router.get('/:id',authenticate, async (req, res)=>{
    try{
        const Box_Item = await Box_Item.findByPk(req.params.id);
        if(Box_Item){
            res.status(200).json(Box_Item)
        }else{
            res.status(404).json({message: "Box_Item_Item not found"})
        }
    }
    catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
    
});

//get Box_Items by field
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

        const Box_Items = await Box_Item.findAll({where})

        res.status(200).json(Box_Items)
    }
    catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
})

//add Box_Item
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
        const Box_Item = await Box_Item.create({
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
        res.status(201).json(Box_Item)
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
        const Box_Item = await Box_Item.update({
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
        if(Box_Item[0] > 0){
            res.status(200).json({message: "Box_Item updated"})
        }else{
            res.status(404).json({message: "Box_Item not found"})
        }
    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});
router.delete('/:id',authenticate, async (req, res)=>{
    try{
        const Box_Item = await Box_Item.destroy({
            where: {
                id: req.params.id
            }
        })
        if(Box_Item > 0){
            res.status(200).json({message: "Box_Item deleted"})
        }else{
            res.status(404).json({message: "Box_Item not found"})
        }

    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});




module.exports = router