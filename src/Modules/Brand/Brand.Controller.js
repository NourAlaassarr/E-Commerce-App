import slugify from 'slugify'
import { BrandModel } from '../../../DB/Models/Brand.model.js'
import { CategoryModel } from '../../../DB/Models/Category.model.js'
import { SubCategoryModel } from '../../../DB/Models/SubCategory.model.js'
import cloudinary from '../../utils/CloudinaryConfig.js'

import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('abcdef1234',4)


export const AddBrand = async (req,res,next)=>{
const{name}=req.body
const{_id}=req.authUser
const{subCategoryId,Categoryid}=req.query
const SubCategoryExists = await SubCategoryModel.findById(subCategoryId)
const Categoryidexist = await CategoryModel.findById(Categoryid)
if(!SubCategoryExists ||! Categoryidexist)
{
    return next(new Error('invalid Categories',{cause:400}))
}
const slug = slugify(name,{
    replacement:'_',
    lower:true,
})
if(!req.file){
    return next(new Error('please upload your logo',{cause:400}))
}
const customId = nanoid()
const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.PROJECT_FOLDER}/Categories/${Categoryidexist.CustomId}/SubCategories/${SubCategoryExists.CustomId}/Brands/${customId}`,
})
const BrandOb={
    name,
    slug,
    Logo:{
        secure_url,
        public_id,
},
SubCategoryID:subCategoryId,
CategoryID:Categoryid,
CustomId:customId,
createdBy:_id
}
const DBbrand= await BrandModel.create(BrandOb)
if(!DBbrand)
{
    await cloudinary.uploader.destroy(public_id)
    return next(new Error('try again later',{cause:400}))
}
res.status(201).json({Message:'successfully Created',DBbrand})
}
//ToDo delete Brand