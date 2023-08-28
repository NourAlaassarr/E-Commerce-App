import { Schema,model } from "mongoose";
import { schedule } from "node-cron";

const Orderschema = new Schema({
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
                default:1
            },
            name:{
                type:String,
                required:true,
            },
            price:{
                type:Number,
                required:true,

            },
            finalPrice:{
                type:Number,
                required:true,
            },
        },
],
subTotal:{
    type:Number,
    required:true,
    default:0,
},
CouponId:{
    type:Schema.ObjectId,
    ref:'Coupon',
},
paidAmount:{
    type:Number,
    required:true,
    default:0,
},
Address:{
    type:String,
    required:true,
},
PhoneNumber:[{
type:String,
required:true,
}],
OrderStatus:{
    type:String,
    enum:['Delivered','Pending','Confirmed','placed','Preparation','canceled','on way'],
},
PaymentMethod:{
    type:String,
    required:true,
    enum:['Cash','Card']
},
UpdatedBy:{
    type:Schema.ObjectId,
        ref:'user',
},
CanceledBy:{
    type:Schema.ObjectId,
        ref:'user',
},
reason:String,

},{timestamps:true})



export const OrderModel =model('order',Orderschema) 