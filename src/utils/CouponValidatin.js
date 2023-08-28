

import {CopounModel} from '../../DB/Models/Coupon.model.js'
import moment from 'moment-timezone'

export const IsCouponValid = async({couponCode, userId,next}={})=>
{
    const Coupon = await CopounModel.findOne({couponCode})
    if(!Coupon)
    {
        return next(new Error('please Enter a Valid Coupon Code',{cause:400}))
    }
    //Expiration
    if(Coupon.CouponStatus=='Expired' ||moment(Coupon.toDate).isBefore(moment().tz('Africa/Cairo'))){
        return next(new Error('coupon is expired',{cause:400}))
    }
    
    for(const user of Coupon.couponAssginedToUsers)
    {
        //if not assigned to user
        if( userId.toString() !== user.userId.toString())
        {
            return next(new Error('You are not assigned to this Coupon',{cause:400}))
        }
        if(user.maxUsage <=user.usageCount)
        {
            return next(new Error('Excceed the max usage of this Coupon',{cause:400}))
        }
    }
    return true
}

