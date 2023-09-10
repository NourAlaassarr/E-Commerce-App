import { Router } from 'express'
import * as ProductController from './Product.controllers.js'
import { CloudFunction } from '../../Services/MulterCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/ErrorHandling.js'
import { isAuth } from '../../Middleware/auth.js'
import {ValidationCoreFunction}from '../../Middleware/Validation.js'
import * as Validator from './product.validator.js'
const router = Router()

router.post('/Add',isAuth(),
CloudFunction(allowedExtensions.Image).array('image',3),
ValidationCoreFunction(Validator.AddProduct),
asyncHandler(ProductController.AddProduct))

router.put('/Update',isAuth(),
CloudFunction(allowedExtensions.Image).array('image',3),
ValidationCoreFunction(Validator.UpdateProduct),
asyncHandler(ProductController.UpdateProduct))
router.get('/Get',asyncHandler(ProductController.getAllProducts))
router.get('/ListProducts',asyncHandler(ProductController.listProducts))
router.get('/GetByName',asyncHandler(ProductController.getAllProducts))
router.delete('/Delete',ValidationCoreFunction(Validator.DeleteSchema),asyncHandler(ProductController.Delete))
export default router