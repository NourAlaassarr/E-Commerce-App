import cloudinary from "./CloudinaryConfig.js"
export const asyncHandler =(Api)=>{
    return (req,res,next)=>{
        Api(req,res,next).catch(async(err)=>{
            console.log(err)
            if(req.imagePath)
            {await cloudinary.api.delete_resources_by_prefix(req.imagePath)
                await cloudinary.api.delete_folder(req.imagePath)
            }
            return next (new Error('FAIL',{cause:500}))
        })

    }
}

export const GlobalResponse =(err,req,res,next)=>
{
    if(err)
    {
        if(req.ValidationErrArray)
        {
            return res.status(err['cause'] || 400).json({Message:req.ValidationErrArray})
        }
        return res.status(err['cause'] || 500).json({Message:err.message})
    }
}