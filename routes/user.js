
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
getuserSideProduct,




postOtp,
postsignup,
postlogin

}=require("../controllers/userCtrl");


//get methods
router.get('/',getlogin);
router.get('/signup',getsignup);
router.get('/home',userSession,gethomepage);
router.get('/otp',getotp);
router.get('/resend',getresendotp);
router.get('/userlogout',userSession,getuserlogout)
router.get('/userSideProduct',userSession,getuserSideProduct)





//post methods
router.post('/otp',postOtp);
router.post('/signup',postsignup)
router.post('/',postlogin);


module.exports =router;