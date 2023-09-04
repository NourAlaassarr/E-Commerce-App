
import { Schema,model } from "mongoose";
import pkg from 'bcrypt'
import {SystemRules}from'../../src/utils/SystemRules.js'
const UserSchema = new Schema({
userName:{
    type:String,
    required:true,
    lowercase:true,
    rim:true,

},
phone:{
    required:true,
    type:String,
    Unique:true,
},
FirstName:String,
LastName:String,
Age:Number,
email:{
    type:String,
    Unique:true,
    required:true,
},
Password:{
    required:true,
    type:String,
},
Cpassword:{
    required:true,
    type:String,
},
Address:[{
type:String,
required:true
},
],
role:{
    type:String,
    lowercase:true,
    enum:[SystemRules.User,SystemRules.Admin,SystemRules.Super],
    default:SystemRules.User,
},
gender:{
    type:String,
    lowercase:true,
    enum:['female','male','not specified'],
    default:'not specified',
},
isConfirmed:{
    type:Boolean,
    required:true,
    default:false
},
ProfilePic:{
    public_id:String,
    secure_url:String
},
CoverPic:[{
    public_id:String,
    secure_url:String
}],
status:{
    type:String,
    default:'Offline',
    enum:['Online','Offline']
},
isDeleted:{
    type:Boolean,
    default:false,
},
token:{
    type:String,
},
Code:{
    type:String,
    default:null
},
ChangePassAt:{
    type:Date
},

},
{timestamps:true})

//Hooks
UserSchema.pre("save",function(next,hash){
    this.Password=pkg.hashSync(this.Password,+process.env.SALT_ROUNDS)
    this.Cpassword=this.Password
    next()
})

export const UserModel=model('user',UserSchema)