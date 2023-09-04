import {CartModel}from'../../../DB/Models/Cart.model.js'

import{IsCouponValid}from'../../utils/CouponValidatin.js'
import { CopounModel }from'../../../DB/Models/Coupon.model.js'
import { ProductModel} from'../../../DB/Models/Products.model.js'
import { OrderModel } from '../../../DB/Models/order.model.js'
import { nanoid } from 'nanoid'
import{sendmailService}from '../../Services/SendEmailService.js'
import createInvoice from '../../utils/pdfkit.js'


//Create Order
export const CreateOrder = async (req,res,next)=>{
    const{
        
    ProductId,
    quantity,
    couponCode,
    Address,
    PhoneNumber,
    PaymentMethod}=req.body

    const userId=req.authUser._id

//check coupon(expires,invalid,assign)
if(couponCode)
{
    const Coupon =await CopounModel.findOne({couponCode}).select('isPercentage isFixedAmount couponAmount couponAssginedToUsers')
    const IsValidCoupon = await IsCouponValid({couponCode,userId,next})
    if(IsValidCoupon !==true)
    {
        return IsValidCoupon
    }
    req.Coupon=Coupon
}
//Products Check
const product=[]
const IsProductValid = await ProductModel.findOne({
    _id:ProductId,
    stock:{$gte:quantity}
})
if(!IsProductValid)
{
    return next(new Error('Invalid Product Please Check you quantity',{cause:400}))
}
const ProductOb={
    ProductId,
    quantity,
    name:IsProductValid.name,
    price:IsProductValid.PriceAfterDiscount,
    finalPrice:IsProductValid.PriceAfterDiscount * quantity,

}
product.push(ProductOb)
//Subtotal..................
const SubTotal = ProductOb.finalPrice
//PaidAmount.....................
let PaidAmount = 0


if(req.Coupon?.isPercentage)
{
    PaidAmount= SubTotal *(1-(req.Coupon.couponAmount ||0)/100)

}else if(req.Coupon?.isFixedAmount)
{
    PaidAmount= SubTotal-req.Coupon.couponAmount
}
else{
    PaidAmount=SubTotal
}

//Payment Method
let OrderStatus
PaymentMethod =='Cash'? (OrderStatus='placed'):(OrderStatus='Pending')

const OrderOb ={
    userId,
    products:product,
    couponCode,
    Address,
    PhoneNumber,
    PaymentMethod,
    paidAmount:PaidAmount,
    subTotal:SubTotal,
    OrderStatus,
    CouponId:req.Coupon?._id,

}
const OrderDB= await OrderModel.create(OrderOb)
// increase usageCount for coupon usage
if(OrderDB)
{
    if(req.Coupon)
    {
        for(const user of req.Coupon.couponAssginedToUsers)
        {
            if(user.userId.toString() == userId.toString())
            {
                user.usageCount +=1
            }
        }
        await req.Coupon.save()
    }

// decrease product's stock by order's product quantity
await ProductModel.findByIdAndUpdate({_id:ProductId},{
    $inc:{stock: -parseInt(quantity)}//todecrease
},
)
//TODO:Remove Product From UserCart if Exist

//invoice
const orderCode = `${req.authUser.userName}_${nanoid(3)}`
  // generat invoice object
const orderinvoice = {
    shipping: {
        name: req.authUser.userName,
        address: OrderDB.Address,
        city: 'Cairo',
        state: 'Cairo',
        country: 'Cairo',
    },
    orderCode,
    date: OrderDB.createdAt,
    items: OrderDB.products,
    subTotal: OrderDB.subTotal,
    paidAmount: OrderDB.paidAmount,
}

// fs.unlink()
await createInvoice(orderinvoice, `${orderCode}.pdf`)
await sendmailService({
    to: req.authUser.email,
    subject: 'Order Confirmation',
    message: '<h1> please find your invoice pdf below</h1>',
    attachments: [
      {
        path: `./Files/${orderCode}.pdf`,
      },
    ],
  })

return res.status(201).json({message:'done',OrderDB})
}
return next(new Error('Fail to Create Order',{cause:400}))

}
export const FromCartToOrder = async (req,res,next)=>{
    const userId=req.authUser._id
    const{cartId}=req.query
    console.log(cartId)
    const{couponCode,Address,PhoneNumber, PaymentMethod}=req.body
    const Cart =  await CartModel.findById(cartId)
    if(!Cart || !Cart.products.length)
    {
        return next(new Error('Please Fill Your Cart First',{cause:400}))
    }
    if(couponCode)
{
    const Coupon =await CopounModel.findOne({couponCode}).select('isPercentage isFixedAmount couponAmount couponAssginedToUsers')
    const IsValidCoupon = await IsCouponValid({couponCode,userId,next})
    if(IsValidCoupon !==true)
    {
        return IsValidCoupon
    }
    req.Coupon=Coupon
}
let SubTotal =Cart.subTotal
let PaidAmount = 0
if(req.Coupon?.isPercentage)
{
    PaidAmount= SubTotal *(1-(req.Coupon.couponAmount ||0)/100)

}else if(req.Coupon?.isFixedAmount)
{
    PaidAmount= SubTotal-req.Coupon.couponAmount
}
else{
    PaidAmount=SubTotal
}
let OrderStatus
PaymentMethod =='Cash'? (OrderStatus='placed'):(OrderStatus='Pending')
let OrderProducts=[]
for( const Product of Cart.products)
{
    const ProductExists = await ProductModel.findById(Product.ProductId)
    OrderProducts.push({
        ProductId:Product.ProductId,
        quantity:Product.quantity,
        name:ProductExists.name,
        price:ProductExists.PriceAfterDiscount,
        finalPrice:ProductExists.PriceAfterDiscount * Product.quantity
    })
}
const OrderOb ={
    userId,
    products:OrderProducts,
    couponCode,
    Address,
    PhoneNumber,
    PaymentMethod,
    paidAmount:PaidAmount,
    subTotal:SubTotal,
    OrderStatus,
    CouponId:req.Coupon?._id,

}
const OrderDB= await OrderModel.create(OrderOb)
// increase usageCount for coupon usage
if(OrderDB)
{
    if(req.Coupon)
    {
        for(const user of req.Coupon.couponAssginedToUsers)
        {
            if(user.userId.toString() == userId.toString())
            {
                user.usageCount +=1
            }
        }
        await req.Coupon.save()
    }

// decrease product's stock by order's product quantity
for(const Product of Cart.products){
    await ProductModel.findByIdAndUpdate({_id:Product.ProductId},{
        $inc:{stock: -parseInt(Product.quantity)}//todecrease
    },)
}
//Remove Product From UserCart if Exist
Cart.products=[]
await Cart.save()

return res.status(201).json({message:'done',OrderDB,Cart})
}
return next(new Error('Fail to Create Order',{cause:400}))


}