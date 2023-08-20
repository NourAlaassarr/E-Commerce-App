import { UserModel } from "../../../DB/Models/user.mdel.js"
import  jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { generateToken, VerifyToken } from '../../utils/TokenFunction.js'
import { nanoid } from "nanoid"
import { generateQRcode } from '../../utils/QRFunction.js'

import {sendmailService} from '../../Services/SendEmailService.js'
export const signUp= async(req,res,next)=>
{
    const {username,email,password,Cpassword,gender,age,phone, FirstName, LastName}=req.body
        
        const Check = await UserModel.findOne({email:email.toLowerCase()})
        if(Check)
        {
        return res.json({Message:'Email already exists,signin instead'})
        }
        const Phonecheck = await UserModel.find({phone})
        if(Phonecheck.length >0)
        {
        return res.json({Message:'phone number already used'})
        }

        if(password!=Cpassword)
        {
            return res.json({Message:'Password doesn\'t match.!'})
        }
        //confirm email
            const token = jwt.sign({email},process.env.CONFIRMATION_EMAIL_TOKEN,{
            expiresIn: '1h',})
            const confirmlink= `${req.protocol}://${req.headers.host}/User/ConfirmEmail/${token}`
            const RefToken = jwt.sign({email},process.env.CONFIRMATION_EMAIL_TOKEN,{ expiresIn: '1h',})
            const RefLink= `${req.protocol}://${req.headers.host}/User/RefreshToken/${RefToken}`
            const message = `<a href=${confirmlink}> Click to confirm your email </a> <br> <a href=${RefLink}> Click to confirm your email </a>`
            const isEmailSent = await sendmailService({
                message,
                to:email,
                subject:'confirmation email'
            })
            if (!isEmailSent) {
                return res.json({ message: 'Please try again later or contact the support team' })
            }

        // await sendmailService({
        //     to:email,
        //     message:`<h1>test sendEmail <h1>`,
        //     subject:'TEST'

        // })
        const hashedPassword = bcrypt.hashSync(password,+process.env.SALT_ROUNDS)
        const UserInstance = new UserModel({username,email,password:hashedPassword,Cpassword:hashedPassword,gender,Age:age,phone, FirstName, LastName})
        await UserInstance.save()
        return res.status(200).json({ message: 'Done', UserInstance })
}

export const confirm = async(req,res,next)=>
{
    const{token}=req.params
    if(!token)
    {
        return res.json('token not provided')
    }
    const decodeddata = VerifyToken({token,
        signature:process.env.CONFIRMATION_EMAIL_TOKEN})
        if (!decodeddata) {
            return next(
            new Error('token decode fail, invalid token', {
                cause: 400,
            }),
            )}
    const conf = await UserModel.findOne({email:decodeddata.email})
    if (conf.isConfirmed) {
        return res.status(400).json({ message: 'Your email is already confirmed' })
    }
    const user = await UserModel.findOneAndUpdate(
        { email: decodeddata.email },
        { isConfirmed: true,
    token },
        {new: true},
    )
    res.status(200).json({ message: 'Confirmed successfully please try to login', user })
    }

    //refresh Token
    export const RefreshToken = async(req,res,next)=>
{
    const{token}=req.params
    if(!token)
    {
        return res.json('token not provided')
    }
    const decodeddata = VerifyToken({token,
        signature:process.env.CONFIRMATION_EMAIL_TOKEN})
        if (!decodeddata) {
            return next(
            new Error('token decode fail, invalid token', {
                cause: 400,
            }),
            )}
            const reftoken = jwt.sign({email:decodeddata.email},process.env.CONFIRMATION_EMAIL_TOKEN,{
                expiresIn: '1h',})
                const Reflink= `${req.protocol}://${req.headers.host}/User/ConfirmEmail/${reftoken}`
                const message = `<a href=${Reflink}> Click to confirm your email </a>`
                const isEmailSent = await sendmailService({
                    message,
                    to:decodeddata.email,
                    subject:'confirmation email'
                })
                if (!isEmailSent) {
                    return res.json({ message: 'Please try again later or contact the support team' })
                }
    res.status(200).json({ message: 'please confirm email through msg' })
    }

    //forgetpassword
export const ForgetPassword= async(req,res,next)=>{
    const{email}=req.body
    const isExsit = await UserModel.findOne({email:email.toLowerCase()})
    if(!isExsit)
    {
        return next (new Error('user doesn\'t exsit'),{cause:400})
    }
    let code = nanoid(4)
    let hashedCode = bcrypt.hashSync(code,+process.env.SALT_ROUNDS)
    const token = jwt.sign({ email: isExsit.email, code: hashedCode }, process.env.FORGET, { expiresIn: 60 * 5 });
console.log(token)
const confirmlink =`${req.protocol}://${req.headers.host}/User/ResetPassword/${token}`;
const message = `<a href=${confirmlink}> Click to Reset your Password </a>`
const isEmailSent = await sendmailService({
    message, 
    to:isExsit.email,
    subject:'Reset Pass'})
    if (!isEmailSent) {
        return res.json({ message: 'email does\'nt exist'})
    }
    const NewUser = await UserModel.findOneAndUpdate({email:email.toLowerCase()},{code},{new:true})
    res.status(201).json({ message: 'please Reset Your password ',confirmlink })}
//resetpassword
export const ResetPassword= async(req,res,next)=>{
    const{token}=req.params
    const {newpass}=req.body
    if(!token)
    {
        return res.json('token not provided')
    }
    const decodeddata = VerifyToken({
        token,signature: process.env.FORGET});

        if (!decodeddata) {
            return next(
            new Error('token decode fail, invalid token', {
                cause: 400,
            }),
            )}
            const isExsit = await UserModel.findOne({email:decodeddata.email.toLowerCase()})
            if(!isExsit)
            {
                return next (new Error('user doesn\'t exsit'),{cause:400})
            }
            const match = bcrypt.compareSync(isExsit.Code,decodeddata.Code)
            if(!match)
            {
                return next(new Error('Code doesn\'t match'))
            }
            const hash=bcrypt.hashSync(newpass,+process.env.SALT_ROUNDS)
                const Updateuser = await UserModel.findOneAndUpdate({email:decodeddata.email},{code:null,password:hash,ChangePassAt:Date.now()},{new:true})
                res.status(200).json({ message: 'Done' })
            }
//QRCODDE
export const GetQR = async (req,res,next)=>
        {
            const{_id}=req.authUser
            const user = await UserModel.findById(_id,'username')
            if(!user){
                res.status(400).json({ message: 'invalid_user Credentials', user })
            }
            const qrcode= await generateQRcode({data:user})
            res.status(200).json({ message: 'Done', qrcode })
        }

        //signin
        export const login = async (req,res,next)=>{

            const {email,password}=req.body
            const userExist = await UserModel.findOneAndUpdate({email:email.toLowerCase()},{isOnline:true,isDeleted:false})
            if(!userExist)
            {
                return res.status(400).json({Message:'invalid-User Credentials'})
            }
            if(userExist.isConfirmed ==false)
            {
                return res.status(400).json({Message:'Email not confirmed yet'})
            }
            const MatchPass = bcrypt.compareSync(password,userExist.password)
            if(!MatchPass)
            {
                return res.status(400).json({Message:'invalid-User Credentials'})
            }
            const usertoken=generateToken({
                payload:{name:userExist.username,id:userExist._id,isLoggedin:true},
                signature:process.env.SIGNATURE,
                expiresIn:'1D',
            })
            if(!usertoken){
                return next(
                    new Error('token generation failed,payload cannot be empty',{cause :400})
                )
            }
            //const usertoken = Jwt.sign({name:userExist.username,id:userExist._id,isLoggedin:true},process.env.SIGN_IN_TOKEN_SECRET,{expiresIn:20})
            userExist.token=usertoken
            await userExist.save()
            res.status(200).json({ message: 'successfully logged-IN',usertoken })
    
        
    }
    