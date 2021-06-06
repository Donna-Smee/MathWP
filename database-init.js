const mongoose = require('mongoose');
const Page = require("./PageModel");
const Workbook = require("./WorkbookModel");
const Worksheet = require("./WorksheetModel");
const Admin = require("./AdminModel");
const bcrypt = require('bcrypt');

const fs = require("fs");

const possChar = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


mongoose.connect('mongodb://localhost/eeWB', {useNewUrlParser: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	mongoose.connection.db.dropDatabase(async function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped fp database. Starting re-creation.");

        

		let workbook = JSON.parse(fs.readFileSync("./data/allMathSections.json"));
        let format = JSON.parse(fs.readFileSync("./data/mathWBFormat.json"));
        let picPath = "./data/pic.jpg";
        let pageNums = JSON.parse(fs.readFileSync("./data/pageNums.json"));
        //console.log(workbook[17].pages[0]);
        //console.log(format);


        // including the format file/data and the temp ws and admin
        let tot = getTotalPages(workbook) + 1 + 1 + 2 + 1;
        let count = 0;
        let countSuccess = 0;
        let countFail = 0;

        // admin creation
        let admin = await createAdmin();
        if (admin){
            console.log(admin);
            count++;
            countSuccess++;
            if (count === tot){
                console.log("Finished.");
                console.log("Successfully added: " + countSuccess);
                console.log("Failed: " + countFail);
                mongoose.connection.close();
                process.exit(0);
            }
        }else {
            console.log("failed: " + admin)
            countFail++;
            count++;
            if (count === tot){
                console.log("Finished.");
                console.log("Successfully added: " + countSuccess);
                console.log("Failed: " + countFail);
                mongoose.connection.close();
                process.exit(0);
            }
        }
       
        let newWS = new Worksheet();
        newWS.PDF.push("https://learningresources312574283.files.wordpress.com/2021/05/comp2406-w21-t10.pdf");
        newWS.PDF.push("https://learningresources312574283.files.wordpress.com/2021/05/comp2406-w21-t10.pdf");
        newWS.Title = "The Fraction Worksheet";
        newWS.LowerTitle = newWS.Title.toLowerCase();
        newWS.Description = "Learn math. This is about fractions. Denominator and numerator.";
        newWS.PreviewPic = "https://i.ibb.co/6sLp4yb/wsPic.jpg";
        newWS.Grade = 3;
        newWS.Section= "algebra";
        console.log(newWS);

        let newWS2 = new Worksheet();
        newWS2.PDF.push("https://learningresources312574283.files.wordpress.com/2021/05/comp2406-w21-t10.pdf");
        newWS2.Title = "The Dividing Worksheet";
        newWS2.LowerTitle = newWS2.Title.toLowerCase();
        newWS2.Description = "dividing with math, it has dividend";
        newWS2.PreviewPic = "https://i.ibb.co/6sLp4yb/wsPic.jpg";
        newWS2.Grade = 3;
        newWS2.Section= "algebra";

        let newWS3 = new Worksheet();
        newWS3.PDF.push("https://learningresources312574283.files.wordpress.com/2021/05/comp2406-w21-t10.pdf");
        newWS3.Title = "The exponent sheet";
        newWS3.LowerTitle = newWS3.Title.toLowerCase();
        newWS3.Description = "base to the power of number. Math.";
        newWS3.PreviewPic = "https://i.ibb.co/6sLp4yb/wsPic.jpg";
        newWS3.Grade = 3;
        newWS3.Section= "algebra";

        newWS.save(function(err, callback){
            count++;
            if (err){
                console.log(err);
                countFail++;
            }else {
                countSuccess++;
                //console.log(newWS);

            }

            if (count === tot){
                console.log("Finished.");
                console.log("Successfully added: " + countSuccess);
                console.log("Failed: " + countFail);
                mongoose.connection.close();
                process.exit(0);
            }
        });

        newWS2.save(function(err, callback){
            count++;
            if (err){
                console.log(err);
                countFail++;
            }else {
                countSuccess++;
                //console.log(newWS);

            }

            if (count === tot){
                console.log("Finished.");
                console.log("Successfully added: " + countSuccess);
                console.log("Failed: " + countFail);
                mongoose.connection.close();
                process.exit(0);
            }
        });

        newWS3.save(function(err, callback){
            count++;
            if (err){
                console.log(err);
                countFail++;
            }else {
                countSuccess++;
                //console.log(newWS);

            }

            if (count === tot){
                console.log("Finished.");
                console.log("Successfully added: " + countSuccess);
                console.log("Failed: " + countFail);
                mongoose.connection.close();
                process.exit(0);
            }
        });



        /*
        PDF: [String],
        Title: {type: String, required: true},
        Description: {type: String},
        PreviewPic: {type: String},
        Grade: {type: Number},
        Section: {type: String}
        */
       

        let sectionsNum = workbook.length;

        // workbook[i].pages.length

        


        // load format
        let newWB = new Workbook();
        newWB.Title = "math work book";
        newWB.LowerTitle = newWB.Title.toLowerCase();
        newWB.Price = 4.99;
        newWB.Format = format;
        newWB.PreviewPics = ["https://i.ibb.co/6sLp4yb/wsPic.jpg", "https://i.ibb.co/6sLp4yb/wsPic.jpg"];
        newWB.CoverPic = "https://i.ibb.co/6sLp4yb/wsPic.jpg"; 
        newWB.PageNumbers = pageNums;  
        newWB.Subject = "math";
        newWB.Grade = "1,3";
        newWB.AllDescript = "Grade 1, Grade 3, math work book, this is an addition work book";

        // generate array of prize codes (one for each section)
        newWB.PrizeCodes = prizeCodeArrGen(pageNums);
        

       // console.log(newWB);
        newWB.save(function(err, callback){
            count++;
            if (err){
                countFail++;
            }else {
                countSuccess++;
            }
            if (count === tot){
                console.log("Finished.");
                console.log("Successfully added: " + countSuccess);
                console.log("Failed: " + countFail);
                mongoose.connection.close();
                process.exit(0);
            }
        });



        // load all pages
        for (let i = 1; i <= sectionsNum; i++){
            for (let j = 0; j < workbook[i-1].pages.length; j++){
                let newPage = new Page();
                newPage.Section = i;
                newPage.PageNum = j;
                newPage.Questions = workbook[i-1].pages[j];
                newPage.workbookName = "math work book";

                newPage.save(function(err, callback){
                    count++;
                    if (err){
                        console.log(err);
                        countFail++;
                    }else {
                        countSuccess++;
                    }

                    if (count === tot){
                        console.log("Finished.");
                        console.log("Successfully added: " + countSuccess);
                        console.log("Failed: " + countFail);
                        mongoose.connection.close();
                        process.exit(0);
                    }
                });
                
            }
        }


		
		
		
	});
	
});






// calculates the total number of pages
function getTotalPages(workbook){
    let total = 0;
    for (let i = 1; i <= workbook.length; i++){
        for (let j = 0; j < workbook[i-1].pages.length; j++){
            total++;
        }
    }
    return total;
}



// prize code generator, length of code is equal to parameter given (# of pages)
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


async function createAdmin(){
    try {
        let d = JSON.parse(fs.readFileSync("./data/meEE.json"));
        console.log(d["u"]);
        console.log(d["p"]);
        console.log(d["ss"]);
        const hashedPassword = await bcrypt.hash(d["p"], 10);
        const hashedSK = await bcrypt.hash("!sghtbm28aB", 10);
        let newA = new Admin();
        newA.Username = d["u"];
        newA.Password = hashedPassword;
        newA.SecretKey = hashedSK;
        newA.SquareS = d["ss"],
        newA.Locked = false;

        console.log("this is admin: ");
        console.log(newA);

        newA.save(function(err, callback){
            if (err){
                console.log(err);
                return -1;
            }
            console.log("finished hahahahhahhaa");
            return 1;
        });


    }
    catch{
        console.log("oh no nooooooooooooooooooooooooo");
        return -1;
    }
}