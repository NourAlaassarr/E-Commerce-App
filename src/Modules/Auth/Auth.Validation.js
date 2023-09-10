import Joi from "joi"
import{ generalFields }from'../../Middleware/Validation.js'
export const SignUp={
body:Joi.object({
    userName:Joi.string().min(3).max(15).messages({'any.required': 'userName is required',
}).required(),
        phone:Joi.number().min(11),
        email:generalFields.email,
        Cpassword:Joi.valid(Joi.ref('Password')).required(),
        Password:generalFields.password,
        gender:Joi.string().optional(),
        Age:Joi.number(),
        Address:Joi.string().min(10).max(255).required()
}).options({allowUnknown:true})
}
export const ConfirmSchema={
    params:Joi.object({
        token:Joi.string().required()
    }).options({allowUnknown:true})
}
export const SignINschema={
    body:Joi.object({
        email:generalFields.email
        , Password:generalFields.password
    })

}
export const ForgetPasswordScehma={
    body:Joi.object({
        email:generalFields.email})
}
export const resetSchema={
body:Joi.object({
    NewPassword:generalFields.password
}).required()
    
}
export const ChangePasswordSchema={
    body:Joi.object({
        oldPassword:generalFields.password,
        NewPassword:generalFields.password,
        ConfirmNewPassword:generalFields.password,
    }).required(),
    headers:Joi.object({
        token:Joi.string().required()
    }).options({allowUnknown:true})
}
export const loginWithGmailSchema={
body:Joi.object({
idToken:Joi.string().required()
    })
}
