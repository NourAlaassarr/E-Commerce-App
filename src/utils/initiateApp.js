import {GlobalResponse} from './ErrorHandling.js'
import { DBconnection } from '../../DB/Connections.js'
import * as router from '../Modules/index.routes.js'
export const InitiateApp =(App,express)=>{
const Port =process.env.PORT

App.use(express.json()) 
DBconnection()
App.use('/Category',router.CategoryRouter)
App.use('/SubCategory',router.SubCategoryRouter)
App.use('/Brand',router.BrandRouter)


App.all('*',(req,res,next)=>
    res.status(404).json({ message: '404 Not Found URL' })
)
App.use(GlobalResponse)
App.listen(Port,()=>{
    console.log(`---------------Server is Running on port number ${Port} !---------------`)
})
}