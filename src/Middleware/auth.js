import { UserModel } from "../../DB/Models/user.Model.js"

import Jwt  from "jsonwebtoken"


export const isAuth = ()=>{
    return async(req,res,next)=>{

        try{
        const tokens = req.headers.token
        if(!tokens)
        {
            return res.status(400).json({message: 'No token provided.'})
        }
        try{
        const decoded=Jwt.verify(tokens,process.env.SIGN_IN_TOKEN_SECRET)
        if(!decoded || !decoded.id)
        {
            return res.status(400).json({Message:'error invalid token!'})
        }
        const findUser = await UserModel.findById(decoded.id);
        if(!findUser)
        {
            return res.status(400).json({Message:'Please Sign Up!'})
        }
        req.authUser=findUser
        next()
    }
    catch(error){
        if(error == 'TokenExpiredError: jwt expired')
        {
            const user = await UserModel.findOne({token:tokens})
            if(!user)
            {
                return next (new Error('errror token',{cause:500}))
            }
            console.log(user)
            //generate
        const  userToken = Jwt.sign({name:user.username,id:user._id,isLoggedin:true},process.env.SIGN_IN_TOKEN_SECRET,{expiresIn:20})  
        user.token= userToken
        await user.save()
        return res.status(200).json({ message: 'Token refreshed', userToken })
        }
    return next (new Error('invalid token',{cause:500}))
        }
    }
catch(error)
        {
            next (new Error('error',{cause:500}))
            console.log(error)
        }

    }}