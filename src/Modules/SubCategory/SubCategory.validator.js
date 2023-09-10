import Joi from "joi"
import { generalFields } from "../../Middleware/Validation.js"

export const CreateSubCategorySchema={
body:Joi.object({
    name:Joi.string().max(10).min(5)
}).required().options({presence:'required'}),
query:Joi.object({
    Categoryid:generalFields._id.required()
}),
headers:Joi.object({
    token:Joi.string().required()
}).options({allowUnknown:true})
}
export const deleteSchema={
    query:Joi.object({
        SubCategoryId:generalFields._id.required(),
        Categoryid:generalFields._id.required(),
    }),
}
