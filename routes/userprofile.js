const express= require("express");
const router= express.Router();
const userSession=require('../middleware/usersession');
const multer=require('../middleware/multer');



const {
getUserProfile,
getUserAddress,
getEditAddress,
getUserCart,
getcheckout,
getChangeUSerName,
getChangeUserPassword,
getSuccesspage,
getUserOrder,
getdownloadInvoice,

postUserCart,
posteditprofile,
postAddAddress,
posteditAddress,
postCartUpdateQuantity,
postCartRemove,
postDeleteAddress,
postupdateUserName,
postupdateUserPassword,
postcheckaddAddress,
postcheckoutform,
postRemoveProductFromOrder,
postReturnProduct,

}=require("../controllers/userProfileCtrl");

router.get('/userProfile',multer,userSession,getUserProfile)
router.get('/address',userSession,getUserAddress)
router.get('/cart',userSession,getUserCart)
router.get('/checkout',userSession,getcheckout)
router.get('/changeUserName',getChangeUSerName)
router.get('/changeUserPassword',getChangeUserPassword)
router.get('/successpage',getSuccesspage)
router.get('/userOrder/:page',getUserOrder)
router.get('/downloadInvoice/:id',getdownloadInvoice)






router.post('/edit-profile',multer,userSession,posteditprofile);
router.post('/addAddress',userSession,postAddAddress);
router.post('/editAddress/:id',posteditAddress)
router.post('/addcart/:currentProductID',userSession,postUserCart);
router.post('/update_quantity',userSession,postCartUpdateQuantity);
router.post('/cartRemove/:id',postCartRemove);
router.post('/deleteAddress/:id',postDeleteAddress);
router.post('/updateUserName',postupdateUserName);
router.post('/updateUserPassword',postupdateUserPassword);
router.post('/checkaddAddress',postcheckaddAddress);
router.post('/checkoutform',postcheckoutform);
router.post('/removeProductFromOrder/:id/:orderId',postRemoveProductFromOrder);
router.post('/returnproduct',postReturnProduct)




module.exports =router;