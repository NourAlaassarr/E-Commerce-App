

import{GraphQLList, GraphQLObjectType, GraphQLString}from'graphql'


export const ImageType= new GraphQLObjectType({

    name:'imageType',
    fields:{
        secure_url:{type:GraphQLString},
        public_id:{type:GraphQLString}
    },
})


export const CategoryType = new GraphQLObjectType({
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