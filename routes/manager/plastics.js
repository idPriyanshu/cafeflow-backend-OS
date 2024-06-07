const express=require('express');
const router=express.Router();
const User=require('../../models/users');
const checkAuth=require('../../middleware/managerAuth');
const Token=require('../../models/token');
require('dotenv').config();

//route for listing all plastic details
router.get('/', checkAuth, (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            const plasticDetails = users.flatMap(user => user.plasticDetails);
            res.status(200).json(plasticDetails);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal server error.'
            });
        });
});

// get paid items
router.get('/paid', checkAuth, (req, res, next) => {
    User.find({ "plasticDetails.status": "paid" })
        .exec()
        .then(users => {
            const plasticDetails = users.flatMap(user => 
                user.plasticDetails.filter(detail => detail.status === 'paid')
            );
            res.status(200).json(plasticDetails);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal server error.'
            });
        });
});

//get plastic details with status returning
router.get('/returning', checkAuth, (req, res, next) => {
    User.find({ "plasticDetails.status": "returning" })
        .exec()
        .then(users => {
            const returningPlasticDetails = users.flatMap(user => 
                user.plasticDetails.filter(detail => detail.status === 'returning')
            );
            res.status(200).json(returningPlasticDetails);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal server error.'
            });
        });
});



//route for listing plastic details of specific user
router.get('/:id',checkAuth,(req,res,next)=>{
    const userId=req.params.id;
    User.findOne({userId})
    .exec()
    .then(user=>{
        if(!user){
            return res.status(400).json({
                message:'user not found'
            });
        }
        res.status(200).json({
            userId:user.userId,
            plasticDetails:user.plasticDetails
        });
    })
    .catch(err=>{
        return res.status(500).json({
            message:'Internal server error.'
        });
    });

});


//route for updating plastic details of specific user
router.put('/return',checkAuth,(req,res,next)=>{
    const {token}=req.body;
    User.findOneAndUpdate({ "plasticDetails.token": token }, { "plasticDetails.$.status": 'returned' })
    .exec()
    .then(user => {
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        res.status(200).json({
            message: 'Plastic returned successfully'
        });
    })
    .catch(err => {
        return res.status(500).json({
            message: 'Internal server error.'
        });
    });
});



//route for rejecting plastic of specific user
router.put('/reject', checkAuth, (req, res, next) => {
    const { token } = req.body;
    User.findOneAndUpdate({ "plasticDetails.token": token }, { "plasticDetails.$.status": 'delivered' })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                });
            }
            res.status(200).json({
                message: 'Plastic details rejected successfully'
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal server error.'
            });
        });
});


//plastic item delivery
router.put('/deliver', checkAuth, (req, res, next) => {
    const { token } = req.body;
    console.log('token:', token); // Add this line
    User.findOneAndUpdate({ "plasticDetails.token": token }, { "plasticDetails.$.status": 'delivered' })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                });
            }
            res.status(200).json({
                message: 'Plastic item delivered successfully'
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal server error.'
            });
        });
});

module.exports=router;