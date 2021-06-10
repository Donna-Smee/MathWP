// clear the item number value on html page
function clearNumValue(){
    document.getElementById("valueItem").innerHTML = "";
}



function increaseNumValue(){
    let value = document.getElementById("valueItem");
    let num = parseInt(value.innerHTML) + 1;

    clearNumValue();
    value.innerHTML = num;
}



function decreaseNumValue(){
    let value = document.getElementById("valueItem");

    if (parseInt(value.innerHTML) <= 1){
        return;
    }

    let num = parseInt(value.innerHTML) - 1;

    clearNumValue();
    value.innerHTML = num;
}


// resets to 1
function resetNumValue(){
    clearNumValue();
    document.getElementById("valueItem").innerHTML = 1;
}


function updateCartFromProductPage(id){
    console.log(id);
    let amount = document.getElementById("valueItem").innerHTML;

    if (isNaN(amount) || amount === "" || amount === null){
        alert("problem cannot add");
        return;
    }

    addToCart(id, amount);
}


// adding item to cart
function addToCart(id, amount){

    console.log("wbID: " + id);
    console.log("amount: " + amount);

    data = {
        wbID: id,
        amount: amount
    }
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            document.open();
            document.write(this.responseText);
            document.close();
            window.location = "/cart" 
            
        }
    }

    xhttp.open("PUT", "/cart/addToCart");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}



// changing cart item/value from cart page
function updateCart(id, changeAmount){
    let a = document.getElementById("amount" + id).innerHTML;
    console.log(a);
    if (isNaN(a) || a === null){
        alert("cannot change");
        return;
    }


    if (parseInt(a) <= 1 && changeAmount === -1){
        deleteFromCart(id);
        return;
    
    }

    let newAmount = changeAmount + parseInt(a);


    addToCart(id, changeAmount);
    

}



function deleteFromCart(id){
    data = {
        wbID: id,
    }
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            document.open();
            document.write(this.responseText);
            document.close();
            window.location = "/cart" 
            
        }
    }

    xhttp.open("PUT", "/cart/removeFromCart");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}



