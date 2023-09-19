import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import{GetAllCategoryResolvers}from'./GraphQlCategoryResolvers.js'


export const CategorySchema = new GraphQLSchema({
    query:new GraphQLObjectType({
        name:'CategoryQuerySchema',
        description:'caategory query schema',
        fields:{
            GetAllCategories:GetAllCategoryResolvers,
            }
        })
    })
