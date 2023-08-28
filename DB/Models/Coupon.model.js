
import { Schema,model } from "mongoose";

const CouponSchema = new Schema({
    couponCode:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    couponAmount:{
        type:Number,
        required:true,
        min:1,
        max:100,
        default:1,
    },
    isPercentage:{
        type: Boolean,
    required: true,
    default: false,
    },
    isFixedAmount: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true, 
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    couponAssginedToUsers: [
        {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required:true
        },
        maxUsage: {
            type: Number,
            required: true,
            default: 1,
        },
        usageCount:{
            type:Number,
            default:0,
        }
        },
    ],
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    CouponStatus: {
        type: String,
        required: true,
        enum: ['Expired', 'Valid'],
        default: 'Valid',
    },
    },
    {
    timestamps: true,
    })
export const CopounModel= model('Coupon',CouponSchema)