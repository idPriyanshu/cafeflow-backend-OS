const express=require('express');
const router=express.Router();
require('dotenv').config();
const checkAuth=require('../../middleware/auth');
const Token=require('../../models/token');
const User=require('../../models/users');




router.get('/', checkAuth, (req, res, next) => {
    const userId = req.userData.userId;
    User.findOne({ userId }).exec()
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                });
            } else {
                const deliveredPlasticDetails = user.plasticDetails.filter(detail => detail.status === 'delivered');
                res.status(200).json(deliveredPlasticDetails);
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({
                message: 'Internal server error'
            });
        });
});





router.get('/plastic_count',checkAuth,(req,res,next)=>{
    const userId = req.userData.userId;
    User.findOne({userId}).exec()
    .then(user=>{
        if(!user){
            return res.status(400).json({
                message:'user not found'
            })
        }
        else{
            res.status(200).json({
                message:'listed count of plastic items of user',
                userId:userId,
                plasticCount:user.plasticDetails.length
            })
        }
    })
    .catch(err=>{
        console.log(err);
        return res.status(400).json({
            message:'Internal server error'
        })
    });
});

router.post('/return',checkAuth,(req,res,next)=>{
    const userId = req.userData.userId;
    const {token}=req.body;
    console.log(token);
    User.findOne( {userId})
        .exec()
    .then(user=>{
        if(!user){
            return res.status(400).json({
                message:'user not found'
            })
        }
        else{
            
            const plasticItem = user.plasticDetails.find(item => {
                return item.token === parseInt(token);
            });

            if (!plasticItem) {
                return res.status(400).json({
                    message: 'Plastic item not found for the provided token'
                });
            }
            plasticItem.status = 'returning';
            user.save()
            .then(result=>{
                res.status(200).json({
                    message:'plastic item sent for returning',
                    userId:userId,
                    plasticItem:plasticItem
                })
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    message:'Internal server error'
                })
            });
        
        }
    })
    .catch(err=>{
        return res.status(500).json({
            message:'Internal server error'
        })
    });
});



module.exports=router;