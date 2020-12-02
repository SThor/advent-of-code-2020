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

function processData(data) {
    let validFirstPart=0, validSecondPart=0;
    var array = data.trim().split('\n').map(line => extract(line));

    for(const line of array){
        let count = line.pwd.split(line.letter).length - 1;
        if(count >= line.firstPos && count <= line.secondPos){
            validFirstPart++;
        }
        let array = line.pwd.split('');
        if( array[line.firstPos-1] === line.letter && array[line.secondPos-1] !== line.letter ||
            array[line.firstPos-1] !== line.letter && array[line.secondPos-1] === line.letter){
            validSecondPart++;
        }
    }

    console.log("1st part valid passwords found:",validFirstPart)
    console.log("2nd part valid passwords found:",validSecondPart)
}

function extract(line){
    let matches =  Array.from(line.matchAll(/(\d+)-(\d+) (\w): (\w+)$/g));
    return {firstPos:matches[0][1],secondPos:matches[0][2],letter:matches[0][3],pwd:matches[0][4]};
}
