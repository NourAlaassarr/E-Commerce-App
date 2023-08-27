import Joi from 'joi'
import joi from 'joi'
import { Types } from 'mongoose'
const reqMethods = ['body','query','headers','file','files',"params"]

// const objectId = (value, helpers) => {
//     if (!value.match(/^[0-9a-fA-F]{24}$/)) {
//     return helpers.error('any.invalid');
//     }
//     return value;
// }
const objectId = (value, helpers) => {
    return Types.ObjectId.isValid(value)?true:helpers.message('invalid id')
}

export const generalFields={
    email: joi
    .string()
    .email({ tlds: { allow: ['com', 'net', 'org'] } })
    .required(),
    password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
    'string.pattern.base': 'Password regex fail',
    })
    .required(),
_id:Joi.string().custom(objectId)
}
export const ValidationCoreFunction =(schema)=>{
    return(req,res,next)=>{
        const ValidationErrArray=[]
        for(const key of reqMethods){
            if(schema[key])
            {
                const ValidateResults = schema[key].validate(req[key],{
                    abortEarly:false,
                })
                if(ValidateResults.error)
                {
                    ValidationErrArray.push(ValidateResults.error.details)
                }
            }
        }

        if (ValidationErrArray.length) {
            // return res
            // .status(400)
            // .json({ message: 'Validation Error', Errors: ValidationErrArray })
            req.ValidationErrArray=ValidationErrArray
            return next(new Error('',{cause:400}))  
        }
    
        next()
        } 
    
}