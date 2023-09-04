import { UserModel } from '../../DB/Models/user.model.js'

import Jwt  from "jsonwebtoken"
import { VerifyToken, generateToken } from '../utils/TokenFunction.js'


export const isAuth = (roles)=>{
    return async(req,res,next)=>{

        try{
        const tokens = req.headers.token
        // console.log(tokens)
        if(!tokens)
        {
            return res.status(400).json({message: 'No token provided.'})
        }
        try{
        const decoded=VerifyToken({token:tokens,signature:process.env.SIGN_IN_TOKEN_SECRET})
        // console.log({decoded})
        if(!decoded || !decoded._id)
        {
            return res.status(400).json({Message:'error invalid token!'})
        }
        const findUser = await UserModel.findById(decoded._id,
            'email userName role');
            // console.log(findUser)
        if(!findUser)
        {
            return res.status(400).json({Message:'Please Sign Up!'})
        }
        // if(parseInt(decoded.ChangePassAt.GetTime()/1000)>decoded.iat)
        // {
        //     return res.status(400).json({Message:'token expired after change password'})
        // }
        // console.log(roles)
        // console.log(findUser.role)
        // if (!roles.includes(findUser.role))
        // {
        //     return next(new Error('unauthorized to acceess this api',{cause:401}))
        // }
        req.authUser=findUser
        next()
    }
    catch(error){
        if(error == 'TokenExpiredError: jwt expired')
        {
            const user = await UserModel.findOne({tokens})
            if(!user)
            {
                return next (new Error('errror token',{cause:500}))
            }
            console.log(user)
            //generate
        const  userToken = generateToken({payload:{name:user.userName,_id:user._id},
            signature:process.env.SIGN_IN_TOKEN_SECRET
        },{expiresIn:'1h'})  
        // user.token= userToken
        // await user.save()
        await UserModel.findOneAndUpdate({
            tokens},{
            token:userToken  
            })
        return res.status(200).json({ message: 'Token refreshed', userToken })
        }
        console.log(error)
    return next (new Error('invalid tokenn',{cause:500}))
        }
    }
catch(error)
        {
            next (new Error('error',{cause:500}))
            console.log(error)
        }

    }}