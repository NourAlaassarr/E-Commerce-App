
export const asyncHandler =(Api)=>{
    return (req,res,next)=>{
        Api(req,res,next).catch((err)=>{
            console.log(err)
            return next (new Error('FAIL',{cause:500}))
        })

    }
}

export const GlobalResponse =(err,req,res,next)=>
{
    if(err)
    {
        return res.status(err['cause'] || 500).json({Message:err.message})
    }
}