function getWBs(){
    let text = document.getElementById("searchInput").value.trim();
    let subject = document.getElementById("subject").value.trim();
    let grade = document.getElementById("grade").value.trim();


    if (grade!="" && isNaN(grade)){
        alert("You must enter a number value for the grade.");
        return;
    }



    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            /*document.open();
            document.write(this.responseText);
            document.close();*/
            window.location = this.responseURL;
        }
    }

    xhttp.open("GET", "/workbooks?inputText=" + text + "&subject=" + subject + "&grade=" + grade);
    xhttp.send();
}