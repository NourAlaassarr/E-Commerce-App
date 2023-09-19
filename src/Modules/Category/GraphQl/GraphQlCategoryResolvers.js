
import{GraphQLList, GraphQLObjectType, GraphQLString}from'graphql'
import { CategoryModel } from '../../../../DB/Models/Category.model.js'

const ImageType= new GraphQLObjectType({

                name:'imageType',
                fields:{
                    secure_url:{type:GraphQLString},
                    public_id:{type:GraphQLString}
                },
            })


const CategoryType = new GraphQLObjectType({
    name:'CategoryType',
        fields:{
            name:{type:GraphQLString},
            slug:{type:GraphQLString},
            Image:{type:ImageType},
            createdBy:{type:GraphQLString},
            updatedBy:{type:GraphQLString},
            CustomId:{type:GraphQLString}

        }
})



export const GetAllCategoryResolvers={
    type:new GraphQLList(CategoryType),
    resolve: async()=>{
        const Categories =await CategoryModel.find({})
        return Categories

    }
}