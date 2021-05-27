function loadLogs(num){
    console.log(num);
    let year = document.getElementById("year").value.trim();
    let month = document.getElementById("month").value.trim();

    if (num === -1){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                document.open();
                document.write(xhttp.responseText);
                document.close();
            }
        }

        xhttp.open("GET", "/admin/log/all");
        xhttp.send();
    }

    if (year === "" && month === ""){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                document.open();
                document.write(xhttp.responseText);
                document.close();
            }
        }

        xhttp.open("GET", "/admin/log?limit=" + num);
        xhttp.send();
        
    }

    if (year === ""){
        let data = {month: month, limit: num};
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                document.open();
                document.write(xhttp.responseText);
                document.close();
            }
        }

        xhttp.open("POST", "/admin/log/month");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
    }


    if (month === ""){
        let data = {year: year, limit: num};
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                document.open();
                document.write(xhttp.responseText);
                document.close();
            }
        }

        xhttp.open("POST", "/admin/log/year");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
    }


    if (year != "" && month != ""){
        let data = {year: year, month: month, limit: num};
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                document.open();
                document.write(xhttp.responseText);
                document.close();
            }
        }

        xhttp.open("POST", "/admin/log/year/month");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
    }
}