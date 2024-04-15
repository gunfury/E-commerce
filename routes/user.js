
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
<<<<<<< HEAD
getproductDetails,
getUserProfile,
getUserAddress,
=======
>>>>>>> 3d5b6b401923d1bcb94ae57e96308a3d8f6462e1




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
<<<<<<< HEAD
router.get('/userSideProduct/:sortType',userSession,getuserSideProduct)
router.get('/showproductdetails/:id',userSession,getproductDetails)

=======
router.get('/userSideProduct',userSession,getuserSideProduct)
>>>>>>> 3d5b6b401923d1bcb94ae57e96308a3d8f6462e1





//post methods
router.post('/otp',postOtp);
router.post('/signup',postsignup)
router.post('/',postlogin);


module.exports =router;