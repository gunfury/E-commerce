const express=require("express");
const router= express();
const multer = require('multer');
const fs = require('fs');
const user=require('../../models/signupModel');
const cartegoryModel=require('../../models/admin/categoryModel');
const productMdl=require('../../models/admin/productModel');
const { log, Console } = require("console");
const flash = require('connect-flash');







                                    //GET METHODS
/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////// 


exports.getAdminLogin=(req,res)=>{
    const errorMessage="";
    res.render('admin/login',{errorMessage});
}



exports.getAdminDash=(req,res)=>{
    res.render('admin/dashboard');
}
exports.getUserManagement=async(req,res)=>{
    try{
    const users=await user.find();
    res.render('admin/userManagement',{users});
    } catch(error) {
        console.error("can't fetch the data");
        res.status(500).send('Internal Server Error');
    }
}

exports.getProduct=async(req,res)=>{
    try{
        const productModels=await productMdl.find();
        
        res.render('admin/products',{productModels});
    }catch (error){
        console.error("can't fetch the data");
        res.status(500).send('Internal Server Error');
    }
    
}
exports.getCartegoey=async(req,res)=>{
    try{
       
        const items=await cartegoryModel.find();
    res.render('admin/cartegory',{items});
    }catch(error) {
        console.error("can't fetch the data");
        res.status(500).send('Internal Server Error');
    }
}
exports.getDeletecategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    
    try {
        const category = await cartegoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Toggle the isBlocked field
        category.isBlocked = !category.isBlocked;

        await category.save();

       res.redirect("/cartegories")
    } catch (error) {
        console.error("Error blocking/unblocking category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getAdminLogout = (req, res) => {
    // Destroy the session
    
    delete req.session.admin 
            
            // Redirect to login page after logout
            res.redirect('/adminlogin');
     
}
exports.getEditCartegory=async(req,res)=>{
    const errorMessage=req.flash("errorMessage");
    const id=req.params.cartegoryId;
   
    const cartegory=await cartegoryModel.findOne({_id:id});
   console.log("cartegory",cartegory);
     
    res.render("admin/editCartegory",{cartegory,errorMessage:errorMessage});
}
exports.getAddCartegory=(req,res)=>{
    const errorMessage=req.flash("errorMessage");
    res.render("admin/addCartegory",{errorMessage:errorMessage});
}
exports.getAddproduct = async (req, res) => {
    try {
       
        const items = await cartegoryModel.find();
        const error="";
        res.render('admin/add-product', { items,error}); // Pass error message to EJS template
    } catch (err) {
        console.error('Error fetching items', err);
        res.status(500).send('Internal Server Error');
    }
}
exports.getEditproduct=async(req,res)=>{
    try{
    const editID=req.params.editId;
    const error="";
    const currentProductData=await productMdl.findOne({_id:editID})
    const cartegoryProductData=await cartegoryModel.find();
    res.render('admin/edit-product',{currentProductData,cartegoryProductData,error});
    }catch (err){
        console.error('Error fetching items', err);
        res.status(500).send('Internal Server Error');

    }
}
exports.getDeleteproduct=async(req,res)=>{

    try{
        const productId=req.params.id;
        console.log("productId",productId);
        const newProductDB =  await productMdl.deleteOne({_id:productId});
        console.log("newProductDB",newProductDB);

       // await newProductDB.save();
        res.redirect("/product");
       

    }catch(error){
        console.error("Error adding product:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.getSoftDeleteProduct=async(req,res)=>{
    try{
    const productId=req.params.id;
    console.log("productId",productId);
    const data=await productMdl.findById({_id:productId})
    console.log("data",data);
    data.isBlocked=!data.isBlocked;
    await data.save();
    res.redirect('/product')
    }catch(error){
        console.error("Error adding product:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}




                                    //POST METHODS
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


exports.postAdminLogin=(req,res)=>{
    const name='admin18@gmail.com';
    const password='8963';
    req.body;
    console.log(req.body);
    
    if(name===req.body.username&&password===req.body.password){
        req.session.admin = {
            username: req.body.username,
            password: req.body.password
        };
        console.log("adminSession",req.session.admin);
       return res.redirect('/dashboard');
    }else{
        if(!req.body){
            return res.render('admin/login',{errorMessage:'Please provide both username and password'});
         }
       return res.render('admin/login',{errorMessage:'Invalid user or password'});
    }
    
}
exports.postBlockUser=async(req,res)=>{
    const userId = req.params.Id;
     try{
        const User=await user.findById(userId);
        if(!User){
            return res.status(404).json({ message: "User not found" });
        }
        User.isBlocked=!User.isBlocked;
        await User.save();
        console.log('vghaca')
        res.redirect('/userManagement')
    }catch (error){
        console.error("Error blocking/unblocking user:", error);
        res.status(500).send("Internal Server Error");
    }
}
exports.postAddcategory = async (req, res) => {
    try {
        const { Category } = req.body;
        const data=req.body.Category;
        // Check if category already exists
        if (data.trim() === '' || /[a-z]/.test(data) || /\d/.test(data)|| /[!@#$%^&*(),.?":{}|<>]/.test(data)) {
            req.flash('errorMessage', 'Category name should not contain whitespace, lowercase letters, number or special characters');   
            return res.redirect(`/addCartegory`);
        }
        if(data.length > 15){
            req.flash('errorMessage', 'Category name should be lessthan or equal to 15 characters long');   
            return res.redirect(`/addCartegory`);
        }

        const existingCategory = await cartegoryModel.findOne({ Category: Category });
        if (existingCategory) {
            req.flash('errorMessage','Category already exists' );
            return res.redirect(`/addCartegory`);
        }
        // Create a new category document
        const newCategory = new cartegoryModel({ Category: Category });
        // Save the new category document to the database
        await newCategory.save();
        console.log("Category saved successfully");
        res.redirect("/cartegories");
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ success: false, error: 'An error occurred while adding the category. Please try again later.' });
    }
};
exports.postEditCartegory=async(req,res)=>{
   try{
    const dataId=req.params.Id;
    const data=req.body.NewCategory;
    console.log("data",data);
    console.log("dataFromGet",dataId);
    const dataFromDb=await cartegoryModel.findOne({_id:dataId});
    console.log("dataFromDb",dataFromDb);
    if (data.trim() === '' || /[a-z]/.test(data) || /\d/.test(data)|| /[!@#$%^&*(),.?":{}|<>]/.test(data)) {
        req.flash('errorMessage', 'Category name should not contain whitespace, lowercase letters, number or special characters');
        return res.redirect(`/Category/${dataId}`);
    }
    if(data.length > 15){
        req.flash('errorMessage', 'Category name should be lessthan or equal to 15 characters long'); 
        return res.redirect(`/Category/${dataId}`);
    }
    if(req.body===data){
        req.flash('errorMessage','no change have made' );
            return res.redirect(`/Category/${dataId}`);

    }
    const existingCategory = await cartegoryModel.findOne({ Category: data });
        if (existingCategory&&!req.body===data) {
            req.flash('errorMessage','Category already exists' );
            return res.redirect(`/Category/${dataId}`);
        }
    dataFromDb.Category=data;
    const items=null;
    await dataFromDb.save();
    res.redirect("/cartegories");
   }catch(err){
    console.log(err)
   }
};

exports.postAddproduct = async (req, res) => {
    try {
        // Extract necessary data from request body
        const items = await cartegoryModel.find();
        const { productName, description, cartegory, discount, stock, price } = req.body;

        if (!productName || !description || !cartegory || !discount || !stock || !price) {
            return res.render('admin/add-product', { items,error: "All fields are required" });
        }
        // Function to check if a string starts with a capital letter
        function startsWithCapital(str) {
            return str.charAt(0) === str.charAt(0).toUpperCase();
        }
        if (!startsWithCapital(productName)) {
            return res.render('admin/add-product', { items, error: "Product name must start with a capital letter" });
        }
        if ( /^\s/.test(productName)) {
            return res.render('admin/add-product', { items, error: "Product name must start with a capital letter and cannot begin with white space" });
        }
        if (isNaN(discount) || isNaN(stock) || isNaN(price) || discount < 0 || stock < 0 || price < 0 || discount >= 100) {
            return res.render('admin/add-product', { items, error: "Discount must be a non-negative number less than 100, and stock and price must be non-negative numbers" });
        }
        let productImages = [];
        // Map uploaded files to file URLs
        if (req.files && req.files.length > 0) {
            const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
            productImages = fileUrls;
        } else {
            return res.render('admin/add-product', { items, error: "Please upload the images" });
        }
       
        // Create a new product object with details and images
        const newProduct = new productMdl({
            productName: req.body.productName,
            cartegory: req.body.cartegory,
            description: req.body.description,
            images: productImages,
            stock: req.body.stock,
            price: req.body.price,
            discount: req.body.discount
        });

        // Save the new product to the database
        await newProduct.save();

        console.log('Product added successfully:', newProduct);
        res.redirect('/product');
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
exports.postEditproduct=async(req,res)=>{
    try{
        const { productName, description, cartegory, discount, stock, price } = req.body;
        const productId=req.params.id
        console.log("product ID in editing",productId);
       
        const currentProductData=await productMdl.findOne({_id:productId})

        const cartegoryProductData=await cartegoryModel.find();
        if (!productName || !description || !cartegory || !discount || !stock || !price) {
            return res.render('admin/edit-product', { currentProductData,cartegoryProductData,error: "All fields are required" });
        }
        // Function to check if a string starts with a capital letter
        function startsWithCapital(str) {
            return str.charAt(0) === str.charAt(0).toUpperCase();
        }
        if (!startsWithCapital(productName)) {
            return res.render('admin/edit-product', { currentProductData, cartegoryProductData,error: "Product name must start with a capital letter" });
        }
        if (isNaN(discount) || isNaN(stock) || isNaN(price) || discount < 0 || stock < 0 || price < 0 || discount >= 100) {
            return res.render('admin/edit-product', { currentProductData, cartegoryProductData, error: "Discount must be a non-negative number less than 100, and stock and price must be non-negative numbers" });
        }


        let productImages = [];

        if (req.files && req.files.length > 0) {
           const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
            productImages = fileUrls;
        }


        console.log("product images in editing",productImages);
        
        await productMdl.findByIdAndUpdate(productId, {
            productName: req.body.productName,
            cartegory: req.body.cartegory,
            description: req.body.description,
            images: productImages,
            stock: req.body.stock,
            price: req.body.price,
            discount:req.body.discount 
          }).then((pass) => {
            console.log("UpdatedProduct", pass);
            res.redirect("/product");
          });
    }catch(error){
        console.error("Error adding product:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}







