
import{GraphQLList, GraphQLObjectType, GraphQLString}from'graphql'
import { CategoryModel } from '../../../../DB/Models/Category.model.js'
import * as types from './QraphQlTypes.js'



export const GetAllCategoryResolvers={
    type:new GraphQLList(types.CategoryType),
    resolve: async()=>{
        const Categories =await CategoryModel.find({})
        return Categories

    }
}