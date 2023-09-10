//Create SubCategory

import slugify from "slugify"
import { CategoryModel } from "../../../DB/Models/Category.model.js"

import { SubCategoryModel } from "../../../DB/Models/SubCategory.model.js"
import { customAlphabet } from "nanoid"
import cloudinary from "../../utils/CloudinaryConfig.js"
import { BrandModel } from "../../../DB/Models/Brand.model.js"
import { ProductModel } from "../../../DB/Models/Products.model.js"

const nanoid = customAlphabet('abcdefghijklmnop123456789',4)

export const CreateSubCategory = async(req,res,next)=>{
const { Categoryid } = req.query;
const {name}= req.body
const {_id}=req.authUser

const Category= await CategoryModel.findById({_id:Categoryid})
// console.log(Categoryid)
// console.log(Category)
if(!Category)
{
    return next (new Error('invalid CategoryIdd',{cause:400}))
}
if((await SubCategoryModel.findOne({name})))
{
    return next (new Error('Name already exsits',{cause:400}))
}
const slug = slugify(name,'_')
if(!req.file)
{
    return next (new Error('Please Upload a Subcategory img',{cause:400}))
}
const customId= nanoid()
console.log(Category.CustomId)
const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.PROJECT_FOLDER}/Categories/${Category.CustomId}/SubCategories/${customId}`
})

const SubCategoriesObject ={
    name,
    slug,
    CustomId:customId,
    CategoryID: Categoryid,
    Image:{
        secure_url,
        public_id,
    },
    createdBy:_id,
}
const SubCategory =  await SubCategoryModel.create(SubCategoriesObject)
if(!SubCategory)
{
    await cloudinary.uploader.destroy(public_id)
    return next(new Error('try again later , failed to add your SubCategory', { cause: 400 }))
}
res.status(200).json({Message:'Added successfully',SubCategory})
}

//get all subCategories with category Data
export const GetAllSubCategories = async(req,res,next)=>{
    const SubCategories=await SubCategoryModel.find().populate({
        path:'CategoryID',
        select:'slug',
    })
    res.status(200).json({Message:'Done',SubCategories})
}




//delete subcategory
export const Delete=async (req,res,next)=>{
const { Categoryid ,SubCategoryId,}=req.query

const Category= await CategoryModel.findById({_id:Categoryid})

if(!Category)
{
    return next (new Error('invalid CategoryIdd',{cause:400}))
}
const SubExist= await SubCategoryModel.findOneAndDelete({_id:SubCategoryId})
if(!SubExist){
    return next(new Error('Invalid SUBCategory ', { cause: 400 }))
}
// Delete resources within the folder
await cloudinary.api.delete_resources_by_prefix(`${process.env.Project_Folder}/Categories/${Category.CustomId}/SubCategories/${SubExist.CustomId}`);

// Then, delete the folder
await cloudinary.api.delete_folder(`${process.env.Project_Folder}/Categories/${Category.CustomId}/SubCategories/${SubExist.CustomId}`);



const DeleteBrand = await BrandModel.deleteMany({
    SubCategoryID:SubCategoryId,
})
const DeleteProduct=await ProductModel.deleteMany({
    SubCategoryId:SubCategoryId
})
if(!DeleteBrand.deletedCount)
{
    return next(new Error('Deletion Failed ',{cause:400}))
} 
if(!DeleteProduct.deletedCount )
{
    return next(new Error('Deletion Failed ',{cause:400}))
}


res.status(200).json({ messsage: 'Deleted Done' })
}