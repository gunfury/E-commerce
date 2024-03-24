const mongoose = require('mongoose')

const signupSchema= new mongoose.Schema({ 
    username:{
        type:String,

    },
    email:{
        type:String,
       

    },
    password:{
        type:String,
       

    } ,
    images: {
        type:[String]
    },
    isBlocked:{
        type:Boolean,
        default:false
    }  
})


module.exports = mongoose.model("Users",signupSchema)