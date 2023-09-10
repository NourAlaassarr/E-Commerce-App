import { Router } from "express";
import {asyncHandler}from'../../utils/ErrorHandling.js'
import * as BrandController from './Brand.Controller.js'
import {allowedExtensions} from '../../utils/allowedExtensions.js'
import {CloudFunction}from '../../Services/MulterCloud.js'
import {isAuth}from'../../Middleware/auth.js'
import* as Validator from'./Brand.Validator.js'
import{ValidationCoreFunction}from'../../Middleware/Validation.js'

const router = Router()

router.post('/Add',isAuth(),
CloudFunction(allowedExtensions.Image).single('logo'),
ValidationCoreFunction(Validator.AddBrandSchema),
asyncHandler(BrandController.AddBrand))





export default router