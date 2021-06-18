let totalPlayed = 0;
let currSign = '';
let currMode = "";

// if answered correctly, then true
// if not, then false
let rightWrong = [];

let ended = false;



// get operation/sign selection (addition, subtraction...) (show the page)
function getOperation(){
    document.getElementById("startGame").style.display = "none";
    document.getElementById("operationSelect").style.display = "block";
}



// show the page to choose the mode
function showModeSelect(sign){
    document.getElementById("operationSelect").style.display = "none";
    document.getElementById("modeSelect").style.display = "block";
    currSign = sign;
}



function play(mode){

    if (currSign === "" || currSign === null || mode === "" || mode === null){
        return;
    }

    currMode = mode.trim().toLowerCase();

    document.getElementById("startGame").style.display = "none";
    document.getElementById("operationSelect").style.display = "none";
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("liveGame").style.display = "flex";

    if (currMode === "easy"){
        if (currSign === "+" || currSign === "*"){
            randQuestion(1, currSign, 2, document.getElementById("choices").childElementCount);
            return;
        }
        
        if (currSign === "/"){
            randQuestionDivision(2, 1, document.getElementById("choices").childElementCount);
        }
        
        if (currSign === "-"){
            randQuestionMinus(1, 1, document.getElementById("choices").childElementCount);
        }
        
    }

    if (currMode === "medium"){
        if (currSign === "+" || currSign === "*"){
            randQuestion(2, currSign, 2, document.getElementById("choices").childElementCount);
            return;
        }

        if (currSign === "/"){
            randQuestionDivision(3, 2, document.getElementById("choices").childElementCount);
        }

        if (currSign === "-"){
            randQuestionMinus(2, 1, document.getElementById("choices").childElementCount);
        }
        
        
    }

    if (currMode === "hard"){
        if (currSign === "+"){
            randQuestion(3, currSign, 3, document.getElementById("choices").childElementCount);
            return;
        }
        if (currSign === "*"){
            randQuestion(2, currSign, 3, document.getElementById("choices").childElementCount);
            return;
        }

        if (currSign === "/"){
            randQuestionDivision(4, 2, document.getElementById("choices").childElementCount);
        }

        if (currSign === "-"){
            randQuestionMinus(3, 2, document.getElementById("choices").childElementCount);
        }
        
    }
    
    //randQuestion(2, currSign, 2, document.getElementById("choices").childElementCount);

}



// creates a random question, given the number of digits, and the sign, and the number of terms
// numOfDigits must be >= 1
// numOfTerms >= 2
// lenPossA is the number of possible answer choices shown to user
function randQuestion(numOfDigits, sign, numOfTerms, lenPossA){
    console.log("sign: " + sign);
    let question = "";
    let terms = [];
    //let answer = 0;

    if (numOfDigits <= 0 || numOfTerms <= 1){
        return question;
    }

    let min = getFirstNum(numOfDigits);
    let max = getLastNum(numOfDigits);

    for (let i = 0; i < numOfTerms; i++){
        let num = genRanInt(min, max);
        if (i === (numOfTerms - 1)){
            question += num;
        }else {
            question += num + " " + sign + " ";
        }
        terms.push(num);
        //answer += num;
    }


    let answer = getAnswer(terms);
    console.log("fewlkwe: " + terms);
    

    question += " = ?"
    let possAnswers = getPossAnswers(answer, lenPossA);

    showQuestion(terms, possAnswers, question); 
}





// generate the first num for the given # of digits 
function getFirstNum(numOfDigits){
    // min first num
    let num = 1;
    for (let i = 1; i < numOfDigits; i++){
        num *= 10;
    }

    return num;
}


// generate the last num for the given # of digits
function getLastNum(numOfDigits){
    // min last num
    let num = "9";
    for (let i = 1; i < numOfDigits; i++){
        num += "9";
    }

    return parseInt(num);
}


// generates random number [min, max]
function genRanInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function randQuestionMinus(numDigitsFirst, numDigitsSec, lenPossA){
    console.log("division;;;;;;");
    let question = "";
    let terms = [];

    let firstNumFirst = getFirstNum(numDigitsFirst);
    let lastNumFirst = getLastNum(numDigitsFirst);

    let firstNumSec = getFirstNum(numDigitsSec);
    let lastNumSec = getLastNum(numDigitsSec);

    let firstTerm = genRanInt(firstNumFirst, lastNumFirst);

    let secTerm = genRanInt(firstNumSec, lastNumSec);

    let counter = 0;

    while (firstTerm < secTerm){
        secTerm = genRanInt(firstNumSec, lastNumSec);
        console.log(counter++);
        if (counter === 10){
            firstTerm = genRanInt(firstNumFirst, lastNumFirst);
            counter = 0;
        }
    }

    question = firstTerm + " - " + secTerm + " = ?";
    terms.push(firstTerm);
    terms.push(secTerm);
    let answer = getAnswer(terms);
    
    let possAnswers = getPossAnswers(answer, lenPossA);


    console.log("Div: answer: " + answer);
    console.log(terms);

    showQuestion(terms, possAnswers, question); 
}



// generate random question for division, given the num of digits of first term, and second term
// only two terms
// must conclude in a (whole) integer answer
function randQuestionDivision(numDigitsFirst, numDigitsSec, lenPossA){
    console.log("division;;;;;;");
    let question = "";
    let terms = [];

    let firstNumFirst = getFirstNum(numDigitsFirst);
    let lastNumFirst = getLastNum(numDigitsFirst);

    let firstNumSec = getFirstNum(numDigitsSec);
    let lastNumSec = getLastNum(numDigitsSec);

    let firstTerm = genRanInt(firstNumFirst, lastNumFirst);

    let secTerm = genRanInt(firstNumSec, lastNumSec);

    let counter = 0;

    while (firstTerm % secTerm != 0){
        secTerm = genRanInt(firstNumSec, lastNumSec);
        console.log(counter++);
        if (counter === 10){
            firstTerm = genRanInt(firstNumFirst, lastNumFirst);
            counter = 0;
        }
    }

    question = firstTerm + " / " + secTerm + " = ?";
    terms.push(firstTerm);
    terms.push(secTerm);
    let answer = getAnswer(terms);
    
    let possAnswers = getPossAnswers(answer, lenPossA);


    console.log("Div: answer: " + answer);
    console.log(terms);

    showQuestion(terms, possAnswers, question); 



}



// generates an array with one element being the correct answer 
// given the correct answer and what the array length should be
// len must be less than 17
function getPossAnswers(answer, len){
    let poss = [];
    
    let index = genRanInt(0, (len - 1));

    for (let i = 0; i < len; i++){
        if (i === index){
            poss.push(answer);
        }else {
            // if 1, add
            // if 0, subtract
            let sign = genRanInt(0,1);
            let num = genRanInt(1,9);
            while (poss.includes(num)){
                num = genRanInt(1,9);
            }
            if (sign === 1){
                let newNum = answer + num;
                while (poss.includes(newNum)){
                    num = genRanInt(1,9);
                    newNum = answer + num;
                }
                poss.push(newNum);
            }else {
                let newNum = answer - num;
                while (poss.includes(newNum)){
                    num = genRanInt(1,9);
                    newNum = answer - num;
                }
                poss.push(newNum);
            }
        }
    }

    return poss;
}

function clearGameStats(){
    rightWrong = [];
    totalPlayed = 0;
}


// checks if the answer clicked is right or wrong
function checkAnswer(choice, terms){
    let answer = 0;
    console.log("terms: " + terms);
    let arr = terms.split(",");
    let len = arr.length;

    /*for (let i = 0; i < len; i++){
        console.log(arr[i]);
        answer += parseInt(arr[i]);
    }*/


    answer = getAnswer(terms);


    

    console.log("answer: " + answer);
    console.log("choice: "+ choice);

    totalPlayed++;


    if (answer === parseInt(choice)){
        document.getElementById("q" + totalPlayed).innerHTML = "&check;";
        rightWrong.push(true);
    }else {
        document.getElementById("q" + totalPlayed).innerHTML = "&#10005;";;
        rightWrong.push(false);
    }
    
    document.getElementById("q" + totalPlayed).className = "done";
    

    if (totalPlayed <= 9){
        play(currMode);
    }else {
        let arr = rightWrong;
        clearGameStats();
        showEndGame(countCorrect(arr));
    }


}


// given an array, count the number of true (correct)
function countCorrect(arr){
    let correct = 0;
    let tot = arr.length;
    for (let i = 0; i < tot; i++){
        if (arr[i]){
            correct += 1;
        }
    }

    return correct + "/"  + tot;
}






// generate how many batteries are earned
function batteryEarned(score){

}


/*

signs = +, -, /, *

levels: easy, medium, hard


*/





// ----------------------- calculates answers given the terms
function getAnswer(terms){
    console.log("ndwoendweieiiiiiiiiiii: " + terms);
    console.log("THE SIGNNNN: " + currSign)
    let arr = terms.toString().split(",");
    if (currSign === '+'){
        console.log("entered the plus palace.");
        console.log("nferbferiofneorn -------------: " + calcAnswerPlus(terms));
        return calcAnswerPlus(arr);
    }else if (currSign=== "-"){
        return calcAnswerMinus(arr);
    }else if (currSign=== "*"){
        return calcAnswerMultiply(arr);
    }else if (currSign === "/"){
        return calcAnswerDivide(arr);
    }else {
        return 0;
    }
}

function calcAnswerPlus(terms){
    
    console.log("hi");
    if (terms === null){
        return 0;
    }
    let answer = 0;

    let len = terms.length;
    for (let i = 0; i < len; i++){
        
        answer += parseInt(terms[i]);
    }
    console.log("plus paalce answer: " + answer);
    return answer;  
}


function calcAnswerMinus(terms){
    if (terms === null){
        return 0;
    }

    let len = terms.length;

    if (len === 0){
        return 0;
    }


    let answer = parseInt(terms[0]);

    for (let i = 1; i < len; i++){
        answer -= parseInt(terms[i]);
    }

    return answer;
}

function calcAnswerMultiply(terms){
    if (terms === null){
        return 0;
    }
    let answer = 1;

    let len = terms.length;
    for (let i = 0; i < len; i++){
        answer *= parseInt(terms[i]);
    }

    return answer;
}


function calcAnswerDivide(terms){
    if (terms === null){
        return 0;
    }

    let len = terms.length;

    if (len === 0){
        return 0;
    }


    let answer = parseInt(terms[0]);
    for (let i = 1; i < len; i++){
        answer /= parseInt(terms[i]);
    }

    return answer;
}





// ------------------------ view

function showQuestion(terms, possAnswers, question){
    console.log("showing: " + terms);
    document.getElementById("question").innerHTML = question;
    let len = possAnswers.length;

    // check if possAnswers.len and the answers in document are same
    if (len != document.getElementById("choices").childElementCount){
        return;
    }

    for (i = 1; i <= len; i++){
        document.getElementById("a" + i).innerHTML = possAnswers[i-1];
        document.getElementById("a" + i).value = terms;
    }

}




// clear questions check marks/ x and colours
function clearScoreBar(len){
    clearGameStats();
    for (let i = 1; i <= len; i++){
        let score = document.getElementById("q" + i);
        score.innerHTML = "";
        score.className = "unanswered";
    }

}



function showEndGame(score){
    document.getElementById("endGame").style.display = "flex";
    document.getElementById("totScore").innerHTML = "Final Score: " + score;
    document.getElementById("liveGame").style.pointerEvents = "none";
}


function doNothingEndGame(){
    document.getElementById("endGame").style.display = "none";
    document.getElementById("liveGame").style.pointerEvents = "none";
    document.getElementById("menuIcon").style.pointerEvents = "auto";
    ended = true;
}


function closeEndGame(){
    document.getElementById("endGame").style.display = "none";
    document.getElementById("optionsContainer").style.display = "none";
    document.getElementById("liveGame").style.pointerEvents = "auto";
    clearScoreBar(10);
    play(currMode);
    ended = false;
}



function goToMenu(){
    clearScoreBar(10);
    document.getElementById("endGame").style.display = "none";
    document.getElementById("optionsContainer").style.display = "none";
    document.getElementById("liveGame").style.display = "none";
    document.getElementById("modeSelect").style.display = "none";
    document.getElementById("liveGame").style.pointerEvents = "auto";
    totalPlayed = 0;
    currSign = '';
    currMode = "";
    rightWrong = [];
    document.getElementById("mainMenu").style.display = "flex";
    document.getElementById("startGame").style.display = "block";
}


function optionsMenu(){
    document.getElementById("optionsContainer").style.display = "flex";
    document.getElementById("liveGame").style.pointerEvents = "none";
}


function closeOptions(){
    document.getElementById("optionsContainer").style.display = "none";
    if (!ended){
        document.getElementById("liveGame").style.pointerEvents = "auto";
    }
    


}
