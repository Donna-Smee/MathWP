function findPage(){
    let wbName = document.getElementById("workbook-name").value.trim().toLowerCase();
    let sectNum = document.getElementById("section-num").value.trim();
    let pageNum = document.getElementById("page-num").value.trim();

    console.log("wbName: " + wbName);
    console.log("sect num: " + sectNum);
    console.log("page num: " + pageNum);

    // ensures all inputs have value 
    if (wbName === "" || sectNum === "" || pageNum === ""){
        alert("you must fill in ALL");
        return;
    }

    // checks if the inputs for section and page num are indeed numbers
    if (isNaN(sectNum)){
        console.log("section number is not valid");
        return;
    }
    if (isNaN(pageNum)){
        console.log("page num not num");
        return;
    }



    // send request to find potential page
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
        

            if (this.responseText === "false"){
                alert("Page not found. Please try again.");
                return;
            }

          
            window.location = this.responseURL;

        }
       
    };
    

    xhttp.open("GET", "/pages?wbName=" + wbName + "&sectNum=" + sectNum + "&pageNum=" + pageNum);
    xhttp.send();

}







// corrects each question of the page
function correction(val){

    let termNum = document.getElementById("correct-but").getAttribute("data-value");
    let questions = JSON.parse(val);
    let numOfQ = questions.length;

    // check if there are inputs in each
    if (!noneEmpty(numOfQ)){
        alert("you must write an answer for each question.");
        return;
    }

    // checks if they are all number inputs
    if (!allNumbers(numOfQ)){
        alert("one of your answers in not valid. Make sure they are all NUMBERS. Please try again.");
        return;
    }

    // keeps track of the wrong answers
    let wrong = [];

    // check the answers
    for (let i = 1; i <= numOfQ; i++){
        if (parseInt(document.getElementById(i).value.trim()) != getAnswer(termNum, questions[i - 1])){
            wrong.push(i);
        }
    }

    // check if all correct (wrong is empty)
    if (wrong.length === 0){
        alert("all correct!");
        // get code
        let sectNum = document.getElementById("correct-but").getAttribute("data1-value");
        let pageNum = document.getElementById("correct-but").getAttribute("data2-value");
        let wbName = document.getElementById("correct-but").getAttribute("data3-value");
        getCode(wbName, sectNum, pageNum);
        

        return;
    }

    // some are wrong
    alert("some are wrong: " + wrong);


}


// checks to make sure there are no empty inputs
function noneEmpty(num){
    for (let i = 1; i <= num; i++){
        if (document.getElementById(i).value.trim() === ""){
            return false;
        }
    }
    return true;
}


// checks if all inputs are numbers
function allNumbers(num){
    for (let i = 1; i <= num; i++){
        if (isNaN(document.getElementById(i).value.trim())){
            return false;
        }
    }
    return true;
}


function getAnswer(termNum, question){
    let answer = 0;

    for (let i = 1; i <= termNum; i++){
        answer += question["Num" + i];
    }
    return answer;

}


function getCode(wbName, sectNum, pageNum){

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
        

            if (this.responseText === "false"){
                
                return "false";
            }
            alert("this is the code: " + this.responseText);
        }
       
    };
    

    xhttp.open("GET", "/workbooks/code?wbName=" + wbName + "&sectNum=" + sectNum + "&pageNum=" + pageNum);
    xhttp.send();
}