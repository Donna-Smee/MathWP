const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const express = require('express');
let router = express.Router();

const bcrypt = require('bcrypt');

const Admin = require("./AdminModel");
const Worksheet = require("./WorksheetModel");

router.post("/login", login);
router.get("/logout", logout);
router.get("/home", auth, admin);


router.get("/createWorksheet", auth, loadCreateWSPage);
router.get("/checkExistTitle", auth, checkExistTitle);
router.post("/saveNewWS", saveNewWS);





router.get("/:sc",  loadAdminLoginPage);




function loadAdminLoginPage(req, res, next){
    if (req.params.sc === "88"){
        res.render("../views/adminLogin");
        return;
    }
    
}


function auth(req, res, next){
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
                res.status(200).render("../views/adminMain");
            }else {
                res.send("Not allowed.");   
            }
        } catch {
            res.status(500).send();
        }
        
    });
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
    })
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

    newWS.save(function(err, result){
        if (err){
            res.status(500).send("Couldn't save.");
            return;
        }
        console.log("saved: ");
        console.log(result);
        res.status(200).send("https://localhost:3000/worksheets/" + result._id.toString());

    });
}



module.exports = router;