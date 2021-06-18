// status of the menu display on smaller devices
let menuOpened = false;


function toggleMenu(){
    let tabs = document.getElementsByClassName("tab");
    let len = tabs.length;

    if (len <= 0){
        return;
    }

    if (menuOpened){
        for (let i = 0; i < len; i++){
            tabs[i].style.display = "none";
            menuOpened = false;
        }
        document.getElementById("cart-icon").style.display = "none";
    }else {
        for (let i = 0; i < len; i++){
            tabs[i].style.display = "block";
            menuOpened = true;
        }
        document.getElementById("cart-icon").style.display = "block";
    }
}