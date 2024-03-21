
const express= require("express");
const router= express.Router();
const userSession=require('../middleware/usersession');




const {
getlogin,
getsignup,
gethomepage,
getotp,
getresendotp,
getuserlogout,
postOtp,
postsignup,
postlogin

}=require("../controllers/userCtrl");


//get methods
router.get('/',getlogin);
router.get('/signup',getsignup);
router.get('/home',gethomepage);
router.get('/otp',getotp);
router.get('/resend',getresendotp);
router.get('/userlogout',userSession,getuserlogout)





//post methods
router.post('/otp',postOtp);
router.post('/signup',postsignup)
router.post('/',postlogin);


module.exports =router;