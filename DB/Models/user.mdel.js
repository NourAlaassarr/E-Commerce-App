import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema ({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    phone:{
        required:true,
        type:String,
        Unique:true,

    },
    email:{
        required:true,
        type:String,
        Unique:true,
        lowercase:true,

    },
    password:{
        required:true,
        type:String,

    },
    Cpassword:{
        required:true,
        type:String,

    },
    FirstName: String, 
    LastName:String,
    Age:Number,

    gender:{
        type:String,
        lowercase:true,
        enum:['female','male','not specified'],
        default:'not specified',
    },
    role:{
        type:String,
        lowercase:true,
        enum:['user','admin'],
        default:'user',
    },
    Code:{
        type:String,
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },

    isOnline:{
        type:Boolean,
        default:false,
    },
    isConfirmed:
    {
        type:Boolean,
        default:false},
        ProfilePic:{
            public_id:String,
            secure_url:String
        },
        CoverPic:[{
            public_id:String,
            secure_url:String
        },
        ],
        token:{
            type:String,
        },
        ChangePassAt:{
            type:Date
        },
},{
    timestamps:true,
})

export const UserModel=mongoose.model('user',UserSchema)