const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const express = require('express');
let router = express.Router();

const Page = require("./PageModel");
const Workbook = require("./WorkbookModel");


router.get("/", getTermAmount, getPage);


function getTermAmount(req, res, next){
    console.log(req.query.wbName)
    Workbook.findOne().where("LowerTitle").equals(req.query.wbName).exec(function(err, result){
        if (err){
            console.log(err);
            return;
        }
        if (result === null){
            res.status(200).send("false");
        }else {
            console.log("FORMATTTTT: " + result.Format[req.query.sectNum - 1]);
            res.termNum = result.Format[req.query.sectNum - 1];
            res.Title = result.Title;
            //res.pic = result.PreviewPic.data;
            console.log("TILTE::::::::::::::::::::::: " + result.Title);
            next();
        }
    })
}


function getPage(req, res, next){
    console.log("in function");
    console.log("wb name qury: " + req.query.wbName);
    Page.findOne()
    .where("workbookName").equals(req.query.wbName)
    .where("Section").equals(req.query.sectNum)
    .where("PageNum").equals(req.query.pageNum)
    .exec(function(err, result){
        if (err){
            console.log(err);
            return;
        }

        if (result === null){
            res.status(200).send("false");
        }else {
            console.log("result: "+ result);
            res.status(200).render("check-q", {page: result, termNum: res.termNum, title: res.Title});
        }
        
    })
}



module.exports = router;