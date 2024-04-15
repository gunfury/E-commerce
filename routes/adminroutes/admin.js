const express= require("express");
const router= express.Router();
const multer = require('../../middleware/multer.js')
const adminSession=require("../../middleware/adminSession.js")


const{
    getAdminLogin,
    getAdminDash,
    getUserManagement,
    getProduct,
    getCartegoey,
    getDeletecategory,
    getAdminLogout,
    getEditCartegory,
    getAddCartegory,
    getAddproduct,
    getEditproduct,
    getDeleteproduct,
    getSoftDeleteProduct,
<<<<<<< HEAD
    getBlockUser,
    getOrderManagement,
    
    
=======
>>>>>>> 3d5b6b401923d1bcb94ae57e96308a3d8f6462e1

    ///postmethods
    postBlockUser,
    postAdminLogin,
    postAddcategory,
    postEditCartegory,
    postAddproduct,
    postEditproduct,
    postfetchOrderStatusUpdate,
    
   


}=require('../../controllers/admin/adminCtrl.js');

// \controllers\admin\adminCtrl.js

//const storage = multer.memoryStorage();

// get
router.get("/adminlogin",getAdminLogin);
router.get("/dashboard",adminSession,getAdminDash);
router.get("/userManagement",adminSession,getUserManagement);
router.get("/product",adminSession,getProduct);
router.get("/cartegories",adminSession,getCartegoey);
<<<<<<< HEAD
router.get("/deleteCategory/:categoryId",adminSession,getDeletecategory);
=======
router.get("/deleteCartegory/:categoryId",adminSession,getDeletecategory);
>>>>>>> 3d5b6b401923d1bcb94ae57e96308a3d8f6462e1
router.get('/logout',getAdminLogout);
router.get('/Category/:cartegoryId',adminSession,getEditCartegory);
router.get('/addCartegory',adminSession,getAddCartegory);
router.get('/addproduct',adminSession,getAddproduct);
router.get('/editProduct/:editId',adminSession,getEditproduct);
router.get('/deleteProduct/:id',adminSession,getDeleteproduct);
<<<<<<< HEAD
router.get('/softDeleteProduct/:id',adminSession,getSoftDeleteProduct);
router.get('/userblock/:id',adminSession,getBlockUser);
router.get('/order',getOrderManagement);


=======
router.get('/softDeleteProduct/:id',adminSession,getSoftDeleteProduct)
>>>>>>> 3d5b6b401923d1bcb94ae57e96308a3d8f6462e1


//post
router.post("/adminlogin",postAdminLogin);
<<<<<<< HEAD
=======
router.post("/userblock/:Id",postBlockUser);
>>>>>>> 3d5b6b401923d1bcb94ae57e96308a3d8f6462e1
router.post("/addcartegory",adminSession,postAddcategory);
router.post("/editDone/:Id",adminSession,postEditCartegory);
router.post("/productAdded",adminSession,multer,postAddproduct);
router.post('/editProductDone/:id',adminSession,multer,postEditproduct);
<<<<<<< HEAD
router.post('/orderStatusUpdate',postfetchOrderStatusUpdate);
=======
>>>>>>> 3d5b6b401923d1bcb94ae57e96308a3d8f6462e1


















module.exports =router;