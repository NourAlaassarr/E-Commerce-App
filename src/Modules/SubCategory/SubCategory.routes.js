import { Router } from "express";
import {asyncHandler}from'../../utils/ErrorHandling.js'
import {CloudFunction} from'../../Services/MulterCloud.js'
import{allowedExtensions}from'../../utils/allowedExtensions.js'
import * as SubCategoryControllers from './SubCategory.Controller.js'
import {ValidationCoreFunction}from '../../Middleware/Validation.js'
import * as Validators from './SubCategory.validator.js'

const router = Router({mergeParams:true})



router.post(
    '/Add',
    CloudFunction(allowedExtensions.Image).single('image'),
    ValidationCoreFunction(Validators.CreateSubCategorySchema),
    asyncHandler(SubCategoryControllers.CreateSubCategory),
)

router.get('/Get',
asyncHandler(SubCategoryControllers.GetAllSubCategories))



export default router