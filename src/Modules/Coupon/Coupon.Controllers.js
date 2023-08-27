import { CopounModel } from "../../../DB/Models/Coupon.model.js"
import { UserModel } from "../../../DB/Models/user.model.js"

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

export const deleteCoupon= async(req,res,next)=>{
    const { _id } = req.query
    const userId = req.authUser._id
    const IsValidCopoun=await CopounModel.findByIdAndDelete({_id,createdBy:userId })
    console.log(_id)
    if (!IsValidCopoun) {
        return next(new Error('invalid couponId', { cause: 400 }))
    }
    res.status(201).json({ message: 'done' })
    }
