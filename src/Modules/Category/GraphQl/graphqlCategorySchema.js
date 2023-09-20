import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
            import{GetAllCategoryResolvers,CreateCategory}from'./GraphQlCategoryResolvers.js'


export const CategorySchema = new GraphQLSchema({
    query:new GraphQLObjectType({
        name:'CategoryQuerySchema',
        description:'caategory query schema',
        fields:{
            GetAllCategories:GetAllCategoryResolvers,
            CreateCategory:CreateCategory,
            }
        })
    })
