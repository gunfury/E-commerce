const express=require('express');
const app=express();
const path= require("path");
const session=require('express-session');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');


app.use(bodyParser.urlencoded({ extended: true }));

const port=3001;
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("uploads"));
app.set("view engine", "ejs");
app.use(bodyParser.json());


//session

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }))

app.use(flash());
//mongoDB connecting


mongoose.connect('mongodb://localhost:27017/secureskull').then(()=>{
    console.log('mongodb had connected');
}).catch(()=>{
    console.log('mongodb is not connected')
})

//router
const userRouter=require("./routes/user");
app.use("/",userRouter);

const adminRouter=require("./routes/adminroutes/admin");
app.use("/",adminRouter);


//server

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})