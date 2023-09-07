import { ProductModel } from "../../../DB/Models/Products.model.js"
import { ReviewModel } from "../../../DB/Models/Review.Model.js"
import { OrderModel } from "../../../DB/Models/order.model.js"




export const AddReview = async (req,res,next)=>{
const userId=req.authUser._id
const{ProductId}=req.query

//check product
const IsvalidProductReviewed = await OrderModel.findOne({
    userId,
    'products.ProductId':ProductId,
    OrderStatus:'Delivered'
})
if(!IsvalidProductReviewed){
    return next(new Error('You Should buy the product first',{cause:400}))
}

const {ReviewRate,ReviewComment}= req.body
const ReviewObject={
    ReviewComment,
    ReviewComment,
    userId,
    ProductId,
}
const ReviewDb= await ReviewModel.create(ReviewObject)
if(!ReviewDb)
{
    return next(new Error('Failed to Add Review',{cause:400}))
}
const Product =await ProductModel.findById(ProductId)
const Reviews= await ReviewModel.find({ProductId})
let sumOfRates=0
for(const review of Reviews)
{
    sumOfRates+=review.ReviewRate
}
Product.rate=sumOfRates/Reviews.length
await Product.save()
res.status(201).json({Message:"done",ReviewDb})
}


//overall rate = sum rate/num of rates