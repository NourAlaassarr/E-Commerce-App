import Joi from "joi"
import { generalFields } from "../../Middleware/Validation.js"

export const UpdateCategorySchema ={
body:Joi.object({
    name:Joi.string().max(10).min(5).optional(),
}).required(),
params:Joi.object({
    CategoryId:generalFields._id
}),
headers:Joi.object({
    token:Joi.string().required()
}).options({allowUnknown:true})
}
export const CreateCategorySchema={
body:Joi.object({
    name:Joi.string().max(10).min(5)
}).required().options({presence:'required'}),
headers:Joi.object({
    token:Joi.string().required()
}).options({allowUnknown:true})

}
export const CreateCategorySchemaQl=Joi.object({
    name:Joi.string().min(4).max(55).required(),
}).required()