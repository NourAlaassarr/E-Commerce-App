
import{GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString}from'graphql'
import { CategoryModel } from '../../../../DB/Models/Category.model.js'
import * as types from './QraphQlTypes.js'
import slugify from 'slugify'
import { GraphQlValidation } from '../../../Middleware/Validation.js'
import{CreateCategorySchemaQl}from'../Category.Validator.js'
import { isAuthQl } from '../../../Middleware/auth.js'
import { SystemRules } from '../../../utils/SystemRules.js'


export const GetAllCategoryResolvers={
    type:new GraphQLList(types.CategoryType),
    resolve: async()=>{
        const Categories =await CategoryModel.find({})
        return Categories

    }
}


export const CreateCategory ={
    type:new GraphQLObjectType({
        name:'respond',
        fields:{
            message:{type:GraphQLString},
            category:{type:types.CategoryType}
        }
    }),
    args:{
        name:{type:new GraphQLNonNull(GraphQLString)},
        token:{type:new GraphQLNonNull(GraphQLString)}
    },
    resolve: async(__ , args)=>{
        //authentication + authorization
        const isAuthuser=await isAuthQl(args.token,[SystemRules.Admin])
        console.log({isAuthuser})
        if(!isAuthuser.code){
            return isAuthuser
        }
        //validation
        const ValidationRsults=GraphQlValidation(CreateCategorySchemaQl,args)
        if(ValidationRsults!==true){
            return ValidationRsults
        }
        const {name}=args
        const CategoryExist = await CategoryModel.findOne({name})
        if(CategoryExist){
            return new Error('duplicate Category name',{cause:400})
        }
        const CategoryObj={
            name:name,
            slug:slugify(name,'-'),
            createdBy:isAuthuser.findUser._id
        }
        const Category= await CategoryModel.create(CategoryObj)
        return{
            message:"done",
            category:Category,

        }
    }


}