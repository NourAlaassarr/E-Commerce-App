import slugify from "slugify"
import { BrandModel } from "../../../DB/Models/Brand.model.js"
import { CategoryModel } from "../../../DB/Models/Category.model.js"
import { SubCategoryModel } from "../../../DB/Models/SubCategory.model.js"
import cloudinary from "../../utils/CloudinaryConfig.js"
import { customAlphabet } from "nanoid"
import { ProductModel } from "../../../DB/Models/Products.model.js"
import {paginationFunction} from '../../utils/pagination.js'
import { ApiFeature } from "../../utils/apiFeatures.js"
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
}= req.body
const UserId = req.authUser
const {CategoryId,SubCategoryId,BrandId}=req.query
const SubCategoryExist = await SubCategoryModel.findById(SubCategoryId)
if(!SubCategoryExist)
    {
        return next(new Error('invalid Subcategory',{cause:400}))
    }
const categoryExist = await CategoryModel.findById(CategoryId)
if(!categoryExist)
{
    return next(new Error('invalid Category',{cause:400}))
}
const BrandExist = await BrandModel.findById(BrandId);
// console.log('BrandExist:', BrandExist);
if (!BrandExist) {
    // console.log('Brand not found');
    return next(new Error('invalid Brand', { cause: 400 }));
}

const slug = slugify(name,{
    replacement:'_'
})
 const PriceAfterDiscount = price * (1 - (appliedDiscount || 0) / 100)


if(!req.files)
{
    return next(new Error('Please Upload Pictures',{cause:400}))
}
const customId=nanoid()
const Images = []
const publicIds = []

for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.CustomId}/SubCategories/${SubCategoryExist.CustomId}/Brands/${BrandExist.CustomId}/Products/${customId}`,
    },
    )
    Images.push({ secure_url, public_id })
    publicIds.push(public_id)
}
req.body.image=Images
req.body.customId=customId
// req.body.createdBy=req.authUser._id
req.imagePath=`${process.env.Project_Folder}/Categories/${categoryExist.CustomId}/subCategories/${SubCategoryExist.CustomId}/Brands/${BrandExist.CustomId}/Products/${customId}`
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
    createdBy:UserId,
}
const product = await ProductModel.create(ProductOB)
if (!product) {
    await cloudinary.api.delete_resources(publicIds)
    return next(new Error('Try again later', { cause: 400 }))
}
res.status(200).json({ message: 'Done', product })
}

//update product
export const UpdateProduct = async(req,res,next)=>
{
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
const UserId = req.authUser

const { productId,CategoryId,SubCategoryId,BrandId}=req.query
const finfproduct = await ProductModel.findOne({_id:productId,createdBy:UserId})
if(!finfproduct){
    return next(new Error('invalid product id',{cause:400}))
}
const product = await ProductModel.findById(productId)
if(!product){
    return next(new Error('invalid product id',{cause:400}))
}

// let SubCategoryExist;
const SubCategoryExist = await SubCategoryModel.findById(SubCategoryId || product.SubCategoryId)
if(SubCategoryId){

    if(!SubCategoryExist)
    {
        return next(new Error('invalid Subcategory',{cause:400}))
    }
    product.SubCategoryId=SubCategoryId
}
// let categoryExist;
const categoryExist = await CategoryModel.findById(CategoryId || product.CategoryId)
if(CategoryId){

if(!categoryExist)
{
    return next(new Error('invalid Category',{cause:400}))
}
product.CategoryId=CategoryId
}
// let BrandExist;
const BrandExist = await BrandModel.findById(BrandId||product.BrandId)
if(BrandId){

if(!BrandExist)
{
    return next(new Error('invalid Brand',{cause:400}))
}
product.BrandId=BrandId
}

if(appliedDiscount &&price)
{
    const PriceAfterDiscount=price - price * ((appliedDiscount || 0) / 100)
    product.PriceAfterDiscount=PriceAfterDiscount
    product.price=price
    product.AppliedDiscount=appliedDiscount
}
else if(price)
{
    const PriceAfterDiscount=price - price * ((product.AppliedDiscount || 0) / 100)
    product.PriceAfterDiscount=PriceAfterDiscount
    product.price=price
}
    else if(appliedDiscount)
    {
        const PriceAfterDiscount=product.price - product.price * ((appliedDiscount || 0) / 100)
        product.PriceAfterDiscount=PriceAfterDiscount
        product.AppliedDiscount=appliedDiscount
    }

    if(req.files.length){
        let ImageArr=[]
        for(const file of req.files){
            const{secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`${process.env.PROJECT_FOLDER}/Categories/${categoryExist.CustomId}/SubCategories/${SubCategoryExist.CustomId}/Brands/${BrandExist.CustomId}/Products/${product.CustomID}`,},
            )
        
        }
        let publicIds=[]
        for(const image of product.Images)
        {
            publicIds.push(image.public_id)
        }
        await cloudinary.api.delete_resources(publicIds)
        product.Images=ImageArr
    }
    // req.body.updatedBy=req.authUser._id
    finfproduct.updatedBy=UserId
    if(name)
    {
        product.name=name
        const slug = slugify(name,{
            replacement:'_'
        })
        product.slug=slug
    }
    if(description)
    {
        product.description=description
    }
    if(size)
    {
        product.Sizes=size
    }
    if(stock){
        product.stock=stock
    }
    if(colors)
    {
        product.colors=colors
    }

await product.save()
res.status(200).json({Message:"done",product})
    }

//ToDo delete Product



export const getAllProducts= async(req,res,next)=>{
    const{page,size}=req.query
const{limit,skip} =paginationFunction({page,size})


const products=await ProductModel.find().limit(limit).skip(skip)
res.status(200).json({Message:'done',products})
}

//search by name
export const Getproductsbyname= async(req,res,next)=>{
    const{Searchkey,page,size}=req.query
    const{limit,skip} =paginationFunction({page,size})
    
const products=await ProductModel.find({
    $or:[
        {name:{$regex:Searchkey,$options:'i'}},
        {description:{$regex:Searchkey,$options:'i'}},

    ]
}).limit(limit).skip(skip)
res.status(200).json({Message:'done',products})
}



//select filter sort
export const listProducts= async(req,res,next)=>{
//  onst{sort,page,size}=req.query
// const{limit,skip} =paginationFunction({page,size})

//sort
// const products=await ProductModel.find().sort(sort.replaceAll(',',' '))
// //Select
// const Select=await ProductModel.find().select(req.query.select.replaceAll(',',' '))
// //search
// const SearchProduct=await ProductModel.find({
//     $or:[
//         {name:{$regex:req.query.search, $options:'i'}},
//         {description:{$regex:req.query.search, $options:'i'}}
//     ]
// })

//filters
// const queryInstance={...req.query}
// const execuldeKeysArr = ['page', 'size', 'sort', 'select', 'search']
// execuldeKeysArr.forEach((key) => delete queryInstance[key])
// const querystring=JSON.parse(JSON.stringify(queryInstance).replace(/gt|gte|lt|lte|in|nin|eq|neq|regex/g,    (match) => `$${match}`,))
// const FilterProducts=await ProductModel.find(
//     // price:{$gt:40000},
//     querystring
// )
const ApiFeatureInstance = new ApiFeature(ProductModel.find({}),req.query).pagination().sort().filter().select()
const products = await ApiFeatureInstance.mongooseQuery
res.status(200).json({Message:'done',products})
}
