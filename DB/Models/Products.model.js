
import { Schema,model } from "mongoose";

const ProductSchema = new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true

    },
    description:String,
    slug:{
        type:String,
        required:true,
        lowercase:true
    },
colors:[String],
Sizes:[String],
price:{
    type:Number,
    required:true,
    default:1,
},
AppliedDiscount:{
    type:Number,
    default:0,
},
PriceAfterDiscount:{
    type:Number,
    default:0,
},
stock:{
    type:Number,
    default:0,
    required:true
},
createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, // TODO: convert into true after creating usermodel
},
updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
},
deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
},
CategoryId:{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
},
SubCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
},
BrandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
},
Images: [
    {
    secure_url: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    },
],
CustomID:String,

},
{timestamps:true})


export const ProductModel=model('Product',ProductSchema)