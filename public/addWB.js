



// checks if all inputs are valid 
function checkInputs(){
    let title = document.getElementById("title").value.trim();
    let price = document.getElementById("price").value.trim();
    let format = document.getElementById("format").value.trim();
    let shortD = document.getElementById("shortD").value.trim();
    let fullD = document.getElementById("fullD").value.trim();
    let allD = document.getElementById("allD").value.trim();
    let previewPics = document.getElementById("previewPics").value.trim();
    let pageNums = document.getElementById("pageNums").value.trim();
    let subject = document.getElementById("subject").value.trim().toLowerCase();
    let grade = document.getElementById("grade").value.trim();
    let forMat;
    let PP;
    let PN;
    let graDes;

    if (title === "" || price === "" || format === "" || shortD === "" || fullD === ""
    || allD === "" || previewPics === "" || pageNums === "" || subject === "" || grade === ""){
        alert("You must include something for each input.");
        return;
    }

    if (isNaN(price)){
        alert("The price must be a number.");
        return;
    }

    if (parseFloat(price) < 0){
        alert("The price must be >= $0");
        return;
    }


    try {
        forMat = JSON.parse(format);
        
        console.log(forMat);
        for (let i = 0; i < forMat.length; i++){
            if (isNaN(forMat[i])){
                alert("all elements of format array must be numbers.");
                return;
            }
        }
        
    }catch{
        alert("Something is wrong with format.");
        return;
    }



    try {
        PP = JSON.parse(previewPics);
    }catch{
        alert("Something is wrong with preview pics.");
        return;
    }


    try {
        PN = JSON.parse(pageNums);

        for (let i = 0; i < PN.length; i++){
            if (isNaN(PN[i])){
                alert("all elements of page numbers array must be numbers.");
                return;
            }
        }
    }catch{
        alert("Something is wrong with page numbers.");
        return;
    }


    try {
        console.log("grades: " + grade);
        graDes = grade.split(',');

        for (let i = 0; i < graDes.length; i++){
            if (isNaN(graDes[i]) || graDes[i] === ""){
                alert("all elements of grades must be numbers (comma separated).");
                return;
            }
        }

        console.log(graDes);
    }catch{
        alert("Something is not right with the grades.");
        return;
    }
    



    checkTitle(title, price, format, shortD, fullD, allD, previewPics, pageNums, subject, grade);


}


function checkTitle(title, price, format, shortD, fullD, allD, previewPics, pageNums, subject, grade){
    // check if the title exists yet (must be unique)
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "false"){
                // go ahead and send request to add wb
                let data = {
                    title: title,
                    price: price,
                    format: format, 
                    shortD: shortD,
                    fullD: fullD,
                    allD: allD,
                    previewPics: previewPics,
                    pageNums: pageNums,
                    subject: subject,
                    grade: grade
                }
                createProd(data);
                return;
                console.log("Title is good.");
                return;

            }else if (this.responseText === "true") {
                alert("A workbook with this title already exists.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }
    }

    xhttp.open("GET", "/admin/checkExistTitleWB?title=" + title.toLowerCase());
    xhttp.send();
}



function createProd(data){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            //clearAllDOM();
            //let result = document.getElementById("result");
           // let a = document.createElement("a");
            //a.href = this.responseText;
            //let text = document.createTextNode(this.responseText);
            //a.appendChild(text); 
            //result.appendChild(a);
            console.log("Saved.");  
            
        }
    }

    xhttp.open("POST", "/admin/saveProduct");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));

}


/* 
everything is trimmed.
everything must have an input.

the title can stay the way it was typed.

the price must be a number, and it must be a positive number

the format turns into a parse json (array of all numbers)

the shortD can be as it was.

the fullD can be as it was.

the allD can be as it was (since it wont be shown and searching with regex)

preview pics json parse

pagenums json parse (array of all numbers)

subject is lower cased

grade is as is (comma separaed numbers)



*/