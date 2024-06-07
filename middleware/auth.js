const jwt=require('jsonwebtoken');
require('dotenv').config();
module.exports=(req,res,next)=>{
    try{
    
    const decoded=jwt.verify(req.headers.authorization.split(' ')[1],process.env.jwt_key);
    req.userData=decoded;
    next();
    }
    catch(error)
    {
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                message:'token has expired'
            })
        }
        else{
        return res.status(401).json({
            message:'Auth failed'
        });
    }
    }
}
