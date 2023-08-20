import { paginationFunction } from "./pagination.js"

export class ApiFeature {
    constructor(mongooseQuery,queryData)
    {
        this.mongooseQuery=mongooseQuery
        this.queryData=queryData
    }
    //pagination
    pagination(){
        const{page,size}=this.queryData
        const{limit,skip}=paginationFunction({page,size})
        this.mongooseQuery.limit(limit).skip(skip)
    }
    //sort
sort(){
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',',' '))
    return this
}
    //select
select(){
    // const Select=await ProductModel.find().select(req.query.select.replaceAll(',',' '))

    this.mongooseQuery.select(this.queryData.select?.replaceAll(',',' '))
    return this
}
    //filters
    filter(){
const queryInstance={...this.queryData}
const execuldeKeysArr = ['page', 'size', 'sort', 'select', 'search']
execuldeKeysArr.forEach((key) => delete queryInstance[key])
const querystring=JSON.parse(JSON.stringify(queryInstance).replace(/gt|gte|lt|lte|in|nin|eq|neq|regex/g,(match) => `$${match}`,))
this.mongooseQuery.find(querystring)
return this
    }
}