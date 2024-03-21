const mongoose = require('mongoose');




const productSchema=new mongoose.Schema({
    
    productName:{
        type:String
    },
    cartegory:{
        type:String
    },
    description:{
        type:String
    },
    images: {
        type:[String]

    },

    stock:{
        type:String
    },
    price:{
        type:String
    },
    discount:{
        type:String
    },
    action:{
        type:String
    }

});

module.exports=mongoose.model("product",productSchema);