const express = require('express');
const fs = require("fs");
const https = require("https");
const mongoose = require('mongoose');
const pug = require('pug');

const ObjectId = require('mongodb').ObjectID;




let app = express();

const session = require('express-session');
app.use(session({ secret: 'some secret key here'}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'pug');
app.use(express.static("public"));




mongoose.connect('mongodb://localhost/eeWB', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


let pageRouter = require("./page-router");
app.use("/pages", pageRouter);

let workbookRouter = require("./workbook-router");
app.use("/workbooks", totCartItems, workbookRouter);

let worksheetRouter = require("./worksheet-router");
app.use("/worksheets", worksheetRouter);

let adminRouter = require("./admin-router");
app.use("/admin", adminRouter);


let cartRouter = require("./cart-router");
app.use("/cart", totCartItems, cartRouter);

db.once('open', function(){
    https.createServer({
        key: fs.readFileSync("eeWebsite.key"),
        cert: fs.readFileSync("eeWebsite.crt")
    }, app).listen(3000, function(){
        console.log("Server listening on https://localhost:3000/");
    });
});


app.get("/", function (req, res){
    
});


app.get("/wb-correct-selector", function(req, res, next){
    res.render("../views/wbCorrect-selector");
});

app.get("/generalMathWS", function(req, res, next){
    res.render("../views/mathWSGeneral");
});


app.get("/about-us", function(req, res, next){
    res.render("../views/about");
});


// individual grade page
app.get("/gradePage/:grade", function(req, res, next){
    // check if its a valid num
    if (isNaN(req.params.grade)){
        res.send("...");
        return;
    }
    if (parseInt(req.params.grade) >= 1 && parseInt(req.params.grade) <= 6){
        res.render("../views/mathWSGrade", {grade: req.params.grade});
        return;
    }
    
    res.send("no no");

});


app.get("/products", function(req, res, next){
    res.render("../views/products");
});



app.get("/mc", function(req, res, next){
    res.render("../theGames/multipleC");
});


app.get("/contact", function(req, res, next){
    res.render("../views/contact");
})



// gets the total number of items in cart
function totCartItems(req, res, next){
    let carts = req.session.carts;
    if (!carts){
        req.session.totCart = 0;
        next();
        return;
    }
    let len = carts.length;
    let tot = 0;

    for (let i = 0; i <len; i++){
        tot += carts[i].amount;
    }
    req.session.totCart = tot;
    next();
}









