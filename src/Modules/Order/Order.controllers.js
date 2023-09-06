import {CartModel}from'../../../DB/Models/Cart.model.js'

import{IsCouponValid}from'../../utils/CouponValidatin.js'
import { CopounModel }from'../../../DB/Models/Coupon.model.js'
import { ProductModel} from'../../../DB/Models/Products.model.js'
import { OrderModel } from '../../../DB/Models/order.model.js'
import { nanoid } from 'nanoid'
import{sendmailService}from '../../Services/SendEmailService.js'
import createInvoice from '../../utils/pdfkit.js'
import {generateQRcode}from'../../utils/QRFunction.js'
import {paymentFunction}from'../../utils/Payment.js'
import { VerifyToken, generateToken } from '../../utils/TokenFunction.js'
import Stripe from 'stripe'
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
        return next(new Error(IsValidCoupon.msg,{cause:400}))
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

if(!OrderDB)
{
    return next(new Error('Fail to Create Order',{cause:400}))
}

//................Payment....................
let ordersession
if (OrderDB.PaymentMethod == 'Card')
{
    if(req.Coupon){
        const stripe= new Stripe(process.env.STRIPE_SECRET_KEY)
        let coupon
        //percentage
        if(req.Coupon.isPercentage){
            coupon =await stripe.coupons.create({
                percent_off:req.Coupon.couponAmount
            })
        }
        //fixed amount
            if(req.Coupon.isFixedAmount){
                coupon =await stripe.coupons.create({
                    amount_off:req.Coupon.couponAmount *100,
                    currency:'EGP'
                })
            }
            req.CouponId=coupon.id
    }
    
            const tokenOrder = generateToken({ payload: { orderId: OrderDB._id }, signature: process.env.ORDER_TOKEN, expiresIn: '1d' })
            console.log( `${req.protocol}://${req.headers.host}/Order/successOrder?token=${tokenOrder}`)
    ordersession = await paymentFunction({
        payment_method_types:['card'],
        mode: 'payment',
        customer_email: req.authUser.email,
        metadata: { orderId: OrderDB._id.toString() },
        success_url: `${req.protocol}://${req.headers.host}/Order/successOrder?token=${tokenOrder}`,
        cancel_url: `${req.protocol}://${req.headers.host}/Order/cancelOrder?token=${tokenOrder}`,
        line_items: OrderDB.products.map((ele) => {
        return {
            price_data: {
                currency: 'EGP',
                product_data: {
                name: ele.name,
            },
              unit_amount: ele.price * 100,
            },
            quantity: ele.quantity,
        }
        }),
        discounts: req.CouponId ? [{ coupon: req.CouponId }] : [],
    })
}
// increase usageCount for coupon usage
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



//..................invoice...................
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
const isEmailSent=await sendmailService({
    to: req.authUser.email,
    subject: 'Order Confirmation',
    message: '<h1> please find your invoice pdf below</h1>',
    attachments: [
    {
        path: `./Files/${orderCode}.pdf`,
    },
    ],
})
if (!isEmailSent) {
    return next(new Error('email fail', { cause: 500 }))
}


res.status(201).json({
    message: 'Done',
    OrderDB /* , orderQr*/,
    checkOutUrl: ordersession.url,
})
}

export const successPayament=async(req,res,next)=>{
    const{token}=req.query
    const decodeData=VerifyToken({token,signature:process.env.ORDER_TOKEN})
    const Order = await OrderModel.findOne({_id:decodeData.orderId,OrderStatus:'Pending'})
    if(!Order){
        return next(new Error('Invalid OrderId',{cause:400}))
    }
    Order.OrderStatus='Confirmed'
    await Order.save()
    res.status(200).json({Message:'Your Order is Confirmed',Order})

}
export const CancelPayment=async(req,res,next)=>{
    const{token}=req.query
    const decodeData=VerifyToken({token,signature:process.env.ORDER_TOKEN})
    const Order = await OrderModel.findOne({_id:decodeData.orderId})
    if(!Order){
        return next(new Error('Invalid OrderId',{cause:400}))
    }
    //approach one orderStatus canceled
    Order.OrderStatus='canceled'
    await Order.save()
    //approach two delete order
    // await OrderModel.findByIdAndDelete(decodeData.orderId)

    //undo Products Stock + coupon usage
    for(const Product of Order.products){
        await ProductModel.findByIdAndUpdate(Product.ProductId,{
            $inc: {stock:parseInt(Product.quantity)}
        })
    }
    if(Order.CouponId){
        const coupon=await CopounModel.findById(Order.CouponId)
        if(!coupon){
            return next(new Error('this coupoun is deleted',{cause:400}))
        }
        coupon.couponAssginedToUsers.map((ele)=>{
            if(ele.userId.toString()==Order.userId.toString()){
                ele.usageCount+=1
            }
        })
    }

    res.status(200).json({Message:'Your Order is Canceled',Order})

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