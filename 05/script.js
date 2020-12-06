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
    let resultFirstPart = 0, resultSecondPart = 0;
    let table = data.split('\n');
    table.pop();

    var allSeats = [];
    for (var i = 0; i <= 128*8; i++) {
        allSeats.push(i);
    }

    let maxSeatID = 0;
    for(let line of table){
        let seatID = computePosition(line);
        if(seatID>maxSeatID){maxSeatID = seatID;}

        var index = allSeats.indexOf(seatID);
        if (index !== -1) {
          allSeats.splice(index, 1);
        }
    }

    console.log("maximum seat id is",maxSeatID);
    console.log("seats left",allSeats);

}

function computePosition(line){
    let row = computeRow(line.substr(0,7));
    let column = computeColumn(line.substr(7,9));
    return row*8+column;
}

function computeRow(rowCode){
    let min = 0;
    let max = 128;
    for(let letter of rowCode){
        if(letter === 'F'){
            max -= (max-min)/2
        }else if(letter === 'B'){
            min += (max-min)/2
        }
    }
    return max-1;
}

function computeColumn(columnCode){
    let min = 0;
    let max = 8;
    for(let letter of columnCode){
        if(letter === 'L'){
            max -= (max-min)/2
        }else if(letter === 'R'){
            min += (max-min)/2
        }
    }
    return max-1;   
}
