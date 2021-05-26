let wsLinks = ["https://learningresources312574283.files.wordpress.com/2021/05/comp2406-w21-t10.pdf", "https://learningresources312574283.files.wordpress.com/2021/05/comp2406-w21-t10.pdf"];


function addLink(){
    let link = document.getElementById("pdfs").value.trim();
    if (!(wsLinks.includes(link)) && link != ""){
        wsLinks.push(link);
        document.getElementById("pdfs").value = "";
        clearLinks();
        displayLinks();
    }else {
        alert("already added");
        return;
    }
}

function clearLinks(){
    let div = document.getElementById("pdfLinks");
    while (div.lastChild){
        div.removeChild(div.firstChild);
    }   
}

function displayLinks(){
    let div = document.getElementById("pdfLinks");
    for (let i = 0; i < wsLinks.length; i++){
        let a = document.createElement("a");
        let text = document.createTextNode(wsLinks[i]);
        a.appendChild(text);
        a.href = wsLinks[i];
        div.appendChild(a);
    }
    
}


function checkValidInputWS(){
    let title = document.getElementById("title").value.trim();
    let description = document.getElementById("descript").value.trim();
    // check wsLinks arr
    let imagePreview = document.getElementById("image-link").value.trim();
    let grade = document.getElementById("grade").value.trim();
    let section = document.getElementById("section").value.trim().toLowerCase();

    // check all inputs have a value
    if (title === "" || description === "" || wsLinks.length === 0 || imagePreview === "" || grade === "" || section === ""){
        alert("You left some inputs empty.");
        return;
    }

    // check if grade is a number
    if (isNaN(grade) || grade < 1){
        alert("Grade should be a number value greater than 0.")
    }


    
    // check if the title exists yet (must be unique)
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "false"){
                // go ahead and send request to add ws
                let data = {
                    PDF: wsLinks,
                    Title: title,
                    LowerTitle: title.toLowerCase(),
                    Description: description,
                    PreviewPic: imagePreview,
                    Grade: grade,
                    Section: section
                }
                sendSaveWSRequest(data);
                return;

            }else if (this.responseText === "true") {
                alert("A worksheet with this title already exists.");
            }else {
                document.open();
                document.write(xhttp.responseText);
                document.close();
            }
        }
    }

    xhttp.open("GET", "/admin/checkExistTitle?title=" + title.toLowerCase());
    xhttp.send();



    // move to next step

}



function sendSaveWSRequest(data){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            clearAllDOM();
            let result = document.getElementById("result");
            let a = document.createElement("a");
            a.href = this.responseText;
            let text = document.createTextNode(this.responseText);
            a.appendChild(text); 
            result.appendChild(a);
        }
    }

    xhttp.open("POST", "/admin/saveNewWS");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}



function clearAllDOM(){
    document.getElementById("title").value  = "";
    document.getElementById("descript").value = "";
    clearLinks();
    document.getElementById("pdfs").value = "";
    document.getElementById("image-link").value ="";
    document.getElementById("grade").value = "";
    document.getElementById("section").value = "";
    let result = document.getElementById("result");
    while (result.lastChild){
        result.removeChild(result.firstChild);
    }  
    wsLinks = [];

}