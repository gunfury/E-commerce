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

    ///postmethods
    postBlockUser,
    postAdminLogin,
    postAddcategory,
    postEditCartegory,
    postAddproduct,
    postEditproduct,
    
   


}=require('../../controllers/admin/adminCtrl.js');

// \controllers\admin\adminCtrl.js

//const storage = multer.memoryStorage();

// get
router.get("/adminlogin",getAdminLogin);
router.get("/dashboard",getAdminDash);
router.get("/userManagement",getUserManagement);
router.get("/product",getProduct);
router.get("/cartegories",getCartegoey);
router.get("/deleteCartegory/:categoryId",getDeletecategory);
router.get('/logout',getAdminLogout);
router.get('/Category/:cartegoryId',getEditCartegory);
router.get('/addCartegory',getAddCartegory);
router.get('/addproduct',getAddproduct);
router.get('/editProduct/:editId',getEditproduct);
router.get('/deleteProduct/:id',getDeleteproduct);


//post
router.post("/adminlogin",postAdminLogin);
router.post("/userblock/:Id",postBlockUser);
router.post("/addcartegory",postAddcategory);
router.post("/editDone/:Id",postEditCartegory);
router.post("/productAdded",multer,postAddproduct);
router.post('/editProductDone/:id',multer,postEditproduct);


















module.exports =router;