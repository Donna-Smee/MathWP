const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const express = require('express');
let router = express.Router();
const possChar = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const bcrypt = require('bcrypt');

const Admin = require("./AdminModel");
const Worksheet = require("./WorksheetModel");
const Workbook = require("./WorkbookModel");
const Log = require("./LogModel");

router.post("/login", login, logDate, loadHome);
router.get("/logout", logout);
router.get("/home", auth, admin);


router.get("/createWorksheet", auth, loadCreateWSPage);
router.get("/checkExistTitle", auth, checkExistTitle);
router.post("/saveNewWS", saveNewWS);

router.get("/createProduct", auth, loadCreateProductPage);
router.get("/checkExistTitleWB", auth, checkExistTitleWB);
router.post("/saveProduct", auth, saveNewWB);

router.get("/log/all", auth, loadLogAll);
router.get("/log", auth, loadLog);
router.post("/log/year/month", auth, loadLogMonthYear);
router.post("/log/month", auth, loadLogMonth);
router.post("/log/year", auth, loadLogYear);


router.get("/loadWS", auth, openLoadWSPage);
router.get("/editWS", auth, loadEditWSPage);


router.get("/:sc",  loadAdminLoginPage);
router.post("/saveLoadedWS", auth, loadInWorksheets);



router.get("/editWS", auth, loadEditWSPage);




function loadAdminLoginPage(req, res, next){
    if (req.params.sc === "88"){
        res.render("../views/adminLogin");
        return;
    }
    
}


function auth(req, res, next){
    console.log("checking");
    if (!req.session.loggedIn){
        res.status(401).send("Not logged in.");
        return;
    }
    next();
}

function admin(req, res, next){
    res.status(200).render("../views/adminMain");
    return;
}


async function login(req, res, next){

    if(req.session.loggedIn){
        req.session.loggedIn = false;
		res.status(200).send("You were logged in. Now you're logged out. Try loggin in now.");
		return;
	}

    console.log(req.body.u);
    Admin.findOne().where("Username").equals(req.body.u)
    .exec(async function(err, result){
        if (err){
            console.log(err);
            res.status(500).send("Problem with server. Sorry.");
            return;
        }
        if (result === null){
            res.status(400).send("Nope. Existential crisis much.");
            return;
        }
        // user exists, check password now
        try {
            if (await bcrypt.compare(req.body.p, result.Password)){
                if (result.Locked){
                    res.send("unlock it");
                    return;
                }
                req.session.loggedIn = true;
                next();
                //res.status(200).render("../views/adminMain");
            }else {
                res.send("Not allowed."); 
                return;  
            }
        } catch {
            res.status(500).send();
            return;
        }
        
    });
}



function logDate(req, res, next){
    let d = new Date();
    let log = new Log();
    log.Date = d;
    log.Day = d.getDate();
    log.Month = d.getMonth() + 1;
    log.Year = d.getFullYear();

    log.save(function(err, result){
        if (err){
            res.status(500).send("There was an error... nopes. Please login again.");
            req.session.loggedIn = false;
            return;
        }
        console.log("logged in Date: " + result);
        next();
    });
}



function loadHome(req, res, next){
    if (req.session.loggedIn){
        res.status(200).render("../views/adminMain");
        return;
    }
}



function loadCreateWSPage(req, res, next){
    res.status(200).render("../views/addWS");
}



function logout(req, res, next){
	if(req.session.loggedIn){
		req.session.loggedIn = false;
		res.status(200).send("You have logged out. Thanks");
	}else{
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}






function checkExistTitle(req, res, next){
    Worksheet.findOne().where("LowerTitle").equals(req.query.title).exec(function(err, result){
        if (err){
            res.status(500).send("There is a problem with checking the title availability.");
            return;
        }
        if (result === null){
            res.status(200).send("false");
        }else {
            res.status(200).send("true");
        }
    });
}



function checkExistTitleWB(req, res, next){
    Workbook.findOne().where("LowerTitle").equals(req.query.title).exec(function(err, result){
        if (err){
            res.status(500).send("There is a problem with checking the title availability.");
            return;
        }
        if (result === null){
            res.status(200).send("false");
        }else {
            res.status(200).send("true");
        }
    });
}




function saveNewWS(req, res, next){
    let newWS = new Worksheet();
    let data = req.body;
    newWS.PDF = data["PDF"];
    newWS.Title = data["Title"];
    newWS.LowerTitle = data["LowerTitle"];
    newWS.Description = data["Description"];
    newWS.Grade = data["Grade"];
    newWS.Section = data["Section"];
    newWS.AllDescript = data["AllDescript"];

    newWS.PreviewPic = data["PreviewPic"];

    newWS.save(function(err, result){
        if (err){
            res.status(500).send("Couldn't save.");
            return;
        }
        console.log("saved: ");
        console.log(result);
        
        res.status(200).send("https://localhost:3000/worksheets/" + result._id.toString() + "split here" + JSON.stringify(result));

    });
}





function loadLogAll(req, res, next){
    console.log("limit nothing, allll");
    Log.find().sort({Date: -1}).exec(function(err, results){
        if (err){
            res.status(500).send("error loading logs");
            return;
        }
        res.status(200).render("../views/log", {logs: results});
    });
    
}

function loadLog(req, res, next){
    Log.find().sort({Date: -1}).limit(parseInt(req.query.limit)).exec(function(err, results){
        if (err){
            res.status(500).send("error loading logs");
            return;
        }
        res.status(200).render("../views/log", {logs: results});
    });
    
}


function loadLogMonth(req, res, next){
    Log.find().where("Month").equals(req.body.month).sort({Date: -1}).limit(parseInt(req.body.limit)).exec(function(err, results){
        if (err){
            res.status(500).send("error loading logs");
            return;
        }
        res.status(200).render("../views/log", {logs: results});
    });
}


function loadLogYear(req, res, next){
    Log.find().where("Year").equals(req.body.year).sort({Date: -1}).limit(parseInt(req.body.limit)).exec(function(err, results){
        if (err){
            res.status(500).send("error loading logs");
            return;
        }
        res.status(200).render("../views/log", {logs: results});
    });
}


function loadLogMonthYear(req, res, next){
    Log.find()
    .where("Year").equals(req.body.year)
    .where("Month").equals(req.body.month)
    .sort({Date: -1}).limit(parseInt(req.body.limit)).exec(function(err, results){
        if (err){
            res.status(500).send("error loading logs");
            return;
        }
        res.status(200).render("../views/log", {logs: results});
    });
}






function loadCreateProductPage(req, res, next){
    res.status(200).render("../views/addWB");
}




function saveNewWB(req, res, next){
    let newWB = new Workbook();
    let data = req.body;

    newWB.Title = data["title"];
    newWB.LowerTitle = newWB.Title.toLowerCase();
    newWB.Price = parseFloat(data["price"]);
    newWB.Format = JSON.parse(data["format"]);
    newWB.ShortDescription = data["shortD"];
    newWB.Description = data["fullD"];
    newWB.AllDescript = data["allD"];
    newWB.PreviewPics = JSON.parse(data["previewPics"]);
    newWB.PageNumbers = JSON.parse(data["pageNums"]);
    newWB.Subject = data["subject"];
    newWB.Grade = data["grade"];


    try {
        let prizeArr = prizeCodeArrGen(newWB.PageNumbers);
        newWB.PrizeCodes = prizeArr;
    }
    catch {
        res.status(500).send("Couldn't save the new workbook. Please try again.");
        return;
    }

    newWB.save(function(err, result){
        if (err){
            res.status(500).send("Couldn't save the new workbook. Please try again.");
            return;
        }
        console.log("saved: ");
        console.log(result);
        res.status(200).send("https://localhost:3000/workbooks/" + result._id.toString());

    });
}




function prizeCodeGenerator(size){
    let code = "";

    for (let i = 0; i < size; i++){
        let index = Math.floor(Math.random() * 62);
        code += possChar[index];
    }

    return code;
}



function prizeCodeArrGen(pageNums){
    let arr = [];
    for (let i = 0; i < pageNums.length; i++){
        arr.push(prizeCodeGenerator(pageNums[i]));
    }

    return arr;
}

/*
    LowerTitle: {type: String, required: true},
    Price: {type: Number, required: true},
    Format:[mongoose.Schema.Types.Mixed],
    ShortDescription: {type: String},
    Description: {type: String},
    AllDescript: {type: String, required: true},
    PreviewPics: [mongoose.Schema.Types.Mixed],
    PageNumbers: [mongoose.Schema.Types.Mixed],
    PrizeCodes: [mongoose.Schema.Types.Mixed],
    Subject: {type: String},
    Grade: {type:String} */



function openLoadWSPage(req, res, next){
    if (req.session.loggedIn){
        res.status(200).render("../views/adminLoadWS");
        return;
    }
}


function loadInWorksheets(req, res, next){
    if (req.session.loggedIn){
        let data = req.body;
        let len = data.length;


        let total = len;
        let count = 0;
        let failed  = 0;
        let alreadyExists = [];
        let theFailed = [];
        let success = 0;

        console.log("fnewonfewnewo:     " + data);
        if (len > 0){
            for (let i = 0; i < len; i++){
                //console.log(!checkExistTitleLoading(data[i]["LowerTitle"].trim()));
               // if (!checkExistTitleLoading(data[i]["LowerTitle"].trim())){

                Worksheet.findOne().where("LowerTitle").equals(data[i]["LowerTitle"]).exec(function(err, result){
                    console.log("title checking for: " + data[i]["LowerTitle"]);
                    if (err){
                        
                        console.log("error checking title uh oh");
                        failed++;
                        theFailed.push(data[i]["LowerTitle"]);
                        //return false;
                    }
                    if (result === null){
                        console.log("doesn't exist yet so GOOD");
                        console.log("yes entered");
                        let newWS = new Worksheet();
                        newWS.PDF = data[i]["PDF"];
                        newWS.Title = data[i]["Title"];
                        newWS.LowerTitle = data[i]["LowerTitle"];
                        newWS.Description = data[i]["Description"];
                        newWS.Grade = data[i]["Grade"];
                        newWS.Section = data[i]["Section"];
                        newWS.AllDescript = data[i]["AllDescript"];
                        newWS.PreviewPic = data[i]["PreviewPic"];

                        newWS.save(function(err, result){
                            count++;
                            if (err){
                                failed++;
                                theFailed.push(data[i]["LowerTitle"]);
                                //res.status(500).send("Couldn't save.");
                                //return;
                            }else {
                                success++;
                            }
                            //console.log("saved: ");
                            //console.log(result);
                            if (total === count){
                                console.log("success: " + success + "/" + total);
                                console.log("failed: " + theFailed);
                                console.log("already exists: " + alreadyExists);
                                res.status(200).send("success: " + success + "/" + total);
                            }
                            
                            //res.status(200).send("https://localhost:3000/worksheets/" + result._id.toString() + "split here" + JSON.stringify(result));

                        });
                        //return false;
                    }else {
                        console.log("Already exists.");
                        count++;
                        alreadyExists.push(data[i]["LowerTitle"]);
                        if (total === count){
                            console.log("success: " + success + "/" + total);
                            console.log("failed: " + theFailed);
                            console.log("already exists: " + alreadyExists);
                            res.status(200).send("success: " + success + "/" + total);
                       // return true;
                        
                        }
                    }
                });
                    
                /*}else {
                    count++;
                    alreadyExists.push(data[i]["LowerTitle"]);
                    if (total === count){
                        console.log("success: " + success + "/" + total);
                        console.log("failed: " + theFailed);
                        console.log("already exists: " + alreadyExists);
                        res.status(200).send("success: " + success + "/" + total);
                    }*/
                }
                
            }
        }
    }



function checkExistTitleLoading(title){
    Worksheet.findOne().where("LowerTitle").equals(title).exec(function(err, result){
        console.log("title checking for: " + title);
        if (err){
            console.log("error checking title uh oh");
            return false;
        }
        if (result === null){
            console.log("doesn't exist yet so GOOD");
            return false;
        }else {
            console.log("Already exists.");
            return true;
            
        }
    });
}




function loadEditWSPage(req, res, next){
    console.log("here");
    res.status(200).render("../views/editWS");
}




module.exports = router;