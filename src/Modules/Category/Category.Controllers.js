import slugify from 'slugify'
import cloudinary from '../../utils/CloudinaryConfig.js'
import {CategoryModel}from'../../../DB/Models/Category.model.js'
import { customAlphabet } from 'nanoid'
import { SubCategoryModel } from '../../../DB/Models/SubCategory.model.js'
import { BrandModel } from '../../../DB/Models/Brand.model.js'
const nanoid = customAlphabet('abcdef1234',4)


//Create Category
export const createCategory = async (req, res, next) => {
    const { name } = req.body
    const slug = slugify(name, '_')

    if (await CategoryModel.findOne({ name })) {
    return next(
        new Error('please enter different category name', { cause: 400 }),
    )
    }

    if (!req.file) {
    return next(new Error('please upload a category Img', { cause: 400 }))
    }

    
    const customId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${customId}`,
    },
    )
    const categoryObject = {
    name,
    slug,
    Image: {
        secure_url,
        public_id,
    },
    CustomId:customId,
    }

    const category = await CategoryModel.create(categoryObject)
    if (!category) {
    await cloudinary.uploader.destroy(public_id)
    return next(
        new Error('try again later , failed to add your category', { cause: 400 }),
    )
    }

    res.status(201).json({ message: 'Successfully Added', category })
}




//Update Category
export const UpdateCategory = async(req,res,next)=>{
    const {CategoryId}=req.params
    const {name}=req.body
    const Category = await CategoryModel.findById({CategoryId})
    if(!Category)
    {
        return next(new Error ('Invalid Category Id', {cause:400}))
    }
    if(name){
    if(Category.name==name.tolowercase())
    {
        return next(
            new Error('please enter different name from the old category name', {
            cause: 400,
            }),
        )
    }
    if (await CategoryModel.findOne({ name })) {
        return next(
            new Error('please enter different category name', { cause: 400 }),
        )
        }
        Category.name=name
        Category.slug=slugify(name,'_')
}
if(req.file)
{
    await cloudinary.uploader.destroy(Category.Image.public_id)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${Category.CustomId}`,
        },
    )
    Category.Image={secure_url,public_id}
}
await Category.save()
res.status(200).json({ message: ' Successfully Updated', Category })
}





//Delete Category
export const DeleteCategory = async(req,res,next)=>{
const {CategoryID}=req.query
const CategoryExist = await CategoryModel.findByIdAndDelete(CategoryID)
if(!CategoryExist)
{
    return next(new Error('Invalid Category Id',{cause:400}))
}
await cloudinary.api.delete_resources_by_prefix(`${process.env.PROJECT_FOLDER}/Categories/${CategoryExist.CustomId}`)
await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Categories/${CategoryExist.CustomId}`)
// await cloudinary.uploader.destroy(CategoryExist.Image.public_id)
const deleteSub = await SubCategoryModel.deleteMany({
    CategoryID,
})
const deleteBrand = await BrandModel.deleteMany({
    CategoryID,
})
if(!deleteBrand.deletedCount ||
    !deleteSub.deletedCount)
    {
        return next(new Error('Deletion Failed ',{cause:400}))
    }
    res.status(200).json({ message: 'Done'})

}


export const getAllCategories = async (req, res, next) => {
    const Categories = await CategoryModel.find().populate({
        path:'SubCategories',
        select:'name',
        populate:[{
            path:'Brands',
            select:'name'
    }]
    },
    )
    res.status(200).json({ message: 'Done', Categories })

    // let categoryArr = []
    // //======================================== normal for loop ======================================
    // for (const category of Categories) {
    // const subCategories = await SubCategoryModel.find({
    //     categoryId: category._id,
    // })
    // const objectCat = category.toObject()
    // objectCat.subCategories = subCategories
    // categoryArr.push(objectCat)
    // }
    //const cursor = Categories.cursor()
    //   for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    //     const subCategories = await subCategoryModel.find({
    //       categoryId: doc._id,
    //     })
    //     const objectCat = doc.toObject()
    //     objectCat.subCategories = subCategories
    //     categoryArr.push(objectCat)
    // res.status(200).json({ message: 'Done', Categories: categoryArr })
}