import Joi from "joi"

export const UpdateCategorySchema ={
body:Joi.object({
    name:Joi.string().max(10).min(5).optional(),
}).required(),
}
export const CreateCategorySchema={
body:Joi.object({
    name:Joi.string().max(10).min(5)
}).required().options({presence:'required'})
}