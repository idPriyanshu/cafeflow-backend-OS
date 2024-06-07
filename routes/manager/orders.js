const express = require('express');
const router = express.Router();
const User=require('../../models/users');
const Token=require('../../models/token');
require('dotenv').config();
const checkAuth=require('../../middleware/managerAuth');



router.get('/sale', checkAuth,(req, res,next) => {
    User.find()
    .exec()
    .then(users=>{
        const processedOrders = users.flatMap(user => {
            return user.orderDetails
            .filter(order => ['paid', 'ready', 'delivered'].includes(order.status))
            .map(order => ({
                userId: user.userId,
                date: order.date,
                itemName: order.itemName,
                quantity: order.quantity,
                token:order.token,
                totalAmount:order.totalAmount,
                status:order.status,
                orderId:order._id
            }));
        });
        return res.status(200).json(processedOrders);
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
            message:'Internal server error.'
        });
    });
});
//pending orders of specific users
// router.get('/:id', checkAuth, async (req, res, next) => {
//     const userId = req.params.id;
//     try {
//         const user = await User.findOne({ userId }).exec();
//         if (!user) {
//             return res.status(400).json({
//                 message: 'User not found'
//             });
//         }
//         const salesOrders = user.orderDetails
//             .filter(order => order.status === 'pending')
//             .map(order => ({
//                 userId: user.userId,
//                 date: order.date,
//                 itemName: order.itemName,
//                 quantity: order.quantity,
//                 token: order.token
//             }));
//         return res.status(200).json({
//             message: 'orders listed of specific user',
//             orderDetails: salesOrders
//         });
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: 'Internal server error'
//         });
//     };
// });




//route for listing all pending orders
router.get('/', checkAuth,(req, res,next) => {
    User.find()
    .exec()
    .then(users=>{
        const pendingOrders = users.flatMap(user => {
            return user.orderDetails
            .filter(order => order.status === 'pending')
            .map(order => ({
                userId: user.userId,
                date: order.date,
                itemName: order.itemName,
                quantity: order.quantity,
                token:order.token,
                totalAmount:order.totalAmount,
                status:order.status,
                orderId:order._id
            }));
        });
        return res.status(200).json(pendingOrders);
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
            message:'Internal server error.'
        });
    });
});


//get all sales



//route accepting the order
router.put('/accept', checkAuth, async (req, res, next) => {
    const { orderId } = req.body;
    try {
        const user = await User.findOne({ "orderDetails._id": orderId }).exec();
        console.log(orderId);
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const order = user.orderDetails.find(order => order._id.toString() === orderId);
        const plastic = user.plasticDetails.find(plastic => plastic.token === order.token);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        if(plastic)
        {
            plastic.status='accepted';
        }
        order.status = 'accepted';
        await user.save();
        return res.status(200).json({ message: 'Order is accepted by manager' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});





//route for rejecting order by manager
router.put('/reject', checkAuth, async (req, res, next) => {
    const { orderId } = req.body;
    try {
        const user = await User.findOne({ "orderDetails._id": orderId }).exec();
        console.log(orderId);
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const order = user.orderDetails.find(order => order._id.toString() === orderId);
        const plastic = user.plasticDetails.find(plastic => plastic.token === order.token);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        if(plastic)
        {
            plastic.status='rejected';
        }
        order.status = 'rejected';
        await user.save();
        return res.status(200).json({ message: 'Order is rejected by manager' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});
module.exports = router;
