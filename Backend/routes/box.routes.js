const router = require('express').Router();
const {Box, operatorMap} = require('../models/index')
const {authenticate} = require("../middlewares/auth.middleware")

//Box Crud operations
router.get('/',authenticate, async (req, res)=>{
   try{
     const Boxes = await Box.findAll();
     res.status(200).json(Boxes)
   }
   catch(e){
    res.status(500).json({message: "Server error", error : e.message})
   }
});
//get Boxs by id
router.get('/:id',authenticate, async (req, res)=>{
    try{
        const box = await Box.findByPk(req.params.id);
        if(box){
            res.status(200).json(box)
        }else{
            res.status(404).json({message: "Box not found"})
        }
    }
    catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
    
});

//get Boxs by field
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

        const Boxs = await Box.findAll({where})

        res.status(200).json(Boxs)
    }
    catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
})

//add Box
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
        const box = await Box.create({
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
        res.status(201).json(box)
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
        const Box = await Box.update({
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
        if(Box[0] > 0){
            res.status(200).json({message: "Box updated"})
        }else{
            res.status(404).json({message: "Box not found"})
        }
    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});
router.delete('/:id',authenticate, async (req, res)=>{
    try{
        const Box = await Box.destroy({
            where: {
                id: req.params.id
            }
        })
        if(Box > 0){
            res.status(200).json({message: "Box deleted"})
        }else{
            res.status(404).json({message: "Box not found"})
        }

    }
     catch(e){
        res.status(500).json({message: "Server error", error : e.message})
    }
});




module.exports = router