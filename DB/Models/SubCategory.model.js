import { Schema,model } from "mongoose";

const SubCategorySchema = new Schema({

    name:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    slug:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    Image:{
        secure_url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    createdBy:{
        type:Schema.ObjectId,
        ref:'user',
        required:true, 
    },
    CategoryID:{
        type:Schema.ObjectId,
        required:true,
        ref:'Category',
    },
    CustomId:String,
},{
    timestamps:true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } ,
})
SubCategorySchema.virtual('Brands',{
    foreignField:'SubCategoryID',
    localField:'_id',
    ref:'Brand'



})

export const SubCategoryModel =model('SubCategory',SubCategorySchema)