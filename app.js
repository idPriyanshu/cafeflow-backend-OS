const morgan = require('morgan');
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const app=express();
app.use(express.json());
app.use(cors());
const User_plasticsRoutes=require('./routes/user/plastics');
const User_ordersRoutes=require('./routes/user/orders');
const loginRoutes=require('./routes/user/login');
const chefregistration = require('./routes/cooking_staff/registration');
const registrationRoutes=require('./routes/user/registration');
const Manager_plasticsRoutes=require('./routes/manager/plastics');
const Manager_ordersRoutes=require('./routes/manager/orders');
const Manager_productRoutes=require('./routes/manager/products');
const manager_registration = require('./routes/manager/registration');
const chefRoutes=require('./routes/cooking_staff/chef_window');
const menuRoutes=require('./routes/menu');
mongoose.connect(process.env.DB_CONNECT_STRING)
.then(()=>console.log('Connected to MongoDB Atlas'))
.catch(err=>console.log('Error connecting to MongoDB Atlas'));


app.use('/user/plastics',User_plasticsRoutes);
app.use('/user/orders',User_ordersRoutes);
app.use('/user/login',loginRoutes);
app.use('/user/registration',registrationRoutes);
app.use('/manager/plastics',Manager_plasticsRoutes);
app.use('/manager/orders',Manager_ordersRoutes);
app.use('/cooking_staff/registration',chefregistration);
app.use('/manager/products',Manager_productRoutes);
app.use('/cooking_staff/chef_window',chefRoutes);
app.use('/menu',menuRoutes);
app.use('/manager/registration',manager_registration);
module.exports=app;


