

/* ------------------------------------- VIEW  -------------------------------------*/

// displays the options to edit the worksheet (this is originally hidden)
function showChangeOptions(){
    let options = document.getElementsByClassName("option");
    let len = options.length;
    for (let i = 0; i < len; i++){
        options[i].style.display = "initial";
    }
}











// checks if title exists, if it does, show the edit/change options on page
function checkExistTitle(){
    let title = document.getElementById("title").value.trim().toLowerCase();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            if (this.responseText === "true"){
                showChangeOptions();

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

    let hi = "hi";
    

    xhttp.open("GET", "/admin/checkExistTitle?title=" + title);
    xhttp.send();
}




