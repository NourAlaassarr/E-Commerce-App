import slugify from 'slugify'
import { BrandModel } from '../../../DB/Models/Brand.model.js'
import { CategoryModel } from '../../../DB/Models/Category.model.js'
import { SubCategoryModel } from '../../../DB/Models/SubCategory.model.js'
import cloudinary from '../../utils/CloudinaryConfig.js'

import { customAlphabet } from 'nanoid'
import { ProductModel } from '../../../DB/Models/Products.model.js'
import { SystemRules } from '../../utils/SystemRules.js'
const nanoid = customAlphabet('abcdef1234',4)

//Add Brand
export const AddBrand = async (req,res,next)=>{
const{name}=req.body
const{_id}=req.authUser
const{subCategoryId,Categoryid}=req.query
const SubCategoryExists = await SubCategoryModel.findById(subCategoryId)
const Categoryidexist = await CategoryModel.findById(Categoryid)

if(!SubCategoryExists ||!Categoryidexist)
{
    return next(new Error('invalid Categories',{cause:400}))
}
//slug
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

//delete brand (admin and owner only )
export const Delete=async (req,res,next)=>{
    const { Categoryid ,SubCategoryId,BrandId}=req.query
    const userId=req.authUser._id
    const Category= await CategoryModel.findById({_id:Categoryid})
    
    if(!Category)
    {
        return next (new Error('invalid CategoryId',{cause:400}))
    }
    const SubCategory= await SubCategoryModel.findById({_id:SubCategoryId})
    if(!Category)
    {
        return next (new Error('invalid SubCategoryId',{cause:400}))
    }
    const BrandExist= await BrandModel.findOneAndDelete({_id:BrandId})
    if(!BrandExist){
        return next(new Error('Invalid BrandId ', { cause: 400 }))
    }
    if(req.authUser.role == SystemRules.Admin || BrandExist.createdBy.toString()==userId.toString()){

    
    
    // Delete resources within the folder
    await cloudinary.api.delete_resources_by_prefix(`${process.env.Project_Folder}/Categories/${Category.CustomId}/SubCategories/${SubCategory.CustomId}/Brands/${BrandExist.CustomId}`);
    
    // Then, delete the folder
    await cloudinary.api.delete_folder(`${process.env.Project_Folder}/Categories/${Category.CustomId}/SubCategories/${SubCategory.CustomId}/Brands/${BrandExist.CustomId}`);
    
    
    
    const DeleteBrand = await ProductModel.deleteMany({
        BrandId:BrandId,
    })
    
    if(!DeleteProduct.deletedCount )
    {
        return next(new Error('Deletion Failed ',{cause:400}))
    }
    
    res.status(200).json({ messsage: 'Deleted Done' })
    }
    return next(new Error('You are not authorized',{cause:400}))
}

//get sepcific brand

export const GetByname= async(req,res,next)=>{
    const {name}=req.body
    const Brands=await BrandModel.find({name})
      .populate('Products') 
      res.status(200).json({ message: 'Done', Brands })
    }


//Update Brand (owner, Admin)
export const UpdateBrand=async(req,res,next)=>{
        const {BrandId,Categoryid,SubCategoryId}=req.query
        const {name}=req.body
        const userId =req.authUser._id
        const Category= await CategoryModel.findById({_id:Categoryid})
    
        if(!Category)
        {
            return next (new Error('invalid CategoryId',{cause:400}))
        }
        const SubCategory= await SubCategoryModel.findById({_id:SubCategoryId})
        if(!Category)
        {
            return next (new Error('invalid SubCategoryId',{cause:400}))
        }
        const Brand = await BrandModel.findOne({_id:BrandId,createdBy:userId})
        if(!Brand)
        {
            return next(new Error ('Invalid Brand Id', {cause:400}))
        }
        if(req.authUser.role==SystemRules.Admin || Brand.createdBy.toString()==userId.toString() )
        {
            if (name) {
                // different from old name
                if (Brand.name == name.toLowerCase()) {
                    return next(
                    new Error('please enter different name from the old Brand name', {cause: 400,}),
                )
                }
            if (await BrandModel.findOne({ name })) {
                return next(
                    new Error('please enter different brand name', { cause: 400 }),
                )
                }
                Brand.name=name
        }
        if(req.file)
        {
            await cloudinary.uploader.destroy(Brand.Logo.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: `${process.env.PROJECT_FOLDER}/Categories/${Category.CustomId}/SubCategories/${SubCategory.CustomId}/Brands/${BrandExist.CustomId}`,
                },
            )
            Brand.Logo={secure_url,public_id}
        }
        Brand.updatedBy=userId
        await Brand.save()
        res.status(200).json({ message: 'Successfully Updated', Brand })
        }
        return next(
            new Error('You are not authorized for this action', { cause: 400 }),
        )
    }


