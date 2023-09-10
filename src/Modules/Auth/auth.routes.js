import { Router } from "express";
import * as AuthControllers from './auth.controllers.js'
import {asyncHandler}from'../../utils/ErrorHandling.js'
import { isAuth } from "../../Middleware/auth.js";
import {ValidationCoreFunction}from '../../Middleware/Validation.js'
import * as Validator from'./Auth.Validation.js'
const router= Router()

router.post('/SignUp',ValidationCoreFunction(Validator.SignUp),asyncHandler(AuthControllers.SignUp))
router.get('/confirm/:token',ValidationCoreFunction(Validator.ConfirmSchema),asyncHandler(AuthControllers.Confirm))
router.post('/LogIn',ValidationCoreFunction(Validator.SignINschema),asyncHandler(AuthControllers.SignIN))
router.patch('/ForgetPassword',ValidationCoreFunction(Validator.ForgetPasswordScehma),asyncHandler(AuthControllers.ForgetPassword))
router.patch('/reset/:token',ValidationCoreFunction(Validator.resetSchema),asyncHandler(AuthControllers.reset))
router.post('/loginWithGmail' ,ValidationCoreFunction(Validator.loginWithGmailSchema), asyncHandler(AuthControllers.loginWithGmail))
router.post('/ChangePassword',isAuth(),ValidationCoreFunction(Validator.ChangePasswordSchema),asyncHandler(AuthControllers.ChangePassword))
export default router
