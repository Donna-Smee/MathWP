const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const express = require('express');
let router = express.Router();

const Page = require("./PageModel");
const Workbook = require("./WorkbookModel");

router.get("/:wbName/pictures", getPicture);
router.get("/code", getCode);




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
    Workbook.findOne().where("Title").equals(req.query.wbName.toLowerCase()).exec(function(err,result){
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





module.exports = router;