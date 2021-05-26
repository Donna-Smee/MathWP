function sendAdminLogin(){
    let u = document.getElementById("username").value.trim();
    let p = document.getElementById("password").value;

    let data = {
        u: u,
        p: p
    }

    console.log(p);
    console.log(u);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 ){
            //alert(this.responseText);
            document.open();
            document.write(xhttp.responseText);
            document.close();
        }
    }

    xhttp.open("POST", "/admin/login");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}