const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const express = require('express');
let router = express.Router();

const Workbook = require("./WorkbookModel");


router.get("/", loadCartPage);

router.put("/addToCart", cartCheck, addToCart);
router.put("/removeFromCart", cartCheck, removeFromCart);

//router.put("/add", addtoCart);



// loads the cart page 
function loadCartPage(req, res, next){

    if (!req.session.carts){
        res.status(401).render("../views/cart", {products: null, totalAll: 0, totCart: req.session.totCart});
        return;
    }



    console.log("loading cart page");
    getTotalPriceAll(req, res, next);
    res.status(200).render("../views/cart", {products: req.session.carts, totalAll: req.session.allTot, totCart: req.session.totCart});   
}



// checks if the user cart is empty
// if it is empty, cart will be initialized, if not, move on
function cartCheck(req, res, next){
    if (!req.session.carts){
        console.log("starting a newwwwwwwwwwww cart.");
        req.session.carts = [];
        req.session.allTot = 0;
    }

    next();
}



// adds item to the cart
function addToCart(req, res, next){
    console.log("prod: " + req.body.wbID);
    console.log("amount: " + req.body.amount);

    let prod = req.body.wbID;
    let amount = req.body.amount;

    if (amount === ""){
        amount = 1;
    }


    if (isNaN(amount)){
        res.status(400).send("There is a problem with this request. Item cannot be added.");
        return;
    }

    Workbook.findOne().where("_id").equals(ObjectId(prod)).exec(function(err, result){
        if (err){
            res.status(500).send("This item could not be added to your cart at this time. Sorry.");
            return;
        }
        if (!result){
            res.status(404).send("This item could not be added to your cart at this time. Sorry.");
            return;
        }

       // check if this item already exists in the cart
       if (isInCart(prod, req.session.carts)){
           let added = increaseProd(prod, parseInt(amount), req.session.carts);
            if (added){
                req.session.carts = added;
                getTotalPriceAll(req, res, next);
                res.status(200).render("../views/cart", {products: req.session.carts, totalAll: req.session.allTot, totCart: req.session.totCart});
                console.log("this is cart ahahahhahahah: " + req.session.carts);
                
                return;
            }else {
                console.log("this is cart: " + req.session.carts);
                res.status(500).send("false");
                return;
            }
       }else {
           // item in cart does not exist yet
            (req.session.carts).push({
                prod: prod,
                amount: parseInt(amount),
                title: result.Title,
                pic: result.PreviewPics[0],
                price: parseFloat(result.Price),
                total: (Math.round(parseFloat(result.Price) * amount *100) /100).toFixed(2)

            });
            console.log("pushed");
            console.log("this is cart: " + req.session.carts);
            getTotalPriceAll(req, res, next);
            res.status(200).render("../views/cart", {products: req.session.carts, totalAll: req.session.allTot, totCart: req.session.totCart});
       }
       
    });
}



// checks if the object/product is in the cart 
function isInCart(obj, arr){
    for (let i = 0; i < arr.length; i++){
        if (arr[i].prod === obj){
            console.log("already in cart");
            return true;
        }
    }
    console.log("not in cart");
    return false;
}


// inserts or increases the product amount by the given num
function increaseProd(obj, num, arr){
    for (let i = 0; i < arr.length; i++){
        if (arr[i].prod === obj){
            arr[i].amount += num;
            arr[i].total = (Math.round(arr[i].amount * arr[i].price *100) /100).toFixed(2);
            console.log("added the previous in.");
            return arr;
        }
    }
    return false;
}



function removeFromCart(req, res, next){
    console.log("prod: " + req.body.wbID);

    let prod = req.body.wbID;

    Workbook.findOne().where("_id").equals(ObjectId(prod)).exec(function(err, result){
        if (err){
            res.status(500).send("This item could not be removed from your cart at this time. Sorry.");
            return;
        }
        if (!result){
            res.status(404).send("This item could not be removed from your cart at this time. Sorry.");
            return;
        }

       // check if this item exists in the cart
       if (isInCart(prod, req.session.carts)){
           let newCart = removeFromArr(prod, req.session.carts);
           req.session.carts = newCart;
           getTotalPriceAll(req, res, next);
       }

       res.status(200).render("../views/cart", {products: req.session.carts, totalAll: req.session.allTot, totCart: req.session.totCart});

       
       
       
    });


}



function removeFromArr(obj, arr){
    let newArr = [];
    for (let i = 0; i < arr.length; i++){
        if (arr[i].prod != obj){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}




// calculates the total price for all items in cart
function getTotalPriceAll(req, res, next){
    if (req.session.carts === null){
        req.session.allTot = 0;
        return;
    }

    let tot = 0;
    let l = req.session.carts.length;
    let arr = req.session.carts;
    for (let i = 0; i < l; i++){
        tot += parseFloat(arr[i].total);
    }

    req.session.allTot =  (Math.round(tot *100) /100).toFixed(2);;
}







module.exports = router;