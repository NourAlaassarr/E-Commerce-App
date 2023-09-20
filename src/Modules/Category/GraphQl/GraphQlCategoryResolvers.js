
import{GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString}from'graphql'
import { CategoryModel } from '../../../../DB/Models/Category.model.js'
import * as types from './QraphQlTypes.js'
import slugify from 'slugify'
import { GraphQlValidation } from '../../../Middleware/Validation.js'
import{CreateCategorySchemaQl}from'../Category.Validator.js'


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
    },
    resolve: async(__ , args)=>{
        //validation
        const ValidationRsults=GraphQlValidation(CreateCategorySchemaQl,args)
        if(ValidationRsults!==true){
            return ValidationRsults
        }
        const {name}=args
        const CategoryObj={
            name:name,
            slug:slugify(name,'-'),
        }
        const Category= await CategoryModel.create(CategoryObj)
        return{
            message:"done",
            category:Category,

        }
    }


}