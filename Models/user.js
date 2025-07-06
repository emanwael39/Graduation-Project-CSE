
const mongoose =require('mongoose')
const jwt =require('jsonwebtoken')
const validator =require('validator')
const bcrypt =require("bcryptjs");
// require("../Models/product")
const userSchema = new mongoose.Schema ( {
    username : {
        type: String,
        required : true,
        trim : true,
    },
    LastName :{
        type: String,
        required : true,
        trim : true,
    },
    password : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 8,
        validate(value){
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!password.test(value)){
                throw new Error("Password must include uppercase , lowercase , numbers , speacial characters")
            }
        }

    },
    email : {
        type: String,
        required: true,
        trim: true,
        lowercase : true,
        unique: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error ('Email is INVALID')
            }
        }
    },
    
    tokens : [
        {
            type: String,
            required : true
        }
    ],
    tasks : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Task"
        }
    ],
    errors :[
       {
        type: String,
       }
    ]
})

userSchema.virtualpath('tasks' , {
    ref: 'Task',
    localField : "_id",
    foreignField :"owner",
    
 }) 

 userSchema.virtualpath("Task2O", {
    ref :"Task2O",
    localField :"_id",
    foreignField :"owner"
 })
 
// userSchema.pre("save" ,async function(next){
//     const user =this;
//     if(user.isModified('password')){
//        user.password=await bcrypt.hash(user.password, 10)
//     }
//     user.password=await bcrypt.hash(user.password, 10)
//     next();
// })


// login 

// userSchema.statics.findByCredentials = async (em,pass) =>{
  
//     const user = await User.findOne({email:em})
//     if(!user){
//         throw new Error('Unable to login')
//     }
   
//     const isMatch = await bcryptjs.compare(pass,user.password)
  
//     if(!isMatch){
//         throw new Error('Unable to login')
//     }
//     return user
// }

userSchema.methods.generateToken = async function () {

    const user = this 
    const token = jwt.sign ({_id:user._id.toString() } , process.env.ACCESS_TOKEN_SECRET)
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
 }

// //////////////////////////////////////////////////


const User =mongoose.model('User' ,userSchema)
module.exports=User;