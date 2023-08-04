import slugify from "slugify"
import { BrandModel } from "../../../DB/Models/Brand.model.js"
import { CategoryModel } from "../../../DB/Models/Category.model.js"
import { SubCategoryModel } from "../../../DB/Models/SubCategory.model.js"
import cloudinary from "../../utils/CloudinaryConfig.js"
import { customAlphabet } from "nanoid"
import { ProductModel } from "../../../DB/Models/Products.model.js"
const nanoid = customAlphabet('abcdef12345',4)
//add Product
export const AddProduct = async (req,res,next)=>{
    const {
        name,
        price,
        description,
        appliedDiscount,
        colors,
        size,
        stock,
        PriceAfterDiscount,
}= req.body

const {CategoryId,SubCategoryId,BrandId}=req.query
const SubCategoryExist = await SubCategoryModel.findById(SubCategoryId)
const categoryExist = await CategoryModel.findById(CategoryId)
const BrandExist = await BrandModel.findById(BrandId)

if(!SubCategoryExist || !categoryExist || !BrandExist)
{
    return next(new Error('invalid Category Id',{cause:400}))
}
const slug = slugify(name,{
    replacement:'_'
})
if(appliedDiscount)
{
    const PriceAfterDiscount=price - price * ((appliedDiscount || 0) / 100)}
const customId=nanoid()
if(!req.files)
{
    return next(new Error('Please Upload Pictures',{cause:400}))
}
const Images = []
const publicIds = []
for(const file of req.files)
{
    const{secure_url, public_id}=await cloudinary.uploader.upload(file.path,{
        folder:`${process.env.PROJECT_FOLDER}/Categories/${categoryExist.CustomId}/SubCategories/${SubCategoryExist.CustomId}/Brands/${BrandExist.CustomId}/Products/${customId}`,
    })
    Images.push({secure_url,public_id})
    publicIds.push(public_id)
}
const ProductOB={
    name,
    slug,
    price,
    description,
    AppliedDiscount:appliedDiscount,
    colors,
    Sizes:size,
    stock,
    Images,
    CustomID:customId,
    CategoryId,
    SubCategoryId,
    BrandId,
    PriceAfterDiscount,

}
const product = await ProductModel.create(ProductOB)
if (!product) {
    await cloudinary.api.delete_resources(publicIds)
    return next(new Error('Try again later', { cause: 400 }))
}
res.status(200).json({ message: 'Done', product })
}