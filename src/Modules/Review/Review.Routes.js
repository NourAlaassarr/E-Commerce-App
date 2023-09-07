import {Router} from 'express'
import * as ReviewControllers from'./Review.Controllers.js'
import {asyncHandler}from '../../utils/ErrorHandling.js'
import {isAuth}from'../../Middleware/auth.js'
import {ValidationCoreFunction}from '../../Middleware/Validation.js'
import * as Validator from './Review.Validators.js'
const router =Router()

router.post('/Add',isAuth(),
ValidationCoreFunction(Validator.AddreviewSchema),
asyncHandler(ReviewControllers.AddReview))


export default router