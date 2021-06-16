const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const express = require('express');
let router = express.Router();

const Page = require("./PageModel");
const Workbook = require("./WorkbookModel");

router.get("/:wbName/pictures", getPicture);
router.get("/code", getCode);

router.get("/", queryParser);
router.get("/", loadWB);
router.get("/", respondWB);


router.get("/:wbID", getWorkbook);



function queryParser(req, res, next){
    const MAX_WORKSHEETS = 50;

    try{
        if (!req.query.limit){
            req.query.limit = 2;
        }else {
            req.query.limit = Number(req.query.limit);

            if (req.query.limit > MAX_WORKSHEETS){
                req.query.limit = MAX_WORKSHEETS
            }
        }
    }catch{
        req.query.limit = 2;
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



    if(!req.query.subject){
		req.query.subject = "?";
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



function loadWB(req, res, next){
    let startIndex = ((req.query.page-1) * req.query.limit);
	let amount = req.query.limit;

    if (!(req.query.subject) || !(req.query.grade) || !(req.query.inputText)){
        res.status(404).send("Workbooks cannot be found.");
        return;
    }

    console.log("input text: " + req.query.inputText);
    console.log("subject: " + req.query.subject);
    console.log("grade:" + req.query.grade);
    


    Workbook.find()
    .where("AllDescript").regex(new RegExp(".*" + req.query.inputText + ".*", "i"))
    .where("Subject").regex(new RegExp(".*" + req.query.subject + ".*", "i"))
    .where("Grade").regex(new RegExp(".*" + (req.query.grade).toString() + ".*", "i"))
    .skip(startIndex)
    .limit(amount + 1)
    .exec(function(err, results){
        if (err){
            console.log("oh nooooo here");
            res.status(500).send("There was an error finding the workbooks.");
            return;
        }
        console.log("results: ");
        console.log(results);
        if (results.length > amount){
            res.workbooks = results.slice(0,amount);
            res.more = true;
        }else {
            res.more = false;
            res.workbooks = results;
        }
        next();
    });



    
}



/* change this to a page that shows products */
function respondWB(req, res, next){
	console.log('responding:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
    console.log(res.workbooks);
	res.format({
		"text/html": () => {res.render("../views/products", {workbooks: res.workbooks, qstring: req.qstring, current: req.query.page, more: res.more, totCart: req.session.totCart})},
		"application/json": () => {res.status(200).json(res.workbooks)}
	});
    next();
	
}



function getPicture(req, res, next){

    console.log(req.params.wbName);
    Workbook.findOne().where("Title").equals(req.params.wbName).exec(function(err, result){
        if (err){
            console.log(err);
            return;
        }
        if (result){
            res.contentType(result.PreviewPics.contentType);
            res.send(result.PreviewPics.data);
        }
    });
}


function getCode(req, res, next){
    // req.query.sectNum
    console.log(req.query.wbName);
                console.log(req.query.sectNum);
                console.log(req.query.pageNum);
    Workbook.findOne().where("LowerTitle").equals(req.query.wbName.toLowerCase()).exec(function(err,result){
        if (err){
            console.log(err);
            res.status(200).send("false");
            return;
        }
        if (result){
            if (result.PrizeCodes){
                console.log(result.PrizeCodes);
                console.log(result.PrizeCodes[parseInt(req.query.sectNum)-1][parseInt(req.query.pageNum)]);
                res.status(200).send(result.PrizeCodes[parseInt(req.query.sectNum)-1][parseInt(req.query.pageNum)]);
                return;
            }
        }
        res.status(200).send("false");
    })
}



function getWorkbook(req, res, next){
    Workbook.findOne().where("_id").equals(ObjectId(req.params.wbID)).exec(function(err, result){
        if (err){
            res.status(500).send("Error accessing workbook.");
            return;
        }
        if (result != null){
            res.render("product", {product: result, totCart: req.session.totCart});
            res.end();
        }else {
            res.send("Workbook is not found.");
        }
    });
}




module.exports = router;