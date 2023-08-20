
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
        ref: 'User',
        required: false, // TODO: convert into true after creating usermodel
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    couponAssginedToUsers: [
        {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        maxUsage: {
            type: Number,
            required: true,
            default: 1,
        },
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