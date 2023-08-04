import { Router } from 'express'
import * as ProductController from './Product.controllers.js'
import { CloudFunction } from '../../Services/MulterCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/ErrorHandling.js'

const router = Router()

router.post('/Add',CloudFunction(allowedExtensions.Image).array('image',3),
asyncHandler(ProductController.AddProduct))
export default router