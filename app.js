const express=require('express');
const app=express();
const path= require("path");
const session=require('express-session');
const mongoose=require('mongoose');

const bodyParser = require('body-parser');
const flash = require('connect-flash');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));

const port=process.env.PORT;
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads',express.static(__dirname+"/uploads"));
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

const mongoURl=process.env.MONGODB_URI;
<<<<<<< HEAD
mongoose.connect(mongoURl)
=======
mongoose.connect(mongoURl, { useNewUrlParser: true, useUnifiedTopology: true })
>>>>>>> 3d5b6b401923d1bcb94ae57e96308a3d8f6462e1
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

//router
const userRouter=require("./routes/user");
app.use("/",userRouter);

const adminRouter=require("./routes/adminroutes/admin");
app.use("/",adminRouter);

const userProfile=require("./routes/userprofile");
app.use("/",userProfile);


//server

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})