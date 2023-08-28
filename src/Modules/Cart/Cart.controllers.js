
import{ProductModel}from '../../../DB/Models/Products.model.js'
import{CartModel}from'../../../DB/Models/Cart.model.js'

//add TO Cart
export const Add = async(req,res,next)=>{
    const{ProductId,quantity}=req.body
    const userId = req.authUser._id
    
    
    //product check
    const ProductCheck = await ProductModel.findOne({
        _id:ProductId,
        stock:{ $gte:quantity}})
    if(!ProductCheck)
    {
        return next(new Error('invalid product Please check the quantity',{cause:400}))
    }
    const userCart = await CartModel.findOne({userId}).lean()
    if(userCart)
    {
        //update quantity
        let producexist =false
        for(const product of userCart.products){
            if(ProductId==product.ProductId)
            {
                producexist=true
                product.quantity=quantity
            }
        }
        //push product]
        if(!producexist)
        {
            userCart.products.push({ProductId,quantity})
        }

        let SubTotal=0
        for(const Product of userCart.products)
        {const ProductExsits= await ProductModel.findById(Product.ProductId)
            SubTotal+=(ProductExsits?.PriceAfterDiscount*Product.quantity || 0)
        }
        const NewCart=await CartModel.findOneAndUpdate({userId},{
            subTotal:SubTotal,
            products:userCart.products,
        },{
            new:true
        })
        return res.status(200).json({Message:'done',NewCart})
    }
    //SubTotal

    const CartObj={
        userId,
        products:[{ProductId,quantity}],
        subTotal:ProductCheck.price*quantity
    }
    const CartDataBase = await CartModel.create(CartObj)
    res.status(201).json({Message:'done',CartDataBase})
}

export const Delete = async(req,res,next)=>{
    const{ProductId}=req.body
    const userId = req.authUser._id

    const ProductCheck = await ProductModel.findOne({
        _id:ProductId})
        if(!ProductCheck)
    {
        return next(new Error('invalid product Id',{cause:400}))
    }

    const UserCart = await CartModel.findOne({userId,'products.ProductId':ProductId})
    if(!UserCart)
    {
        return next(new Error('nO product Id',{cause:400}))
    }
    UserCart.products.forEach(ele=>{
        if(ele.ProductId==ProductId)
        {
            UserCart.products.splice(UserCart.products.indexOf(ele),1)
        }
    })
    await UserCart.save()
    res.status(200).json({Message:'Done',UserCart})
}

