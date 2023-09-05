

import {CopounModel} from '../../DB/Models/Coupon.model.js'
import moment from 'moment-timezone'

export const IsCouponValid = async({couponCode, userId,next}={})=>
{
    const Coupon = await CopounModel.findOne({couponCode})
    if(!Coupon)
    {
        return {
            msg:"please enter a valid coupon"
        }
    }
    //Expiration
    if(Coupon.CouponStatus=='Expired' || moment(Coupon.toDate).isBefore(moment().tz('Africa/Cairo'))){
        return {
            msg:"Coupon is Expired",
        }
    }
    if(Coupon.CouponStatus=='Valid' && moment().isBefore(moment(new Date(Coupon.fromDate)).tz('Africa/Cairo'))){
        return {
            msg:"Coupon hasn't started yet",
        }
    }
    let notAssignedUsers=[]
    let exceedmaxusage=false
    for(const user of Coupon.couponAssginedToUsers)
    {
        //if not assigned to user
        // if( userId.toString() !== user.userId.toString())
        // {
        //     return next(new Error('You are not assigned to this Coupon',{cause:400}))
        // }
        notAssignedUsers.push(user.userId.toString())
        if(userId.toString()==user.userId.toString())
        {
            if(user.maxUsage <=user.usageCount)
        {
            // return next(new Error('Excceed the max usage of this Coupon',{cause:400}))
            exceedmaxusage=true
        }
        }
    }
// not assigned user
    if(! notAssignedUsers.includes(userId.toString()))
    {
        return{
            noAssigned:true,
            msg:"You are not assigned to this Coupon"
        }
    }
    if(exceedmaxusage){
        return{
            msg:"Excceed the max usage of this Coupon"
        }
    }
    return true
}

