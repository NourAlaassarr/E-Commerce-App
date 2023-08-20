import Joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";
export const AddProduct ={
    body:Joi.object({
        name:Joi.string().min(5).max(55).required(),
        price:Joi.number().positive().required(),
        description:Joi.string().max(255).optional(),
        appliedDiscount:Joi.number().positive().min(1).max(100).ptional(),
        colors:Joi.array().items(Joi.string().required()).optional(),
        size:Joi.array().items(Joi.string().required()).optional(),
        stock:Joi.number().integer().positive().min(1).required(),
    }),
    query:Joi.object({
        CategoryId:generalFields._id,
        SubCategoryId:generalFields._id,
        BrandId:generalFields._id,

    }).required().options({presence:'required'})

}
export const UpdateProduct ={
    body:Joi.object({
        name:Joi.string().min(5).max(55).required(),
        price:Joi.number().positive().required(),
        description:Joi.string().max(255).optional(),
        appliedDiscount:Joi.number().positive().min(1).max(100).optional(),
        colors:Joi.array().items(Joi.string().required()).optional(),
        size:Joi.array().items(Joi.string().required()).optional(),
        stock:Joi.number().integer().positive().min(1).required(),
        PriceAfterDiscount:Joi.number().positive().optional(),
    }),
    query:Joi.object({
        CategoryId:generalFields._id,
        SubCategoryId:generalFields._id,
        BrandId:generalFields._id,

    }).required().options({presence:'required'})

}