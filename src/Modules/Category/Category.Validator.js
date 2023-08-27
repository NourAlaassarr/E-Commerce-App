import Joi from "joi"
import { generalFields } from "../../Middleware/Validation.js"

export const UpdateCategorySchema ={
body:Joi.object({
    name:Joi.string().max(10).min(5).optional(),
}).required(),
params:Joi.object({
    CategoryId:generalFields._id
})
}
export const CreateCategorySchema={
body:Joi.object({
    name:Joi.string().max(10).min(5)
}).required().options({presence:'required'}),

}