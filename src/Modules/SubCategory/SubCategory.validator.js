import Joi from "joi"

export const CreateSubCategorySchema={
body:Joi.object({
    name:Joi.string().max(10).min(5)
}).required().options({presence:'required'})
}