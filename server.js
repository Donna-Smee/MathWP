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
app.use("/workbooks", workbookRouter);

let worksheetRouter = require("./worksheet-router");
app.use("/worksheets", worksheetRouter);

let adminRouter = require("./admin-router");
app.use("/admin", adminRouter);

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

app.get("")


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





