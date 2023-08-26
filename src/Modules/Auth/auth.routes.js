import { Router } from "express";
import * as AuthControllers from './auth.controllers.js'
import {asyncHandler}from'../../utils/ErrorHandling.js'
const router= Router()

router.post('/SignUp',asyncHandler(AuthControllers.SignUp))
router.get('/confirm/:token',asyncHandler(AuthControllers.Confirm))
router.post('/LogIn',asyncHandler(AuthControllers.SignIN))
router.patch('/ForgetPassword',asyncHandler(AuthControllers.ForgetPassword))
router.patch('/reset/:token',asyncHandler(AuthControllers.reset))

export default router