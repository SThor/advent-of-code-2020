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
    let result = 1;
    let table = data.split('\n');
    table.pop();

    slopes = [
        {x:1,y:1},
        {x:3,y:1},
        {x:5,y:1},
        {x:7,y:1},
        {x:1,y:2},
    ];

    for(slope of slopes){
        result *= hitTreesForSlope(table, slope);
    }
    console.log("result",result);
}

function hitTreesForSlope(table, slope){
    let treeCounter = 0;
    let xOffset = 0;

    for(let i=slope.y; i<table.length; i+=slope.y){
        line = table[i];
        xOffset = (xOffset + slope.x)%line.length;
        if(line[xOffset] === '#'){
            console.log(line.replaceAt(xOffset,'X'));
            treeCounter++
        }else{
            console.log(line.replaceAt(xOffset,'O'));
        }
    }

    console.log("Hit ",treeCounter,"trees for slope",slope);
    return treeCounter;
}
