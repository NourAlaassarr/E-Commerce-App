import { Router } from "express";
import * as OrderControllers from './Order.controllers.js'
import {asyncHandler}from '../../utils/ErrorHandling.js'
import {isAuth}from'../../Middleware/auth.js'
import {ValidationCoreFunction}from '../../Middleware/Validation.js'
import * as Validator from './order.validators.js'
import{OrderApiRoles}from'./Order.Endpoints.js'
const router=Router()


router.post('/Add',isAuth(),asyncHandler(OrderControllers.CreateOrder)
)
router.post('/CartToOrder',isAuth(),asyncHandler(OrderControllers.FromCartToOrder))
router.patch('/successOrder',asyncHandler(OrderControllers.successPayament))
router.patch('/cancelOrder',asyncHandler(OrderControllers.CancelPayment))
router.post('/deliver',isAuth(OrderApiRoles.DELIVER_ORDER),
asyncHandler(OrderControllers.DeliverOrdr))
export default router