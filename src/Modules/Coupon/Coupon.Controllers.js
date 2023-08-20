import { CopounModel } from "../../../DB/Models/Coupon.model.js"

export const AddCoupon= async (req,res,next)=>
{
    const {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
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
    const couponObject = {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
    }
    const couponDb = await CopounModel.create(couponObject)
if (!couponDb) {
    return next(new Error('fail to add coupon', { cause: 400 }))}
res.status(201).json({ message: 'Done', couponDb })
}