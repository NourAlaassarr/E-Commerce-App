import {scheduleJob} from 'node-schedule'
import {CopounModel} from '../../DB/Models/Coupon.model.js'
// import moment from 'moment'
import moment  from 'moment-timezone'
// export const job = () =>{
//     scheduleJob('* * * * * *', function () {
//     console.log('The answer to life, the universe, and everything!');}
// )};

export const changeCouponStatus =()=>{
    scheduleJob('* */60 * * * *', async function(){
        const IsValidCopoun = await CopounModel.find({CouponStatus:'Valid'})
        console.log(IsValidCopoun)
        for(const coupon of IsValidCopoun)
        {
            // console.log({
            //     momentToDate:moment(coupon.toDate),
            //     now:moment(),
            //     cond:moment(coupon.toDate).isBefore(moment())
            // })

            if (moment(coupon.toDate).isBefore(moment().tz('Africa/Cairo'))){
                coupon.CouponStatus='Expired'
                await coupon.save(); 
            }
        }
        console.log('cron changecoupon is running..............')
    })
}