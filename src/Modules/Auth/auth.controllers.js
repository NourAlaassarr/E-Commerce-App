import {UserModel} from '../../../DB/Models/user.model.js'
import {VerifyToken,generateToken}from '../../utils/TokenFunction.js'
import{sendmailService}from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import pkg from 'bcrypt'
import { nanoid } from 'nanoid'

// Sign Up//
export const SignUp=async (req,res,next)=>{
const{
    userName,
    phone,
    email,
    Cpassword,
    Password,
    gender,
    Age,
    Address
}= req.body

const IsEmailExsits = await UserModel.findOne({email})
if(IsEmailExsits)
{
    return next(new Error('Email is Already Exsit',{cause:400}))
}

if(Password != Cpassword)
{
    return next(new Error('Password doesn\'t match',{cause:400}))
}

//HashPass i used the Hooks
// const hashedPass= pkg.hashSync(Password,+process.env.SALT_ROUNDS)
const token = generateToken({
    payload:{
        email,
    },
    signature:process.env.CONFIRMATION_EMAIL_TOKEN,
expiresIn:'1h'})

const ConfirmLink=`${req.protocol}://${req.headers.host}/auth/confirm/${token}`
const isEmailSent =sendmailService({
    to:email,
    subject:'Confirmation Email',
    message:emailTemplate({link:ConfirmLink,
        linkData:'Click here to Confirm',
        subject:'Confirmation Email'})
    // `<a href=${ConfirmLink}>Click here to Confirm </a>`,
})
if(!isEmailSent)
{
    return next(new Error('Failed to send Confirmation Email',{cause:400}))
}
const user = new UserModel({
    userName,
    phone,
    email,
    Cpassword,
    Password,
    gender,
    Age,
    Address,
})
const savedUser = await user.save()
res.status(201).json({Message:'Done',savedUser})
}

export const Confirm= async(req,res,next)=>{
    const {token}= req.params
    const decoded = VerifyToken({token,signature:process.env.CONFIRMATION_EMAIL_TOKEN})
    const User = await UserModel.findOne({email:decoded.email , isConfirmed:false},{
        isConfirmed:true,
    },
    {
        new:true,
    })
    if(!User){
        return next(new Error('Already Confirmed',{cause:400}))
    }
    res.status(200).json({message:'Successfully confirmed,Try to log in'})
}

//Sign IN 
export const SignIN = async (req,res,next)=>{
    const{email,Password}=req.body
    const user = await UserModel.findOne({email})
    if(!user)
    {
        return next(new Error('Invalid credentials',{cause:400}))
    }
    const IsPasswordMatch = pkg.compareSync(Password,user.Password)
    if(!IsPasswordMatch)
    {
        return next(new Error('Invalid credentials',{cause:400}))
    }
    const token = generateToken({
        payload:{
            email,
            _id:user._id,
            role:user.role
        },
        signature:process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn:'1h',
    })

    const userUpdated=await UserModel.findOneAndUpdate({email},{
        token,
        status:'Online',
    },{new:true})
res.status(200).json({Message:"successfully Logged IN",userUpdated})
}

//ForgetPassword
export const  ForgetPassword= async(req,res,next)=>{
    const{email}=req.body
    const EmailCheck = await UserModel.findOne({email})
    if(!EmailCheck){
        return next(new Error('invalid Email',{cause:400}))
    }
    const Code = nanoid()
    const hashedCode =pkg.hashSync(Code,+process.env.SALT_ROUNDS)

    const token =generateToken({
        payload:{
            email,
            sentCode:hashedCode,
        },
        signature:process.env.RESET_PASS_TOKEN,
        expiresIn:'1h',
    })

    const ResetPasswordLink = `${req.protocol}://${req.headers.host}/auth/reset/${token}`
    const isEmailSent =sendmailService({
        to:email,
        subject:'Reset Password',
        message:emailTemplate({
            link:ResetPasswordLink,
            linkData:'Click here to Reset Password',
            subject:'Reset Password'})
        })
        if(!isEmailSent)
{
    return next(new Error('Failed to send Reset Password Email',{cause:400}))
}
const UserUpdate=await UserModel.findOneAndUpdate({email,},
    {
        Code:hashedCode
    },{
        new:true
    })
    res.status(200).json({Message:'Done',UserUpdate,ResetPasswordLink})
}



//ReseetPassword
export const reset = async(req,res,next)=>{
    const{token}=req.params
    const {NewPassword}=req.body
    const decoded = VerifyToken({token,signature:process.env.RESET_PASS_TOKEN})
    const user = await UserModel.findOne({email:decoded?.email,
    Code:decoded?.sentCode
})
if(!user){
    return next(new Error('you already rest your password, try to login',{cause:400}))
}
user.Password=NewPassword
user.Code=null
user.ChangePassAt=Date.now()
const ResetPassword=await user.save()
    res.status(200).json({Message:'Done',ResetPassword})
}

//changePassword