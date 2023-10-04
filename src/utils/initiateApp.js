import {GlobalResponse} from './ErrorHandling.js'
import { DBconnection } from '../../DB/Connections.js'
import * as router from '../Modules/index.routes.js'
import { gracefulShutdown } from 'node-schedule'
import{changeCouponStatus} from './Crons.js'
import {createHandler} from'graphql-http/lib/use/express'
import cors from 'cors'
import { CategorySchema } from '../Modules/Category/GraphQl/graphqlCategorySchema.js'
import {initiatio}from'../utils/iogeneration.js'


export const InitiateApp =(App,express)=>{
const Port =process.env.PORT || 5000

App.use(express.json()) 
App.use(cors()) // allow anyone
DBconnection()
App.get('/',(req,res)=>res.send("helloworldd"))

App.use('/Category',router.CategoryRouter)
App.use('/SubCategory',router.SubCategoryRouter)
App.use('/Brand',router.BrandRouter)
App.use('/Product',router.ProductRoutes)
App.use('/Coupon',router.CouponRoutes)
App.use('/User',router.UserRoutes)
App.use('/Auth',router.AuthRoutes)
App.use('/Cart',router.CartRoutes)
App.use('/Order',router.OrderRoutes)
App.use('/Review',router.ReviewRoutes)
App.use('/graphqlCategory',createHandler({schema:CategorySchema}))
App.all('*',(req,res,next)=>
    res.status(404).json({ message: '404 URL Not Found' })
)
App.use(GlobalResponse)
changeCouponStatus()
// gracefulShutdown

const ServerApp=App.listen(Port,()=>{
    console.log(`---------------Server is Running on port number ${Port} !---------------`)
})
const io =initiatio(ServerApp)
// const io = new Server(ServerApp)
io.on('connection',(socket)=>{
    console.log({socketId:socket.id})
})
}

//cors
