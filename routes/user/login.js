const mongoose=require('mongoose');
const express = require('express');
require('dotenv').config();
const Token=require('../../models/token');
const rateLimit = require("express-rate-limit");
const bcrypt=require('bcrypt');
const {signAccessToken}=require('../../helpers/jwt_helper');
const router = express.Router();
const User=require('../../models/users');
const Manager=require('../../models/managers')
const chef=require('../../models/chef');


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many login attempts from this IP, please try again later."
  });



//manager authentication
router.post('/', async (req, res, next) => {
    const { userId, password ,userRole} = req.body;
    if(userRole === 'manager'){
        Manager.findOne({userId}).exec()
    .then(manager=>{
        if(!manager){
            console.log("no manager found")
           return  res.status(400).json({
                message:'Invalid Credentials.'
            });
        }
        if(bcrypt.compareSync(password,manager.password)){
            signAccessToken(manager.userId,userRole)
                .then(token=>{
                    return res.status(200).json({
                        message:'Logged in Successfully',
                        token:token
                    });
                })
                .catch(err=>{
                    console.log(err);
                    return res.status(500).json({
                        message:'Internal server error.'
                    });
                });
        }
        else{
            return  res.status(400).json({
                message:'Invalid Credentials..'
            });
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message:'Internal server error..'
        })
    });
    }
    else if(userRole === 'chef'){
        chef.findOne({userId}).exec()
        .then(chef=>{
            if(!chef){
               return  res.status(400).json({
                    message:'Invalid Credentials...'
                });
            }
            if(bcrypt.compareSync(password,chef.password)){
                signAccessToken(chef.userId,userRole)
                    .then(token=>{
                        return res.status(200).json({
                            message:'Logged in Successfully',
                            token:token
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        return res.status(500).json({
                            message:'Internal server error...'
                        });
                    });
            }
            else{
                return  res.status(400).json({
                    message:'Invalid Credentials....'
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                message:'Internal server error....'
            })
        });
    }
    else{
    User.findOne({userId}).exec()
    .then(user=>{
        if(!user){
           return  res.status(400).json({
                message:'Invalid Credentials.....'
            });
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err){
                console.log(err);
                return  res.status(400).json({
                    message:'Invalid Credentials......'
                });
            }
            if(result){
                signAccessToken(user.userId,userRole)
                .then(token=>{
                    return res.status(200).json({
                        message:'Logged in Successfully',
                        token:token
                    });
                })
                .catch(err=>{
                    console.log(err);
                    return res.status(500).json({
                        message:'Internal server error.....'
                    });
                });
                
            }
            else{
                console.log(password);
                return  res.status(400).json({
                    message:'Invalid Credentials'
                });
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message:'Internal server error......'
        })
    });
}
   
});


router.get('/test',async(req,res)=>{
    res.send('Hello');
}
);


module.exports=router;