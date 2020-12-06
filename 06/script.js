function readTextFile(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                console.log(allText);
                processData(allText);
            }
        }
    }
    rawFile.send(null);
}

function dragEnter(ev){
    console.log('File(s) in drop zone'); 
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    var zone = document.getElementById('drop_zone');
    zone.style.borderColor = "pink";
}
function dragLeave(ev){
    var zone = document.getElementById('drop_zone');
    zone.style.borderColor = "lightgrey";

}

function dropHandler(ev){
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
                file.text().then(text => processData(text));
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }
    var zone = document.getElementById('drop_zone');
    zone.style.borderColor = "lightgrey";
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function processData(data) {
    console.log(data);
    let table = data.split('\n\n').map(group=>group.split('\n'));
    console.log(table);
    table.pop();

    let sumFirstPart = 0, sumSecondPart = 0;
    for(let group of table){
        let map = {};
        for(let person of group){
            for(let answer of person){
                insertOrIncrement(map,answer);
            }
        }
        sumFirstPart += Object.keys(map).length;

        for(let answers of Object.keys(map)){
            if(map[answers] === group.length){
                sumSecondPart++;
            }
        }
    }

    console.log("sumFirstPart",sumFirstPart);
    console.log("sumSecondPart",sumSecondPart);
}

function insertOrIncrement(map,key){
    if(typeof map[key] === "undefined"){
        map[key] = 1;
    }else{
        map[key] += 1;
    }
}