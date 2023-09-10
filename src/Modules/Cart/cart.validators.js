import Joi from "joi";
import { generalFields } from "../../Middleware/Validation.js"

export const AddSchema={
body: Joi.object({
    quantity:Joi.number().positive().default(1),
    ProductId:generalFields._id.required()
})
,headers:Joi.object({
    token:Joi.string().required()
}).options({allowUnknown:true})
}
export const deleteschema={
    body: Joi.object({
        quantity:Joi.number().positive().default(1),
        ProductId:generalFields._id.required()
    })
    ,headers:Joi.object({
        token:Joi.string().required()
    }).options({allowUnknown:true})
    }