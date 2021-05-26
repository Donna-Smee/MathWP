
function getWorkSheets(val){

    let section = val.trim().toLowerCase();
    let grade = document.getElementById(val).getAttribute("value");

    if (isNaN(grade)){
        return;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            window.location = this.responseURL;
        }
    }

    xhttp.open("GET", "/worksheets?section=" + section + "&grade=" + grade);
    xhttp.send();
}


function searchWS(){

    let searchInput = document.getElementById("searchInput").value;
    let sectionSelect = document.getElementById("sectionSelect").value;
    let gradeSelect = document.getElementById("gradeSelect").value;

    console.log(searchInput);
    console.log(sectionSelect);
    console.log(gradeSelect);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            window.location = this.responseURL;
        }
    }

    xhttp.open("GET", "/worksheets?inputText=" + searchInput + "&section=" + sectionSelect + "&grade=" + gradeSelect);
    xhttp.send();
    
}