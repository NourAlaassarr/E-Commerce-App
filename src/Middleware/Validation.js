import joi from 'joi'
const reqMethods = ['body','query','headers','file','files']

const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.error('any.invalid');
    }
    return value;
}
export const ValidationCoreFunction =(schema)=>{
    return(req,res,next)=>{
        const ValidationErrArray=[]
        for(const key of reqMethods){
            if(schema[key])
            {
                const ValidateResults = schema[key].validate(req[key],{
                    abortEarly:false,
                })
                if(ValidateResults.error)
                {
                    ValidationErrArray.push(ValidateResults.error.details)
                }
            }
        }

        if (ValidationErrArray.length) {
            return res
            .status(400)
            .json({ message: 'Validation Error', Errors: ValidationErrArray })
        }
    
        next()
        } 
    
}