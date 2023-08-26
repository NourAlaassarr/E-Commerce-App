import { Schema,model } from "mongoose";

const CategorySchema = new Schema({

    name:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    slug:{
        type:String,
        unique: true,
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
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    CustomId:String
},{
    timestamps:true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } ,
})

CategorySchema.virtual('SubCategories',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'CategoryID'
})

export const CategoryModel =model('Category',CategorySchema)