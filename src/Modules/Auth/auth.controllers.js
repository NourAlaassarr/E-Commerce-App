import { UserModel } from '../../../DB/Models/user.model.js'
import { VerifyToken, generateToken } from '../../utils/TokenFunction.js'
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import pkg, { compare, compareSync, hashSync } from 'bcrypt'
import { nanoid } from 'nanoid'

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken library
import { SystemRules } from '../../utils/SystemRules.js'
// Sign Up//
export const SignUp = async (req, res, next) => {
    const {
        userName,
        phone,
        email,
        Cpassword,
        Password,
        gender,
        Age,
        Address
    } = req.body

    const IsEmailExsits = await UserModel.findOne({ email })
    if (IsEmailExsits) {
        return next(new Error('Email is Already Exsit', { cause: 400 }))
    }

    if (Password != Cpassword) {
        return next(new Error('Password doesn\'t match', { cause: 400 }))
    }

    //HashPass i used the Hooks
    // const hashedPass= pkg.hashSync(Password,+process.env.SALT_ROUNDS)
    const token = generateToken({
        payload: {
            email,
        },
        signature: process.env.CONFIRMATION_EMAIL_TOKEN,
        expiresIn: '1h'
    })

    const ConfirmLink = `${req.protocol}://${req.headers.host}/auth/confirm/${token}`
    const isEmailSent = sendmailService({
        to: email,
        subject: 'Confirmation Email',
        message: emailTemplate({
            link: ConfirmLink,
            linkData: 'Click here to Confirm',
            subject: 'Confirmation Email'
        })
        // `<a href=${ConfirmLink}>Click here to Confirm </a>`,
    })
    if (!isEmailSent) {
        return next(new Error('Failed to send Confirmation Email', { cause: 400 }))
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
    res.status(201).json({ Message: 'Done', savedUser })
}

export const Confirm = async (req, res, next) => {
    const { token } = req.params
    const decoded = VerifyToken({ token, signature: process.env.CONFIRMATION_EMAIL_TOKEN })
    const User = await UserModel.findOne({ email: decoded.email, isConfirmed: false }, {
        isConfirmed: true,
    },
        {
            new: true,
        })
    if (!User) {
        return next(new Error('Already Confirmed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Successfully confirmed,Try to log in' })
}

//Sign IN 
export const SignIN = async (req, res, next) => {
    const { email, Password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const IsPasswordMatch = pkg.compareSync(Password, user.Password)
    if (!IsPasswordMatch) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const token = generateToken({
        payload: {
            email,
            _id: user._id,
            role: user.role
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn: '1h',
    })

    const userUpdated = await UserModel.findOneAndUpdate({ email }, {
        token,
        status: 'Online',
    }, { new: true })
    res.status(200).json({ Message: "successfully Logged IN", userUpdated })
}

//ForgetPassword
export const ForgetPassword = async (req, res, next) => {
    const { email } = req.body
    const EmailCheck = await UserModel.findOne({ email })
    if (!EmailCheck) {
        return next(new Error('invalid Email', { cause: 400 }))
    }
    const Code = nanoid()
    const hashedCode = pkg.hashSync(Code, +process.env.SALT_ROUNDS)

    const token = generateToken({
        payload: {
            email,
            sentCode: hashedCode,
        },
        signature: process.env.RESET_PASS_TOKEN,
        expiresIn: '1h',
    })

    const ResetPasswordLink = `${req.protocol}://${req.headers.host}/auth/reset/${token}`
    const isEmailSent = sendmailService({
        to: email,
        subject: 'Reset Password',
        message: emailTemplate({
            link: ResetPasswordLink,
            linkData: 'Click here to Reset Password',
            subject: 'Reset Password'
        })
    })
    if (!isEmailSent) {
        return next(new Error('Failed to send Reset Password Email', { cause: 400 }))
    }
    const UserUpdate = await UserModel.findOneAndUpdate({ email, },
        {
            Code: hashedCode
        }, {
        new: true
    })
    res.status(200).json({ Message: 'Done', UserUpdate, ResetPasswordLink })
}



//ReseetPassword
export const reset = async (req, res, next) => {
    const { token } = req.params
    const { NewPassword } = req.body
    const decoded = VerifyToken({ token, signature: process.env.RESET_PASS_TOKEN })
    const user = await UserModel.findOne({
        email: decoded?.email,
        Code: decoded?.sentCode
    })
    if (!user) {
        return next(new Error('you already rest your password, try to login', { cause: 400 }))
    }
    user.Password = NewPassword
    user.Code = null
    user.ChangePassAt = Date.now()
    const ResetPassword = await user.save()
    res.status(200).json({ Message: 'Done', ResetPassword })
}

//changePassword
export const ChangePassword=async(req,res,next)=>{
    const {oldPassword, NewPassword,ConfirmNewPassword } = req.body
    const userId = req.authUser._id
    const user=await UserModel.findById({_id:userId})
    const oldpass=compareSync(oldPassword,user.Password)
    if(!oldpass){
        return next(new Error('incorrect password', { cause: 400 }))
    }
    if (NewPassword != ConfirmNewPassword) {
        return next(new Error('Password doesn\'t match', { cause: 400 }))
    }

    const newpass=hashSync(NewPassword,+process.env.SALT_ROUNDS)
    
    const updatedPass = await UserModel.findOneAndUpdate({_id:userId},
        {Password:newpass,
        Cpassword:newpass},{
            new:true
        })
    

    res.status(200).json({ Message: 'Done' ,updatedPass})
}

//login withgmail
export const loginWithGmail = async (req, res, next) => {
    const client = new OAuth2Client()
    const { idToken } = req.body
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        })
        const payload = ticket.getPayload()
        // return payload
    }
    const { email_verified, email, name } = await verify()
        if (!email_verified) {
        return next(new Error('invalid email', { cause: 400 }))
    }
    const user = await UserModel.findOne({ email, provider: 'GOOGLE' })
    //login
    if (user) {
        const token = generateToken({
            payload: {
                email,
                _id: user._id,
                role: user.role,
            },
            signature: process.env.SIGN_IN_TOKEN_SECRET,
            expiresIn: '1h',
        })

        const userUpdated = await UserModel.findOneAndUpdate(
            { email },
            {
                token,
                status: 'Online',
            },
            {
                new: true,
            },
        )
        return res.status(200).json({ messge: 'Login done', userUpdated, token })
    }

    // signUp
    const userObject = {
        userName: name,
        email,
        Password: nanoid(6),
        provider: 'GOOGLE',
        isConfirmed: true,
        phone: ' ',
        role: SystemRules.User,
    }
    const newUser = await UserModel.create(userObject)
    const token = generateToken({
        payload: {
            email: newUser.email,
            _id: newUser._id,
            role: newUser.role,
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn: '1h',
    })
    newUser.token = token
    newUser.status = 'Online'
    await newUser.save()
    res.status(200).json({ message: 'Verified', newUser })

}