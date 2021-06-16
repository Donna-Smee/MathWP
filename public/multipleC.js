let totalPlayed = 0;
let currSign = '+';
let currMode = "";

// if answered correctly, then true
// if not, then false
let rightWrong = [];



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
        
        
    }

    if (currMode === "medium"){
        if (currSign === "+" || currSign === "*"){
            randQuestion(2, currSign, 2, document.getElementById("choices").childElementCount);
            return;
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
    let answer = 0;

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
        answer += num;
    }

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



// checks if the answer clicked is right or wrong
function checkAnswer(choice, terms){
    let answer = 0;
    let arr = terms.split(",");
    let len = arr.length;

    for (let i = 0; i < len; i++){
        console.log(arr[i]);
        answer += parseInt(arr[i]);
    }

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
        rightWrong = [];
        totalPlayed = 0;
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





// ------------------------ view

function showQuestion(terms, possAnswers, question){
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



function closeEndGame(){
    document.getElementById("endGame").style.display = "none";
    document.getElementById("liveGame").style.pointerEvents = "auto";
    clearScoreBar(10);
    play(currMode);
}





