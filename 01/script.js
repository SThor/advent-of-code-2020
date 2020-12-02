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
    var array = data.trim().split('\n').map(x => parseInt(x,10));
    console.log(array);

    for(const x of array){
        for(const y of array){
            if(x+y == 2020){
                console.log("two numbers:",x,y,x*y);
            }
            for(const z of array){
                if(x+y+z == 2020){
                    console.log("three numbers:",x,y,z,x*y*z);
                }
            }
        }
    }
}
