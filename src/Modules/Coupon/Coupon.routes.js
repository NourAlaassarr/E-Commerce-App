import { Router } from "express";
import {asyncHandler}from'../../utils/ErrorHandling.js'
import {CloudFunction} from'../../Services/MulterCloud.js'
import{allowedExtensions}from'../../utils/allowedExtensions.js'
import {ValidationCoreFunction}from '../../Middleware/Validation.js'
import * as Validators from './Coupon.validations.js'
import * as CouponControllers from'./Coupon.Controllers.js'
import {isAuth}from'../../Middleware/auth.js'
const router = Router()

router.post('/Add',
isAuth(),
ValidationCoreFunction(Validators.AddCouponSchema),asyncHandler(CouponControllers.AddCoupon))

router.delete('/Delete',isAuth(),ValidationCoreFunction(Validators.DeleteCouponSchema),
asyncHandler(CouponControllers.deleteCoupon))



export default router