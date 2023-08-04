import multer from 'multer'

import {allowedExtensions}from'../utils/allowedExtensions.js'

export const CloudFunction = (allowdExtentionsArr)=>{

const storage = multer.diskStorage({})

const filefilter = function(req,file,cb){
    if(allowdExtentionsArr.include(file.mimetype))
    {
        return cb (null,true)
    }
    cb(new Error ('invalid extentions'),false)
}

const fileUploads = multer({ filefilter,storage
})
return fileUploads

}
