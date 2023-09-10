import { Router } from "express";
import {asyncHandler}from'../../utils/ErrorHandling.js'
import * as Validator from './cart.validators.js'
import{ValidationCoreFunction}from'../../Middleware/Validation.js'
import * as CartControllers from'./Cart.controllers.js'
import { isAuth } from "../../Middleware/auth.js";
const router=Router()

router.post('/Add',isAuth(),ValidationCoreFunction(Validator.AddSchema),
asyncHandler(CartControllers.Add))
router.delete('/Delete',isAuth(),ValidationCoreFunction(Validator.deleteschema),
asyncHandler(CartControllers.Delete))

export default router