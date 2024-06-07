const express = require('express');
const router = express.Router();
const Products=require('../../models/products');
const Token=require('../../models/token');
const max=100;
require('dotenv').config();
const checkAuth=require('../../middleware/managerAuth');
router.get('/',checkAuth, (req, res,next) => {
    Products.find()
    .exec()
    .then(Products=>{
        res.status(200).json({
            Products:Products
        })
    })
    .catch(err=>{
        res.status(500).json({
            message:'Internal server error'
        })
    });
});
router.patch('/add',checkAuth, (req,res,next)=>{
    const {itemName,cost,availability,category}=req.body;
    Products.findOne({itemName}).exec()
    .then(product=>{
        if(product){
            res.status(400).json({
                message:'product already exist'
            });
        }
        else{
            const itemId=Math.floor(Math.random()*max);
            const newProduct=new Products({
                itemId:itemId,
                itemName:itemName,
                cost:cost,
                availability:availability,
                category:category
            });
            newProduct.save()
            .then(result=>{
                res.status(200).json({
                    message:'product added successfully'
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    message:'Internal server error'
                });
            });
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({

            message:'Internal server error'
        });
    });
});
router.patch('/update',checkAuth, (req,res,next)=>{
    const itemName=req.body.itemName;
    Products.findOne({itemName}).exec()
    .then(product=>{
        if(!product){
            return res.status(400).json({
                message:'product not found'
            });
        }
        const updateobj={};
        for(const key of Object.keys(req.body)){
            if(key!==itemName)
            updateobj[key]=req.body[key];
        }
        console.log(updateobj);
        Products.updateOne({itemName:itemName},{$set:updateobj}).exec()
        .then(result=>{
            res.status(200).json({
                message:'updated successfully'
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
    
                message:'Internal server error'
            });
        });

        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({

            message:'Internal server error'
        });
    });
});
router.delete('/',checkAuth, (req,res,next)=>{
    const itemName=req.body.itemName;
    Products.findOne({itemName}).exec()
    .then(product=>{
        if(!product){
            return res.status(400).json({
                message:'product not found'
            });
        }
        Products.deleteOne({itemName:itemName}).exec()
        .then(result=>{
            res.status(200).json({
                message:'deleted successfully'
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
    
                message:'Internal server error'
            });
        });

        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({

            message:'Internal server error'
        });
    });
});
module.exports=router;