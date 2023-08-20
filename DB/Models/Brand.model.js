import { Schema,model } from "mongoose";

const BrandSchema = new Schema({

    name:{
        type:String,
        required:true,
        lowercase:true
    },
    slug:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    Logo:{
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
        ref:'User',
        required:false, // TODO CONVERT TO TRUE AFTER CREATING USERMODEL
    },
    SubCategoryID:{
        type:Schema.ObjectId,
        required:true,
        ref:'SubCategory',
    },
    CategoryID:{
        type:Schema.ObjectId,
        required:true,
        ref:'Category',
    },
    CustomId:String,
    
},{
    timestamps:true
})

export const BrandModel =model('Brand',BrandSchema)