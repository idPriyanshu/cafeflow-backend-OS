const express = require('express');
const router = express.Router();
require('dotenv').config();
const products=require('../models/products');
//getting menu for user
//has to change this
router.get('/',(req, res,next) => {
    products.find().exec()
    .then(pro=>{
        const productsInfo=pro.map(product=>{
            return {
                itemName:product.itemName,
                price:product.cost
            }
        });
        res.status(200).json({
            message:'here is the menu',
            menu:productsInfo
           });
       }
    )
    .catch(err=>
    {
        console.log(err);
        return res.status(500).json({
            message:'Internal server error'
        });
    });
});
module.exports = router;