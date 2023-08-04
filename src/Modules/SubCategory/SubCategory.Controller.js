//Create SubCategory

import slugify from "slugify"
import { CategoryModel } from "../../../DB/Models/Category.model.js"

import { SubCategoryModel } from "../../../DB/Models/SubCategory.model.js"
import { customAlphabet } from "nanoid"
import cloudinary from "../../utils/CloudinaryConfig.js"

const nanoid = customAlphabet('abcdefghijklmnop123456789',4)

export const CreateSubCategory = async(req,res,next)=>{
const {Categoryid}=req.params
const {name}= req.body

if(!(await CategoryModel.findById(Categoryid)))
{
    return next (new Error('invalid CategoryId',{cause:400}))
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

const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.Project_Folder}/SubCategories/${customId}`
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