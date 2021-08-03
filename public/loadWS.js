
function readFile(){
    let files = document.getElementById("file").files;
    if (files=== null || files.length <= 0){
        return;
    }
   
    loadFileAsText(files[0]);
    

    
}


// creator of basecode: https://stackoverflow.com/questions/31746837/reading-uploaded-text-file-contents-in-html
// and me
function loadFileAsText(){
    var fileToLoad = document.getElementById("file").files[0];
  
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        //console.log(JSON.parse(textFromFileLoaded.toString()));

        let text = textFromFileLoaded.toString();
        let wsJSON;
        console.log("text:" + text);
        try{
            console.log(JSON.parse(text));
            wsJSON = JSON.parse(text);
        }catch(e){
            console.log("not json");
            return;
        }

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                
            }
        }

        xhttp.open("POST", "/admin/saveLoadedWS");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(wsJSON));

    

        
    };
  
    fileReader.readAsText(fileToLoad, "UTF-8");
}