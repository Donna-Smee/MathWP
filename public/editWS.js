

/* ------------------------------------- VIEW  -------------------------------------*/

// displays the options to edit the worksheet (this is originally hidden)
function showChangeOptions(){
    let options = document.getElementsByClassName("option");
    let len = options.length;
    for (let i = 0; i < len; i++){
        options[i].style.display = "initial";
    }
}











// checks if title exists, if it does, do the change given in the parameter
function checkExistTitle(theChange){
    let title = document.getElementById("title").value.trim();
    let lowerTitle = title.toLowerCase();

    if (title === "" || title === null){
        alert("You need to include a worksheet title.");
        return;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 409){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                if (theChange === "showOptions"){
                    showChangeOptions();
                }else if (theChange === "changeTitle"){
                    changeTitle(lowerTitle);
                }else if (theChange === "changeSection"){
                    changeSection(lowerTitle);
                }else if (theChange === "changePreviewPic"){
                    changePreviewPic(lowerTitle);
                }else if (theChange === "delPDF"){
                    deletePDF(lowerTitle);
                }else if (theChange === "addPDF"){
                    addPDF(lowerTitle);
                }else if (theChange === "removeAllPDF"){
                    removeAllPDF(lowerTitle);
                }else if (theChange === "shortD" || theChange === "descript" || theChange === "allD"){
                    changeTheDescript(theChange, lowerTitle);
                }else if (theChange === 'delWS'){
                    deleteWS(lowerTitle);
                }
                

            }else if (this.responseText === "false") {
                alert("This title-worksheet does NOT exist.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }
    }    

    xhttp.open("GET", "/admin/checkExistTitle?title=" + title.toLowerCase());
    xhttp.send();
}




// update the worksheet to a new title
function changeTitle(origTitle){

    // check if the worksheet exists
    if (origTitle === "" || origTitle === null){
        alert("invalid original title");
        return;
    }

    // check if the new title is valid 
    let nTitle = document.getElementById("newTitle").value.trim();
    if (nTitle === "" || nTitle === null){
        alert("You must give a new title.");
        return;
    }


    let data = {
        "oldTitle": origTitle,
        "newTitle": nTitle
    }
    


    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 404){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 500){
            alert(xhttp.responseText);
            return;
        }
        
        if (this.readyState == 4 && this.status == 409){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                
                alert("title changed.");
                return;

            }else if (this.responseText === "false") {
                alert("This title-worksheet does NOT exist.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }

        
    }

    xhttp.open("PUT", "/admin/changeTitle");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}




function changeSection(title){
    let newSect = document.getElementById("newSection").value.trim().toLowerCase();
    if (newSect === "" || newSect === null){
        alert("You must choose a section.");
        return;
    }

    let data = {
        "title": title,
        "section": newSect
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 409){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                alert("Section changed.");
                

            }else if (this.responseText === "false") {
                alert("This title-worksheet does NOT exist.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }
    }
    
    xhttp.open("PUT", "/admin/changeSection");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));

}



function changePreviewPic(title){
    let newPreviewPic = document.getElementById("newPP").value.trim();

    if (newPreviewPic === "" || newPreviewPic === null){
        alert("You must provide an image link.");
        return;
    }

    let data = {
        "title": title,
        "previewPic": newPreviewPic
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 404){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                alert("Preview Picture changed.");
                

            }else if (this.responseText === "false") {
                alert("This title-worksheet does NOT exist.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }
    }
    
    xhttp.open("PUT", "/admin/changePreview");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}




function deletePDF(title){
    let index = document.getElementById("pdfIndex").value.trim().toLowerCase();

    if (index === "" || index === null){
        alert("You have to enter a index for the pdf to delete.");
        return;
    }

    if (isNaN(index)){
        alert("You have to enter a number value.");
        return;
    }

    if (index < 0){
        alert("You have to enter an index 0 or up.");
        return;
    }

    try {
        index = parseInt(index);
    }
    catch{
        alert("You have to enter an integer.");
        return;
    }

    if (confirm("Are you sure you would like to delete pdf at index: " + index)){
        
        let data = {
            "title": title,
            "index": index
        }
    
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
    
            if (this.readyState == 4 && this.status == 404 || this.status == 400){
                alert(xhttp.responseText);
                return;
            }
    
            if (this.readyState == 4 && this.status == 200){
                if (this.responseText === "true"){
                    alert("The pdf at index " + index + " has been deleted.");
                    
    
                }else if (this.responseText === "false") {
                    alert("This title-worksheet does NOT exist.");
                    return;
                }else {
                    document.open();
                    document.write(xhttp.responseText);
                    document.close();
                    return;
                }
            }
        }
        
        xhttp.open("PUT", "/admin/deletePDF");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));

    }else {
        alert("okay, nothing is deleted.");
    }
}




function addPDF(title){
    let pdf = document.getElementById("addPDFLink").value.trim();

    if (pdf === "" || pdf === null){
        alert("You must include a pdf link.");
        return;
    }

    data = {
        "title": title,
        "pdf": pdf
    }


    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 404 || this.status == 400 ||this.status == 500){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                alert("The pdf has been added.");
                

            }else if (this.responseText === "false") {
                alert("This title-worksheet does NOT exist.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }
    }
    
    xhttp.open("PUT", "/admin/addPDF");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));

}



function removeAllPDF(title){
    data = {
        "title": title,
    }


    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 404 || this.status == 400 ||this.status == 500){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                alert("All pdfs are deleted");
                

            }else if (this.responseText === "false") {
                alert("This title-worksheet does NOT exist.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }
    }
    
    xhttp.open("PUT", "/admin/removeAllPDF");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}




function changeTheDescript(descriptType, title){

    let theDescript = document.getElementById(descriptType).value;

    data = {
        "title": title,
        "descript": theDescript
    }


    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 404 || this.status == 400 ||this.status == 500){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                alert("Description has changed");
                

            }else if (this.responseText === "false") {
                alert("This title-worksheet does NOT exist.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }
    }
    
    xhttp.open("PUT", "/admin/" + descriptType + "Change");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}



function deleteWS(title){
    let data = {
        "title": title
    }
    if (confirm("Do you really want to DELETE " + title + "?????")){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 404 || this.status == 400 ||this.status == 500){
            alert(xhttp.responseText);
            return;
        }

        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                alert(title + " has been DELETED");
                

            }else if (this.responseText === "false") {
                alert("This title-worksheet does NOT exist.");
                return;
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
                return;
            }
        }
    }
    
    xhttp.open("PUT", "/admin/delWS");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    }
}



