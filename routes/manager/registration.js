const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt');
const {signAccessToken}=require('../../helpers/jwt_helper');
const Token=require('../../models/token');
require('dotenv').config();
const User=require('../../models/managers');

function waste(req,res){
    res.json({message: 'waste'});
    res.end();
}


router.post('/',waste, (req, res,next) => {
    const {userId,name,email,password}=req.body;

    if(!userId || !name || !email || !password ){
        res.status(400).json({
            message:'please fill other fields also'
        });
        return;
    }
    User.findOne({ userId }).exec()
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({
                    message: 'User already exists.'
                });
            }
            bcrypt.hash(password,10,(err,hash)=>{
                    if(err){
                        return res.status(500).json({
                            error:err
                        });
                    }
                    else{
            const user = new User({
                userId: userId,
                name: name,
                email: email,
                password: hash
            });
            user.save()
                .then(result => {
                    signAccessToken(user.userId,'manager')
                .then(token=>{
                    return res.status(200).json({
                        message:'registrated Successfully',
                        token:token
                    });
                })
                .catch(err=>{
                    console.log(err);
                    return res.status(500).json({
                        message:'Internal server error'
                    });
                });
                    
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: 'Internal server error.'
                    });
                });
        }});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error.'
            });
        });
    
});
module.exports=router;