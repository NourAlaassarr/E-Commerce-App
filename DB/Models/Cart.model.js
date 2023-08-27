import { Schema,model } from "mongoose";
import { schedule } from "node-cron";

const CartSchema=new Schema({
    userId:{
        type:Schema.ObjectId,
        ref:'user',
        required:true,
    },
    products:[
        {
            ProductId:{
                type:Schema.ObjectId,
                ref:'Product',
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        }
    ],
    subTotal:{
        type:Number,
        required:true,
    },
},{timestamps:true})

export const CartModel = model('cart',CartSchema)