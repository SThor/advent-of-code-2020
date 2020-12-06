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
    let table = data.split('\n\n');
    table.pop();

    for(let passportString of table){
        let passportArray = passportString.split(/[ \n]+/).map(entryString => entryString.split(':'));
        let passport = {};
        for(let entryArray of passportArray){
            //console.log(entryArray);
            passport[entryArray[0]] = entryArray[1];
        }

        delete passport['cid']; //remove optional value

        let subresult = true, result = true;
        for(let key of Object.keys(passport)){
            let number = 0;
            switch(key){
                case 'byr':
                number = parseInt(passport[key],10);
                subresult = !isNaN(number) && (passport[key].match(/[0-9]{4}/) !== null) && checkRange(number,1920,2002);
                break;
                case 'iyr':
                number = parseInt(passport[key],10);
                subresult = !isNaN(number) && (passport[key].match(/[0-9]{4}/) !== null) && checkRange(number,2010,2020);
                break;
                case 'eyr':
                number = parseInt(passport[key],10);
                subresult = !isNaN(number) && (passport[key].match(/[0-9]{4}/) !== null) && checkRange(number,2020,2030);
                break;
                case 'hgt':
                let cmIndex = passport[key].indexOf("cm");
                let inIndex = passport[key].indexOf("in");
                if(cmIndex != -1){
                    number = parseInt(passport[key].substring(0,cmIndex),10);
                    subresult = !isNaN(number) && checkRange(number,150,193);
                }else if(inIndex != -1){
                    number = parseInt(passport[key].substring(0,inIndex),10);
                    subresult = !isNaN(number) && checkRange(number,59,76);
                }else{
                    subresult = false;
                }
                break;
                case 'hcl':
                subresult = (passport[key].match(/#[a-f0-9]{6}/) !== null);
                break;
                case 'ecl':
                subresult = (passport[key].match(/\bamb|\bblu|\bbrn|\bgry|\bgrn|\bhzl|\both/) !== null);
                break;
                case 'pid':
                subresult = (passport[key].match(/^[0-9]{9}$/) !== null);
                break;
            }
            result &= subresult;
            if(!subresult){
                console.log(key, passport[key]);
                break;                
            }    
        }
        if(result && Object.keys(passport).length >= 7){
            resultSecondPart++;
        }

        if(Object.keys(passport).length >= 7){
            resultFirstPart++;
        }
    }

    console.log("Valid passports found in first part:",resultFirstPart)
    console.log("Valid passports found in second part:",resultSecondPart)
}

function checkRange(value, min, max){
    return (value >= min && value <= max);
}
