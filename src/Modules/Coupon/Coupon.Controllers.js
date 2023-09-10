import { CopounModel } from "../../../DB/Models/Coupon.model.js"
import { UserModel } from "../../../DB/Models/user.model.js"
import { SystemRules } from "../../utils/SystemRules.js"

export const AddCoupon= async (req,res,next)=>
{
    const {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
        couponAssginedToUsers,
    } = req.body
    //check coupon
    const IscouponDuplicate = await CopounModel.findOne({couponCode})
    if(IscouponDuplicate)
    {
        return next(new Error('duplicate couponCode', { cause: 400 }))
    }
    if((!isPercentage&& !isFixedAmount)||(isFixedAmount &&isPercentage))
    {
        return next(
            new Error('select if the coupon is percentage or fixedAmount', {
            cause: 400,
            }),
        )
    }

   ////// Assign Users///////////
    let usersIds = []
    for(const User of couponAssginedToUsers){
        usersIds.push(User.userId)

    }
    const usersCheck = await UserModel.find({
    _id: {
    $in: usersIds,
    },
})

if (usersIds.length !== usersCheck.length) {
    return next(new Error('invalid userIds', { cause: 400 }))
}
    const couponObject = {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
        createdBy:req.authUser._id,
        couponAssginedToUsers
        
    }
    const couponDb = await CopounModel.create(couponObject)
if (!couponDb) {
    return next(new Error('fail to add coupon', { cause: 400 }))}
res.status(201).json({ message: 'Done', couponDb })
}

//delete coupon (admin and owner only )
export const deleteCoupon= async(req,res,next)=>{
    const { _id } = req.query
    const userId = req.authUser._id
    const check=await CopounModel.findById({_id})
    if (!check) {
        return next(new Error('invalid couponId', { cause: 400 }))
    }
    if(req.authUser.role == SystemRules.Admin || check.createdBy==userId)
    {
        const IsValidCopoun =await CopounModel.findByIdAndDelete({_id})
        res.status(201).json({ message: 'done' })
    }
    
    return next(new Error('you are not authorized for this ', { cause: 400 }))
    
    }


//Update coupon  (admin and owner only )
export const UpdateCoupon = async(req,res,next)=>{
    const {
        couponCode,
        couponAmount,
    } = req.body
    const { _id } = req.query
    const userId = req.authUser._id
    const check=await CopounModel.findById({_id})
    if (!check) {
        return next(new Error('invalid couponId', { cause: 400 }))
    }
    const IscouponDuplicate = await CopounModel.findOne({couponCode})
    if(IscouponDuplicate)
    {
        return next(new Error('duplicate couponCode', { cause: 400 }))
    }
    if(req.authUser.role == SystemRules.Admin || check.createdBy.toString()==userId.toString())
    {
        const updatedC = await CopounModel.findByIdAndUpdate(_id, {
            couponCode,
            couponAmount,
        });

        return res.status(201).json({ message: 'Coupon updated successfully', updatedC});
    }
    return next(new Error('you are not authorized for this ', { cause: 400 }))
    
}
//get all coupons (admins only)
export const GetAll = async(req,res,next)=>{
const userId=req.authUser._id
    if(req.authUser.role == SystemRules.Admin){
        const gett= await CopounModel.find()
        return res.status(201).json({ message: 'All coupons', gett});
    }
    return next(new Error('you are not authorized for this ', { cause: 400 }))

}