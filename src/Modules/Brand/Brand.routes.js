import { Router } from "express";
import {asyncHandler}from'../../utils/ErrorHandling.js'
import * as BrandController from './Brand.Controller.js'
import {allowedExtensions} from '../../utils/allowedExtensions.js'
import {CloudFunction}from '../../Services/MulterCloud.js'
import {isAuth}from'../../Middleware/auth.js'
//TODO api Validation
const router = Router()
//TODO api Validation
router.post('/Add',isAuth(),
CloudFunction(allowedExtensions.Image).single('logo'),
asyncHandler(BrandController.AddBrand))





export default router