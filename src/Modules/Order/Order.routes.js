import { Router } from "express";
import * as OrderControllers from './Order.controllers.js'
import {asyncHandler}from '../../utils/ErrorHandling.js'
import {isAuth}from'../../Middleware/auth.js'
import {ValidationCoreFunction}from '../../Middleware/Validation.js'
import * as Validator from './order.validators.js'
import{OrderApiRoles}from'./Order.Endpoints.js'
const router=Router()


router.post('/Add',isAuth(),
ValidationCoreFunction(Validator.CreateOrderschema),
asyncHandler(OrderControllers.CreateOrder)
)


router.post('/CartToOrder',isAuth(),
ValidationCoreFunction(Validator.FromCartToOrderSchema),
asyncHandler(OrderControllers.FromCartToOrder))


router.patch('/successOrder',
ValidationCoreFunction(Validator.successPayamentSchema),
asyncHandler(OrderControllers.successPayament))


router.patch('/cancelOrder',
ValidationCoreFunction(Validator.CancelPaymentSchema),
asyncHandler(OrderControllers.CancelPayment))


router.post('/deliver',
isAuth(OrderApiRoles.DELIVER_ORDER),
ValidationCoreFunction(Validator.DeliverOrdrSchema),
asyncHandler(OrderControllers.DeliverOrdr))
export default router