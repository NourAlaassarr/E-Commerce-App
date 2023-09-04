import { Router } from "express";
import {asyncHandler}from'../../utils/ErrorHandling.js'
import {CloudFunction} from'../../Services/MulterCloud.js'
import{allowedExtensions}from'../../utils/allowedExtensions.js'
import * as CategoryControllers from './Category.Controllers.js'
import {ValidationCoreFunction}from '../../Middleware/Validation.js'
import * as Validators from './Category.Validator.js'
import  SubCategoryRouter  from "../SubCategory/SubCategory.routes.js";
import {isAuth}from'../../Middleware/auth.js'
import { SystemRules } from "../../utils/SystemRules.js";
const router = Router()
router.use('/:CategoryId',SubCategoryRouter)

router.post('/Add',isAuth([SystemRules.Admin,SystemRules.Super]),
CloudFunction(allowedExtensions.Image).single('image'),
ValidationCoreFunction(Validators.CreateCategorySchema),
asyncHandler(CategoryControllers.createCategory))

router.put('/Update/:CategoryId/',
isAuth(),
CloudFunction(allowedExtensions.Image).single('image'),
ValidationCoreFunction(Validators.UpdateCategorySchema),
asyncHandler(CategoryControllers.UpdateCategory))

router.delete('/Delete',isAuth(),
asyncHandler(CategoryControllers.DeleteCategory))
router.get('/Get', asyncHandler(CategoryControllers.getAllCategories))


export default router