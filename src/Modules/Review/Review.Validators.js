import Joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const AddreviewSchema={
    body:Joi.object({
        ReviewRate:Joi.number().min(1).max(5).required(),
        ReviewComment:Joi.string().min(5).max(255).optional()
    }),
    query:Joi.object({
        ProductId:generalFields._id.required()
    })
}