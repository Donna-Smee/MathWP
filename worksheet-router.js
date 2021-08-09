const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const express = require('express');
let router = express.Router();

const Page = require("./PageModel");
const Workbook = require("./WorkbookModel");
const Worksheet = require("./WorksheetModel");





router.get("/", queryParser);
router.get("/", loadWS);
router.get("/", respondWS);





router.get("/:wid", loadOneWS);







function queryParser(req, res, next){
    const MAX_WORKSHEETS = 50;

    try{
        if (!req.query.limit){
            req.query.limit = 3;
        }else {
            req.query.limit = Number(req.query.limit);

            if (req.query.limit > MAX_WORKSHEETS){
                req.query.limit = MAX_WORKSHEETS
            }
        }
    }catch{
        req.query.limit = 3;
    }


    // parse page param
    try {
        if(!req.query.page){
            req.query.page = 1;
        }else {
            req.query.page = Number(req.query.page);

            if (req.query.page < 1){
                req.query.page = 1;
            }
        }
    }catch{
        req.query.page = 1;
    }



    if(!req.query.section){
		req.query.section = "?";
	}

    if(!req.query.grade){
        req.query.grade = "?";
    }

    if(!req.query.inputText){
        req.query.inputText = "?";
    }


    // query parameter build
    let params = [];
    for(param in req.query){
        if (param == "page"){
            continue;
        }
        params.push(param + "=" + req.query[param]);
    }
    req.qstring = params.join("&");

    next();
}








function loadWS(req, res, next){

    let startIndex = ((req.query.page-1) * req.query.limit);
	let amount = req.query.limit;

    console.log("input text: " + req.query.inputText);
    console.log("Section: " + req.query.section);
    console.log("grade: " + req.query.grade);

    //if (req.query.section === "all")

    //let section = req.query.section;
    

    /*if (isNaN(req.query.grade)){
        res.send("failure...");
        return;
    }*/

    //let grade = parseInt(req.query.grade);

    if (req.query.section.trim() != "?" && req.query.grade != "?"){
        Worksheet.find()
        .where("AllDescript").regex(new RegExp(".*" + req.query.inputText + ".*", "i"))
        .where("Section").equals(req.query.section.trim().toLowerCase())
        .where("Grade").equals(req.query.grade)
        
        .skip(startIndex)
        .limit(amount + 1)
        .exec(function(err, results){
            if (err){
                res.status(500).send("An error occured while trying to retrieve worksheets. Please try again.");
                return;
            }

            if (results.length > amount){
                res.worksheets = results.slice(0,amount);
                res.more = true;
            }else {
                res.more = false;
                res.worksheets = results;
            }
            next();


        });
    }else if(req.query.section.trim() === "?" && req.query.grade != "?"){
        Worksheet.find()
        .where("Description").regex(new RegExp(".*" + req.query.inputText + ".*", "i"))
        .where("Grade").equals(req.query.grade)
        
        .skip(startIndex)
        .limit(amount + 1)
        .exec(function(err, results){
            if (err){
                res.status(500).send("An error occured while trying to retrieve worksheets. Please try again.");
                return;
            }

            if (results.length > amount){
                res.worksheets = results.slice(0,amount);
                res.more = true;
            }else {
                res.more = false;
                res.worksheets = results;
            }
            next();


        });
        
    }else if(req.query.section.trim() != "?" && req.query.grade === "?"){
        Worksheet.find()
        .where("AllDescript").regex(new RegExp(".*" + req.query.inputText + ".*", "i"))
        .where("Section").equals(req.query.section.trim().toLowerCase())
        
        .skip(startIndex)
        .limit(amount + 1)
        .exec(function(err, results){
            if (err){
                res.status(500).send("An error occured while trying to retrieve worksheets. Please try again.");
                return;
            }

            if (results.length > amount){
                res.worksheets = results.slice(0,amount);
                res.more = true;
            }else {
                res.more = false;
                res.worksheets = results;
            }
            next();


        });
      
    }else {
        console.log("hi");
        console.log(req.query.inputText);
        Worksheet.find()
        .where("AllDescript").regex(new RegExp(".*" + req.query.inputText + ".*", "i"))
        .skip(startIndex)
        .limit(amount + 1)
        .exec(function(err, results){
            if (err){
                console.log("eroror oh reorooror");
                res.status(500).send("An error occured while trying to retrieve worksheets. Please try again.");
                return;
            }

            console.log("nnnnnnnnnnnnnnnnnnnn:::    " + results);
            //res.render("../views/worksheetTypes", {worksheets: results});

            if (results.length > amount){
                res.worksheets = results.slice(0,amount);
                res.more = true;
            }else {
                res.more = false;
                res.worksheets = results;
            }
            next();


        });
    }

    

}


function respondWS(req, res, next){
    
	
	res.format({
		"text/html": () => {res.render("../views/worksheetTypes", {worksheets: res.worksheets, qstring: req.qstring, current: req.query.page, more: res.more})},
		"application/json": () => {res.status(200).json(res.worksheets)}
	});
    next();
	
}



function loadOneWS(req, res, next){
    console.log("NIODFEINW oh no oh no yes");
    Worksheet.findOne().where("_id").equals(ObjectId(req.params.wid)).exec(function(err, result){
        if (err){
            res.status(500).send("Error accessing worksheet.");
            return;
        }
        if (result != null){
            console.log("the worksheet: " + result);
            res.render("aWorksheet", {worksheet: result});
            res.end();
        }else {
            res.send("Worksheet is not found.");
        }
    });
}






module.exports = router;