import Joi from "joi"
import{ generalFields } from "../../Middleware/Validation.js"

export const CreateOrderschema={
    body:Joi.object({
        ProductId:generalFields._id.required(),
        quantity:Joi.number().min(1).required(),
        couponCode:Joi.string().optional(),
        Address:Joi.string().min(10).max(255).optional(),
        PhoneNumber:Joi.string().min(11).max(11).required(),
        PaymentMethod:Joi.string().required()
    }),

    headers:Joi.object({
        token:Joi.string().required()
    }).options({allowUnknown:true})
}
export const successPayamentSchema={
    query:Joi.object({
        token:Joi.string().required()
    }).options({allowUnknown:true})
}
export const CancelPaymentSchema={
query:Joi.object({
    token:Joi.string().required()
}).options({allowUnknown:true})
}
export const FromCartToOrderSchema={
    body:Joi.object({
        couponCode:Joi.string().optional(),
        Address:Joi.string().min(10).max(255).optional(),
        PhoneNumber:Joi.string().min(11).max(11).required(),
        PaymentMethod:Joi.string().required()
    }),
query:Joi.object({
    cartId:generalFields._id.required()
}),
headers:Joi.object({
    token:Joi.string().required()
}).options({allowUnknown:true})
}
export const DeliverOrdrSchema={
query:Joi.object({
    orderId:generalFields._id.required})
}
