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


// changes to product/workbooks
router.get("/editPD", auth, loadEditPDPage);
router.get("/getWorkbook", auth, getWorkbook);
router.put("/titleWbChange", auth, checkExistTitleToChangeWB, changeTitleWb);
router.put("/subjectWbChange", auth, changeSubject);
router.put("/shortDWbChange", auth, changeShortDWb);
router.put("/descriptWbChange", auth, changeDescriptWb);
router.put("/allDWbChange", auth, changeAllDWb);
router.put("/addPreviewPicWbChange", auth, checkPreviewPics, addPreviewPic);
router.put("/delPreviewPicWbChange", auth, findPreviewPicToDelete, deletePreviewPic);
router.put("/removeAllPreviewPicsWbChange", auth, removeAllPreviewPicsWb);

router.get("/:sc",  loadAdminLoginPage);
router.post("/saveLoadedWS", auth, loadInWorksheets);


// changes to worksheet
router.get("/editWS", auth, loadEditWSPage);
router.put("/changeTitle", auth, checkExistTitleToChange, changeTitle);
router.put("/changeSection", auth, changeSection);
router.put("/changePreview", auth, changePreviewPic);
router.put("/deletePDF", auth, findPDFToDelete, deletePDF);
router.put("/addPDF", auth, checkPDF, addPDF);
router.put("/removeAllPDF", auth, removeAllPDF);
router.put("/shortDChange", auth, changeShortD);
router.put("/descriptChange", auth, changeDescript);
router.put("/allDChange", auth, changeAllD);
router.put("/delWS", auth, deleteWorksheet);






function loadAdminLoginPage(req, res, next){
    if (req.params.sc === "88"){
        res.render("../views/adminLogin");
        return;
    }
    
}


function auth(req, res, next){
    console.log("checking");
    console.log("in auth: " + req.query.title);
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
    console.log("LOOOOL");
    console.log("given: " + req.query.title);
    console.log("LOOOOOL");
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


function getWorkbook(req, res, next){
    
    Workbook.findOne().where("LowerTitle").equals(req.query.title).exec(function(err, result){
        if (err){
            res.status(500).send("There is a problem with getting the workbook.");
            return;
        }
        if (result === null){
            res.status(200).send("false");
        }else {
            res.status(200).send(result);
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
        
        console.log("newly saved wb: " + result);
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
            return false;
        }
        if (result === null){
            return false;
        }else {
            return true;
            
        }
    });
}




function loadEditWSPage(req, res, next){
    res.status(200).render("../views/editWS");
}

function loadEditPDPage(req, res, next){
    console.log("im here here here 8");
    res.status(200).render("../views/editPD");
}

/*
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
*/


// checks to see if the new title is available
// good to go (no title exists) = next()
// title already exists => end
function checkExistTitleToChange(req, res, next){
    console.log("the old title: " + req.body["oldTitle"]);
    console.log("the new title: " + req.body["newTitle"]);
    let newT = req.body["newTitle"];

    Worksheet.findOne().where("LowerTitle").equals(newT.toLowerCase().trim()).exec(function(err, result){
        if (err){
            res.status(500).send("There is a problem with checking the new title availability.");
            return;
        }
        if (result === null){
            next();
        }else {
            res.status(409).send("Title Already Exists");
        }
    });

}


function checkExistTitleToChangeWB(req, res, next){
  
    let newT = req.body["text"];

    Workbook.findOne().where("LowerTitle").equals(newT.toLowerCase().trim()).exec(function(err, result){
        if (err){
            res.status(500).send("There is a problem with checking the new title availability.");
            return;
        }
        if (result === null){
            next();
        }else {
            res.status(409).send("Title Already Exists");
        }
    });

}

function changeTitle(req, res, next){
    let oldT = req.body["oldTitle"].trim().toLowerCase();
    let newT = req.body["newTitle"].trim();
    
    Worksheet.findOneAndUpdate({LowerTitle: oldT}, {Title:newT, LowerTitle: newT.toLowerCase()}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the worksheet title.");
            return;
        }
        if (result === null){
            res.status(404).send("Could not find the worksheet to update title.");
            return;
        }else {
            
            res.status(200).send("true");
        }
    });
}


function changeTitleWb(req, res, next){
    let oldT = req.body["title"].trim().toLowerCase();
    let newT = req.body["text"].trim();
    
    Workbook.findOneAndUpdate({LowerTitle: oldT}, {Title:newT, LowerTitle: newT.toLowerCase()}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the workbook title.");
            return;
        }
        if (result === null){
            res.status(404).send("Could not find the workbook to update title.");
            return;
        }else {
            
            res.status(200).send("Workbook title updated.");
        }
    });
}



function changeSection(req, res, next){
    let title = req.body["title"].trim().toLowerCase();
    let newSect = req.body["section"].trim().toLowerCase();


    Worksheet.findOneAndUpdate({LowerTitle: title}, {Section: newSect}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the worksheet section.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find the worksheet to update section.");
            return;
        }else {
            res.status(200).send("true");
        }
    });
}


function changeSubject(req, res, next){
    let title = req.body["title"].trim().toLowerCase();
    let newSubj = req.body["text"].trim().toLowerCase();


    Workbook.findOneAndUpdate({LowerTitle: title}, {Subject: newSubj}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the workbook subject.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find the workbook to update subject.");
            return;
        }else {
            res.status(200).send("Workbook subject updated");
        }
    });
}


function changePreviewPic(req, res, next){
    let title = req.body["title"].trim().toLowerCase();
    let previewPic = req.body["previewPic"].trim();


    Worksheet.findOneAndUpdate({LowerTitle: title}, {PreviewPic: previewPic}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the worksheet preview picture.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find the worksheet to update preview picture.");
            return;
        }else {
            res.status(200).send("true");
        }
    });
}



// using given index, find out if the index is valid for the PDF array
// configure the new array after removing such element
// if index is too high, end
function findPDFToDelete(req, res, next){
    let title = req.body["title"].trim().toLowerCase();
    let index = parseInt(req.body["index"]);

    Worksheet.findOne().where("LowerTitle").equals(title).exec(function(err, result){
        if (err){
            res.status(500).send("There is a problem with getting the worksheet info.");
            return;
        }
        if (result === null){
            res.status(404).send("Worksheet not found");
            return;
        }else {

            if (index >= result.PDF.length){
                res.status(400).send("Invalid index");
                return;
            }else {
                let newArr = result.PDF;
                newArr.splice(index, 1);
               
                res.newPDFArr = newArr;
                next();
            }
        }
    });
}


function deletePDF(req, res, next){
    let title = req.body["title"].trim().toLowerCase();

    Worksheet.findOneAndUpdate({LowerTitle: title}, {PDF: res.newPDFArr}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the worksheet pdf array.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find the worksheet to update (delete 1) pdf array.");
            return;
        }else {
            res.status(200).send("true");
        }
    });
}


// check if the given pdf link is already included in the worksheet's pdf array
// if it's not included, next
// if it is, end
function checkPDF(req, res, next){
    let title = req.body["title"].trim().toLowerCase();
    let pdf = req.body["pdf"].trim();

    Worksheet.findOne().where("LowerTitle").equals(title).exec(function(err, result){
        if (err){
            res.status(500).send("Couldn't add new pdf to worksheet pdf array.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find the worksheet to add pdf link to.");
            return;
        }else {
            let arr = result.PDF;
            
            if (arr.includes(pdf)){
                res.status(400).send("This worksheet already contains this pdf.");
                return;
            }else {
                
                arr.push(pdf);
                res.newArr = arr;
                next();
            }
        }
    })
}


function addPDF(req, res, next){
    let title = req.body["title"].trim().toLowerCase();

    Worksheet.findOneAndUpdate({LowerTitle: title}, {PDF: res.newArr}, function(err, result){
        if (err){
            res.status(500).send("Couldn't add new pdf to worksheet pdf array - adding section.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't add new pdf to worksheet pdf array. Couldn't find worksheet.");
            return;
        }else {
            res.status(200).send("true");
            return;
        }
    });   
}



function removeAllPDF(req, res, next){
    let title = req.body["title"].trim().toLowerCase();

    Worksheet.findOneAndUpdate({LowerTitle: title}, {PDF: []}, function(err, result){
        if (err){
            res.status(500).send("Couldn't remove all pdf from worksheet.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't remove all pdf from worksheet.");
            return;
        }else {
            res.status(200).send("true");
            return;
        }
    });
}


function changeShortD(req, res, next){

    let title = req.body["title"].trim().toLowerCase();
    let newDescript = req.body["descript"];

    Worksheet.findOneAndUpdate({LowerTitle: title}, {ShortD: newDescript}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the short description.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find worksheet to change short descript.");
            return;
        }else {
            res.status(200).send("true");
            return;
        }
    });
}


function changeDescript(req, res, next){

    let title = req.body["title"].trim().toLowerCase();
    let newDescript = req.body["descript"];

    Worksheet.findOneAndUpdate({LowerTitle: title}, {Description: newDescript}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the description.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find worksheet to change descript.");
            return;
        }else {
            res.status(200).send("true");
            return;
        }
    });
}

function changeAllD(req, res, next){

    let title = req.body["title"].trim().toLowerCase();
    let newDescript = req.body["descript"];

    Worksheet.findOneAndUpdate({LowerTitle: title}, {AllDescript: newDescript}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the all description.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find worksheet to change the all descript.");
            return;
        }else {
            res.status(200).send("true");
            return;
        }
    });
}



function changeShortDWb(req, res, next){

    let title = req.body["title"].trim().toLowerCase();
    let newDescript = req.body["text"].trim();

    Workbook.findOneAndUpdate({LowerTitle: title}, {ShortDescription: newDescript}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the short description.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find workbook to change short descript.");
            return;
        }else {
            res.status(200).send("Short description changed.");
            return;
        }
    });
}


function changeDescriptWb(req, res, next){

    let title = req.body["title"].trim().toLowerCase();
    let newDescript = req.body["text"].trim();

    Workbook.findOneAndUpdate({LowerTitle: title}, {Description: newDescript}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the description.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find workbook to change descript.");
            return;
        }else {
            res.status(200).send("Description changed.");
            return;
        }
    });
}

function changeAllDWb(req, res, next){

    let title = req.body["title"].trim().toLowerCase();
    let newDescript = req.body["text"].trim();

    Workbook.findOneAndUpdate({LowerTitle: title}, {AllDescript: newDescript}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the all description.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find workbook to change the all descript.");
            return;
        }else {
            res.status(200).send("AllDescript changed.");
            return;
        }
    });
}



function deleteWorksheet(req, res, next){

    let title = req.body["title"].trim().toLowerCase();

    Worksheet.findOneAndDelete({LowerTitle: title}, function(err, result){
        if (err){
            res.status(500).send("Couldn't delete the worksheet.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find worksheet to delete.");
            return;
        }else {
            res.status(200).send("true");
        }
    });
}










// check if the given pdf link is already included in the worksheet's pdf array
// if it's not included, next
// if it is, end
function checkPreviewPics(req, res, next){
    let title = req.body["title"].trim().toLowerCase();
    let pic = req.body["text"].trim();

    Workbook.findOne().where("LowerTitle").equals(title).exec(function(err, result){
        if (err){
            res.status(500).send("Couldn't check preview pic in workbook.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find workbook: " + title + " to check for new preview pic addition.");
            return;
        }else {
            let arr = result.PreviewPics;
            
            if (arr.includes(pic)){
                res.status(400).send("This workbook preview pics already contains this picture.");
                return;
            }else {
                
                arr.push(pic);
                res.newArr = arr;
                next();
            }
        }
    })
}



// adds one given preview pic to wb preview pic array
function addPreviewPic(req, res, next){
    let title = req.body["title"].trim().toLowerCase();

    Workbook.findOneAndUpdate({LowerTitle: title}, {PreviewPics: res.newArr}, function(err, result){
        if (err){
            res.status(500).send("Couldn't add new preview pic to workbook preview pic array - adding section.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find workbook to add new preview pic.");
            return;
        }else {
            res.status(200).send("New preview pic added.");
            return;
        }
    });   
}



function findPreviewPicToDelete(req, res, next){
    let title = req.body["title"].trim().toLowerCase();
    let index;
    try {
        index = parseInt(req.body["text"]);
    }catch{
        res.status(400).send("The index is invalid for PreviewPics. (Not an integer)");
        return;
    }

    console.log("the index: " + index);


    Workbook.findOne().where("LowerTitle").equals(title).exec(function(err, result){
        if (err){
            res.status(500).send("There is a problem with getting the workbook info.");
            return;
        }
        if (result === null){
            res.status(404).send("Workbook not found");
            return;
        }else {
            if (index >= result.PreviewPics.length || index < 0){
                res.status(400).send("Invalid index.");
                return;
            }else {
                let newArr = result.PreviewPics;
                console.log("preview pics before: " + newArr);
                newArr.splice(index, 1);


               
                res.newPPArr = newArr;
                next();
            }
        }
    });
}


function deletePreviewPic(req, res, next){
    let title = req.body["title"].trim().toLowerCase();

    Workbook.findOneAndUpdate({LowerTitle: title}, {PreviewPics: res.newPPArr}, function(err, result){
        if (err){
            res.status(500).send("Couldn't change the workbook previewpic array.");
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't find the workbook to update (delete 1) preview pics array.");
            return;
        }else {
            res.status(200).send("The preview pic is removed.");
        }
    });
}



function removeAllPreviewPicsWb(req, res, next){
    let title = req.body["title"].trim().toLowerCase();

    Workbook.findOneAndUpdate({LowerTitle: title}, {PreviewPics: []}, function(err, result){
        if (err){
            res.status(500).send("Couldn't remove all preview pics from workbook: " + title);
            return;
        }
        if (result === null){
            res.status(404).send("Couldn't remove all preview pics from workbook. Could not find workbook: " + title);
            return;
        }else {
            res.status(200).send("All preview pics from " + title + " are removed.");
            return;
        }
    });
}

module.exports = router;