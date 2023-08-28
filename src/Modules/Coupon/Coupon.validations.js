
import Joi from "joi"
import { generalFields } from "../../Middleware/Validation.js"

export const AddCouponSchema={
body:Joi.object({
    couponCode:Joi.string().min(5).max(55).required(),
        couponAmount:Joi.number().positive().min(1).max(100).required(),
        fromDate:Joi.date().greater(Date.now()-(24*60*60*1000)).required(),
        toDate:Joi.date().greater(Joi.ref('fromDate')).required(),
        isPercentage:Joi.boolean().optional(),
        isFixedAmount:Joi.boolean().optional(),
        couponAssginedToUsers:Joi.array().items().required(),
}).required(),
headers:Joi.object({
    token:Joi.string().required()
}).options({allowUnknown:true})
}

export const DeleteCouponSchema={
    query:Joi.object({
        _id:generalFields._id.required(),

    })
}