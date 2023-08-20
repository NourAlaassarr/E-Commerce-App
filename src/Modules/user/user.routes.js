import { Router } from 'express'
import * as UserControllers from './user.controllers.js'
import { CloudFunction } from '../../Services/MulterCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/ErrorHandling.js'

const router = Router()

router.post('/SignUp',asyncHandler(UserControllers.signUp))
router.get('/RefreshToken/:token',asyncHandler(UserControllers.RefreshToken))
router.get('/ConfirmEmail/:token',asyncHandler(UserControllers.confirm))
router.get('/GetQr',asyncHandler(UserControllers.GetQR))
router.patch('/ForgetPassword',asyncHandler(UserControllers.ForgetPassword))
router.patch('/ResetPassword/:token',asyncHandler(UserControllers.ResetPassword))
router.post('/login',asyncHandler(UserControllers.login))
export default router