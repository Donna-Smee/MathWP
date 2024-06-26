// ------------------------ VIEW ----------------------

function showWorkbook(data){
    let pInfo = document.createElement("div");
    pInfo.id = "productInfo";

    pInfo.appendChild(document.createTextNode(data));
    document.getElementById("productInfoContainer").appendChild(pInfo);


    
}


//
function clearWorkbookInfo(){
    let pInfo = document.getElementById("productInfo");
    if (pInfo != null){
        pInfo.remove();
    }
}
    



// checks if title exists, if it does, do the change given in the parameter
function checkExistTitleWB(theChange){
    let title = document.getElementById("title").value.trim().toLowerCase();

    if (title === "" || title === null){
        alert("You need to include a worksheet title.");
        return;
    }

    console.log("theeeeeeee: " + title);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 409 || this.status == 400 || this.status == 404){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "false"){
                alert("This title-worksheet does NOT exist.");
                return;
                

            }else {
                console.log("pie pie pie");
                showChangeOptions();
                clearWorkbookInfo();
                showWorkbook(this.responseText);

                if (theChange === "title" || theChange === "subject" || theChange === "shortD" || theChange === "descript" || theChange === "allD" || theChange === "addPreviewPic" || theChange === "delPreviewPic" || theChange === "removeAllPreviewPics" || theChange === "price" || theChange === "grades" || theChange === "format" || theChange === "pageNums" || theChange === "delPD"){
                    updateText(title, theChange);
                }
            }
        }
    }    

    xhttp.open("GET", "/admin/getWorkbook?title=" + title);
    xhttp.send();
}





// updates the following attributes for workbook, given the title of the workbook, and the attribute type
// title, subject, shortD, description, allD, 

function updateText(title, type){

    let text = document.getElementById(type + "Val").value.trim();

    
    if (text === "" || text === null){
        alert("You must include some input for " + type);
        return;
    }

    if (type === "delPreviewPic"){
        // check if it's a valid index
        if (!checkValidIndex(text)){
            return;
        }
    }

    if (type === "price"){
        if (!priceValid(text)){
            alert("Not a valid price.");
            return;
        }
    }
    

    if (type === "grades"){
        if (!validGrades(text)){
            alert("Something is wrong with grades. Ensure it is numbers separated by commas.");
            return;
        }
    }


    if (type === "format" || type === "pageNums"){
        if (!validNumArray(text)){
            alert("invalid array for " + type);
            return;
        }else {
            text = JSON.parse(text);
        }
    }

    if (type === "delPD"){
        if (!confirm("DO YOU REALLY WANT TO DELETE THE PRODUCT: " + title)){
            alert("Okay, nothing is deleted.");
            return;
        }
    }


    let data = {
        "title": title.trim().toLowerCase(),
        "text": text
    }


    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 409 || this.status == 404 || this.status == 500 || this.status == 400){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            alert(xhttp.responseText);
            return;
        }
    }    

    xhttp.open("PUT", "/admin/" + type + "WbChange");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));

}


function checkValidIndex(index){
    if (index === "" || index === null){
        alert("You have to enter a index for the pdf to delete.");
        return false;
    }

    if (isNaN(index)){
        alert("You have to enter a number value.");
        return false;
    }

    if (index < 0){
        alert("You have to enter an index 0 or up.");
        return false;
    }

    try {
        index = parseInt(index);
    }
    catch{
        alert("You have to enter an integer.");
        return false;
    }

    return true;
}



// price has to be a number
// price has to be 0 or greaterx
// return false if not
function priceValid(price){
    if (isNaN(price)){
		console.log("No. Must be a number.");
		return false;
	}

	if (price < 0){
		console.log("No. Must be 0 or positive");
		return false;
	}

	console.log("Price is okay!");
    return true;
}


function validGrades(grades){
    let graDes;
    try {
        //console.log("grades: " + grade);
        graDes = grades.split(',');

        for (let i = 0; i < graDes.length; i++){
            if (isNaN(graDes[i]) || graDes[i] === ""){
                alert("all elements of grades must be numbers (comma separated).");
                return false;
            }
        }

        console.log(graDes);
    }catch{
        alert("Something is not right with the grades.");
        return false;
    }

    return true;
}


// checks if the given array consists of only numbers
function validNumArray(arr) {

    let arrayTest;

    try {
        arrayTest = JSON.parse(arr);
        
        for (let i = 0; i < arrayTest.length; i++){
            if (isNaN(arrayTest[i])){
                alert("all elements of array must be numbers.");
                return false;
            }
        }
        
    }catch{
        alert("Something is wrong with array.");
        return false;
    }
    return true;
}




