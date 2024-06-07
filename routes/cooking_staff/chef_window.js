const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const checkAuth = require('../../middleware/chef_auth');
require('dotenv').config();


//getting all active/paid for orders
//have to change response json
router.get('/orders', checkAuth,(req, res, next) => {
    User.find({ 'orderDetails.status': { $in: ['paid', 'ready'] } })
        .select('userId orderDetails')
        .exec()
        .then(users => {
            const AllOrderDetails = users.flatMap(user => 
                user.orderDetails
                .filter(order => ['paid', 'ready'].includes(order.status) && order.category !== 'plastic')
                .map(order => ({
                    userId: user.userId,
                    date: order.date,
                    itemName: order.itemName,
                    quantity: order.quantity,
                    token: order.token,
                    orderId:order._id,
                    status: order.status
                }))
            );
            return res.status(200).json(AllOrderDetails);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal server error.'
            });
        });
});





//notifying user 
router.post('/notify/:orderId',checkAuth,async (req,res,next)=>{
    const orderId=req.params.orderId;
    const {userId}=req.body;
    try {
        const user = await User.findOne({ userId }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const order = user.orderDetails.find(order => order._id.toString() === orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        order.status = 'ready';
        await user.save();
        return res.status(200).json({ message: 'order is ready' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});






//delivered
router.post('/deliver', checkAuth,  async (req,res,next)=>{
    const orderId=req.body.orderId;
    console.log(orderId)
    try {
        const user = await User.findOne({ 'orderDetails': { $elemMatch: { _id: orderId } } }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'Order not found'
            });
        }
        const order = user.orderDetails.id(orderId);
        order.status = 'delivered';
        await user.save();
        return res.status(200).json({ message: 'order delivered' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});





//maybe not using this
//selecting items for cooking
router.post('/select/:orderId',checkAuth,async (req,res,next)=>{
    const orderId=req.params.orderId;
    const {userId}=req.body;
    try {
        const user = await User.findOne({ userId }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const order = user.orderDetails.find(order => order._id.toString() === orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        order.status = 'in progress';
        await user.save();
        return res.status(200).json({ message: 'order is getting ready' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
    
});
module.exports = router;
