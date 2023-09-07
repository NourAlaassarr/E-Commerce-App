import { Schema,model } from "mongoose";

const ReviewSchema = new Schema({
    userId:{
        type:Schema.ObjectId,
        ref:'user',
        required:true,
    },
    ProductId:{
        type:Schema.ObjectId,
        ref:'Product',
        required:true,
    },
    ReviewRate:{
        type:Number,
        default:0,
        require:true,
        min:1,
        max:5,
        enum:[1,2,3,4,5]
    },
    ReviewComment:{String},

},{
    timestamps:true,
})

export const ReviewModel =model('Review',ReviewSchema)