const express=require("express");
const router= express();
const signupcollection=require('../models/signupModel');
const flash = require('connect-flash');
const multer = require('multer');
const fs = require('fs');
const addressMdl=require('../models/addressMdl');
const productMdl=require('../models/admin/productModel');
const cartMdl=require('../models/cartModel');
const orderModel=require('../models/orderModel');
const { log } = require("console");



exports.getUserProfile=async(req,res)=>{
    try{
        const userId=req.session.user;
        const userData=await signupcollection.findById({_id:userId})
        const errorMessage=req.flash("errorMessage");
        
    res.render('user/profile',{userData,errorMessage:errorMessage});
    }catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
}
exports.getUserAddress=async(req,res)=>{
    try{
    const userSessionId=req.session.user;
    const addressData = await addressMdl.find({ userID: userSessionId });
    res.render('user/address',{addressData});
    }catch(error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
}

exports.getcheckout=async(req,res)=>{
    try {
        const userId=req.session.user;
        const address=await addressMdl.find({userID:userId})
        const currentCart=await cartMdl.find({userid:userId})
        res.render('user/checkout',{currentCart,address});
        
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
   
}



exports.getUserCart = async (req, res) => {
    try {
        const userId = req.session.user;
        console.log("User ID is getting:", userId);
        // Assuming cartMdl is a Mongoose model for the cart
        const cartData = await cartMdl.find({ userid: userId });
        //console.log("Cart Data:", cartData);

        let totalPrice = 0;
        let allItemsInStock = true;

        // Iterate over cartData instead of cart
        for (const item of cartData) {
            // Assuming productMdl is a Mongoose model for products
            const product = await productMdl.findById(item.productid);
            console.log('product', product);

            // Handle case where product is not found
            if (!product) {
                console.log(`Product not found for item with product ID: ${item.productid}`);
                continue; // Skip this item and move to the next one
            }

            console.log(`Product in cart: ${JSON.stringify(product)}`);

            // Convert price and quantity to numbers
            const price = parseFloat(product.price);
            const quantity = parseFloat(item.quantity);

            if (!isNaN(price) && !isNaN(quantity) && product.stock >= quantity) {
                let itemTotalPrice = price * quantity;
                totalPrice += itemTotalPrice;
            } else {
                allItemsInStock = false;
                console.log(`Product with ID: ${item.productid} is out of stock or invalid quantity.`);
            }
        }

        console.log("total price", totalPrice);
        
        
       
        // Pass additional data to the template if needed
        res.render('user/cart', { cartData, totalPrice, allItemsInStock });

    } catch (error) {
        console.error("Error retrieving user cart:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.getChangeUSerName=async(req,res)=>{
    try {
        const errorMessage=req.flash("errorMessage");
        const sessionId=req.session.user;
        const userDetails=await signupcollection.findById({_id:sessionId}) ;
        console.log('userDetails',userDetails);
        res.render('user/changeUserName',{userDetails,errorMessage})
    } catch (error) {
        console.error("Error retrieving user cart:", error);
        res.status(500).send("Internal Server Error");
    }
}
exports.getChangeUserPassword=async(req,res)=>{
    try {
        const errorMessage=req.flash("errorMessage");
        res.render('user/changeUserPassword',{errorMessage})
        
    } catch (error) {
        
    }
}
exports.getSuccesspage=(req,res)=>{
    res.render('user/successpage');
}



exports.getUserOrder = async (req, res) => {
    try {
        const userdata = req.session.user;
        const page = parseInt(req.query.page)||1;
        
        const limit = 4; // Number of documents per page

        const totalCount = await orderModel.countDocuments({ userId: userdata });
        const totalPages = Math.ceil(totalCount / limit);
        const skip = (page - 1) * limit;
       

        const orderData = await orderModel.find({ userId: userdata })
                                          .sort({ orderDate: -1 })
                                          .skip(skip)
                                          .limit(limit);

        res.render('user/userOrder', { orderData, totalPages, currentPage: page });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).send("Internal Server Error");
    }
}


exports.getdownloadInvoice=async(req,res)=>{
    try {
        const orderId=req.params.id;
        const order=await orderModel.findById({_id:orderId});
        console.log("order",order);
        res.render('user/orderDetails',{order})
        
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).send("Internal Server Error");
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.posteditprofile = async (req, res) => {
    try {
        const { editedUserName, editPassword, editConfirmPassword} = req.body;
         const image=req.file;
         console.log("image",image)
     

        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (editedUserName.trim() !== editedUserName) {
            return res.json({ errorMessage: "Username should not start with whitespace" });
        } else if (!strongPasswordRegex.test(editPassword)) {
            return res.json({ errorMessage: "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
        } else if (editPassword !== editConfirmPassword) {
            return res.json({ errorMessage: "Passwords do not match" });
        } else if (specialCharsRegex.test(editedUserName)) {
            return res.json({ errorMessage: "Username should not contain special characters" });
        } else {
            const userId = req.session.user;
            console.log("editid", userId);
            let updateUser = await signupcollection.findByIdAndUpdate(userId, {
                username: editedUserName,
                password: editPassword,
                
            }).then((pass) => {
                console.log("updateUser",updateUser);
                return res.json({ errorMessage: null });
              }); // To return the modified document
        
           
        }
     
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
}
exports.postUserCart=async(req,res)=>{
    try{
        const userID=req.session.user;
        const currentProductID=req.params.currentProductID;
        const product=await productMdl.findById({_id:currentProductID});
        const cartData = {
            userid: userID,
            productid: currentProductID,
            product: product.productName,
            price: product.price,
            description:product.description,
            quantity: 1,
            stock:product.stock,
            category:product.cartegory,
            image: product.images[0],
           
          };
          const cartProduct = await cartMdl.findOne({ productid: currentProductID, userid: userID });
          console.log("cartProduct",cartProduct);
          let TotalPrice=0;

         
  
      if (cartProduct) {
        const newQuantity = cartProduct.quantity + 1;
        await cartMdl.updateOne({ _id: cartProduct._id }, { $set: { quantity: newQuantity } });
        console.log("Cart updated successfully");
  
      } else {
        await cartMdl.create(cartData);
  
        console.log("Cart added successfully");
      }
      res.redirect('/cart')
  
        
}
catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
}

}


exports.postCartUpdateQuantity=async(req,res)=>{
    try{
        const updateQuanity=req.body.newValue;
        const cartid=req.body.productId;
        const updatedCart=await cartMdl.findById({_id:cartid});

        updatedCart.quantity=updateQuanity;
         await updatedCart.save();


         return res.status(200).json({ success: true, message: "Quantity updated successfully"});

         console.log("updatedCart",updatedCart);

   
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
    

}

exports.postCartRemove=async(req,res)=>{
    try{
        const cartId=req.params.id;
        
        await cartMdl.findByIdAndDelete({_id:cartId});
        res.redirect('/cart')


    }catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
}

exports.postAddAddress=async(req,res)=>{
    try{
    const { userName,address,city,state,zipcode,phone,country }=req.body;
    const userId=req.session.user;
    const existingAddress = await addressMdl.findOne({ userID: userId, address: address });
    
    if (existingAddress) {
        return res.json({ errorMessage: "Address already exists" });
    }

    if (!userName || typeof userName !== 'string') {
        return res.json({ errorMessage: "Invalid userName"});
    }
    if (!address || typeof address !== 'string') {
        return res.json({ errorMessage: "Invalid address"});
    }
    if (!city || typeof city !== 'string') {
        return res.json({ errorMessage: "Invalid city"});
    }
    if (!state || typeof state !== 'string') {
        return res.json({ errorMessage: "Invalid state"});
    }
    if (!zipcode || typeof zipcode !== 'string' || !/^\d{5}(?:-\d{4})?$/.test(zipcode)) {
        return res.json({ errorMessage: "Invalid zipcode. Zipcode must be in format: XXXXX or XXXXX-XXXX"});
    }
    if (!phone || typeof phone !== 'string' || !/^\d{10}$/.test(phone)) {
        return res.json({ errorMessage: "Invalid phone number. Phone number must be 10 digits without any special characters."});
    }
    if (!country || typeof country !== 'string') {
        return res.json({ errorMessage: "Invalid country"});
    }

    const newAddress=await addressMdl({
        userName:userName,
        userID:userId,
        address:address,
        city:city,
        state:state,
        zipCode:zipcode,
        country:country,
        phone:phone
    })
    
    await newAddress.save();    
    
       
     return res.json({})
   
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }

}


exports.posteditAddress=async(req,res)=>{
    try {
        const id=req.params.id;
        console.log("addressid",id);
        const addresscurrent= req.body.editedAddress
        console.log("addresscurrent",addresscurrent);
        const addressmdl=await addressMdl.findById({_id:id})
        console.log('addressmdl',addressmdl);

    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: 'Internal server error' });
    }
}


exports.postDeleteAddress=async(req,res)=>{

    console.log("postdelete is working")
    try{
        const addressId=req.params.id;
        console.log("addressId",addressId);
        await addressMdl.findByIdAndDelete({_id:addressId});
        console.log('addressMdl',addressMdl);
        res.redirect('/address');

    }catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
}

exports.postupdateUserName = async (req, res) => {
    try {
        const UpdatedUserName = req.body.userName;
        console.log("UpdatedUserName", UpdatedUserName);
        const user = await signupcollection.findById(req.session.user);

        
        // Validation
        const containsWhitespace = /^\s/.test(UpdatedUserName);
        const containsNumbers = /\d/.test(UpdatedUserName);
        const containsSpecialChars = !/^[a-zA-Z0-9]+$/.test(UpdatedUserName);

        if (containsWhitespace || containsNumbers || containsSpecialChars) {
            let errorMessage = '';
            if (containsWhitespace) {
                errorMessage = 'Name should not start with whitespace.';
            }
            if (containsNumbers) {
                errorMessage += ' Name should not contain numbers.';
            }
            if (containsSpecialChars) {
                errorMessage += ' Name should not contain special characters.';
            }
            req.flash('errorMessage', errorMessage);
            res.redirect('/changeUserName');
        } else {
            user.username = UpdatedUserName;
            await user.save();
            res.redirect('/userProfile');
        }
    } catch (error) {
        console.error("Error during username update:", error);
        res.status(500).send("Internal Server Error");
    }
}
exports.postupdateUserPassword = async (req, res) => {
    try {
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        const currentUser = await signupcollection.findById(req.session.user);

        if (!currentUser) {
            req.flash('errorMessage', 'User not found');
            return res.redirect('/changeUserPassword');
        }

        // Verify current password
        if (currentPassword !== currentUser.password) {
            req.flash('errorMessage', 'Current password is incorrect');
            return res.redirect('/changeUserPassword');
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            req.flash('errorMessage', 'New password and confirm password do not match');
            return res.redirect('/changeUserPassword');
        }

        // Check if new password meets strength requirements
        const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
            req.flash('errorMessage', 'Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            return res.redirect('/changeUserPassword');
        }
        if(currentPassword===newPassword){
            req.flash('errorMessage', 'New password and current password are same');
            return res.redirect('/changeUserPassword');

        }

        // Update password
        currentUser.password = newPassword;
        await currentUser.save();
        
        req.flash('successMessage', 'Password updated successfully');
        return res.redirect('/userProfile');
    } catch (error) {
        console.error("Error during password update:", error);
        req.flash('errorMessage', 'Internal Server Error');
        res.status(500).send("Internal Server Error");
    }
}

exports.postcheckaddAddress=async(req,res)=>{
    try {
        const userId=req.session.user;
        const {userName,address,city,state,zipcode,phone,country}=req.body;
        const addressdata={
            userName:userName,
            userID:userId,
            address:address,
            city:city,
            state:state,
            zipcode:zipcode,
            phone:phone,
            country:country
        }
        const result = await addressMdl.create(addressdata);
        return res.redirect('/checkout')

        
    } catch (error) {
        console.error("Error during username update:", error);
        res.status(500).send("Internal Server Error");
        
    }
}


exports.postcheckoutform = async (req, res) => {
    try {
        const user = req.session.user;
        const cart = await cartMdl.find({ userid: user });
        console.log("cart", cart);
        const payment = req.body.paymentMethod;
        console.log("payment", payment);
        const address = req.body.address;
        const addressdata = await addressMdl.findById({ _id: address });
        console.log("addressdata", addressdata);

        const products = [];

        // Loop through each item in the cart
        for (const item of cart) {
            products.push({
                productId: item.productid,
                productName: item.product,
                productDescription: item.description,
                productRating: null,
                stockCount: parseInt(item.stock), // Corrected field name
                productImage: item.image,
                quantity: item.quantity,
                price: item.price,
                status: "Pending",
                reason: "aaaaaaaa",
                couponCode: null,
                referralCode: null, // Corrected field name
            });
        }

        const orderData = {
            orderNumber: Math.floor(100000 + Math.random() * 900000),
            userId: user,
            products: products,
            totalQuantity: products.reduce((total, product) => total + product.quantity, 0),
            totalPrice: products.reduce((total, product) => total + (product.price * product.quantity), 0),
            address: {
                address: addressdata.address,
                city: addressdata.city,
                state: addressdata.state,
                country: addressdata.country,
                zipcode: addressdata.zipCode,
                phone: addressdata.phone,
            },
            discountPrice: null,
            paymentMethod: payment,
            orderDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        };

        console.log("orderData", orderData);
        const orderDetails = await orderModel.create(orderData);
        console.log("orderDetails", orderDetails); // Corrected variable name
        await cartMdl.deleteMany({ userid: user });


        const productDataInCollection = await productMdl.find();
        console.log("productDataInCollection",productDataInCollection);
const minusQuantityPromises = cart.map(async (item) => {
    const productToUpdate = productDataInCollection.find(product => product._id.toString() === item.productid.toString());
    console.log("productToUpdate",productToUpdate);
    if (productToUpdate) {
        console.log(`Processing product ${item.productid} with current stock count ${productToUpdate.stockCount} and quantity to decrease ${item.quantity}`);
        if (productToUpdate.stockCount >= item.quantity) {
            await productMdl.updateOne(
                { _id: item.productid },
                { $inc: { stockCount: -item.quantity } }
            );
            console.log(`Stock updated for product ${item.productid}. New stock count: ${productToUpdate.stockCount - item.quantity}`);
        } else {
            console.log(`Insufficient stock for product ${item.productid}. Current stock: ${productToUpdate.stockCount}, requested quantity: ${item.quantity}`);
        }
    } else {
        console.log(`Product ${item.productid} not found in the collection.`);
    }
});
await Promise.all(minusQuantityPromises);


        res.render('user/successpage');

    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.postRemoveProductFromOrder=async(req,res)=>{
    try {
        const CancelproductID=req.params.id;
        const orderId=req.params.orderId;
        console.log('orderId',orderId);
        console.log("productID",CancelproductID);
        const statusUpdatedOrderModel = await orderModel.findOneAndUpdate(
            { _id: orderId, "products.productId": CancelproductID },
            { $set: { "products.$.status": "canelled" } }, // $ refers to the matched array element
            { new: true }
        );
        console.log("statusUpdatedOrderModel",statusUpdatedOrderModel);
        res.redirect('/userOrder')
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).send("Internal Server Error");
    }
   
}
exports.postReturnProduct=async(req,res)=>{
    try {
        const CancelproductID=req.body.productId;
        const orderId=req.body.orderId;
        const newStatus=req.body.returnProduct;
        console.log("newStatus",newStatus);
        const statusUpdatedOrderModel = await orderModel.findOneAndUpdate(
            { _id: orderId, "products.productId": CancelproductID },
            { $set: { "products.$.status":'returned' } }, // $ refers to the matched array element
            { new: true }
        );
        res.redirect('/userOrder')
        
        
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).send("Internal Server Error");
    }
}

