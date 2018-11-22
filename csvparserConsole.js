/*
Author: Fatih Özcelik

Project: Javascript Programming challenge from Morning Train.
Project description: "The goal of the challenge is to build a CSV parser as an includable NPM (file) module."
*/

var fs = require('fs')

var headers;
var dataArr = [];
var jsObjectsArr = [];
var jsObject = {};
var jsonString;
var fileName;

const args = process.argv;
if(args[2]!== undefined || typeof args[2] !== 'undefined'){
	fileName = args[2]; 
}

//To avoid reading the whole file into memory at once, stream is used
var readStream = fs.createReadStream(fileName, 'utf8');
	//Error handling
	readStream.on('error', function(err){
		console.error(err);
	});

//Read the first line, get the headers and put them in the data-array
readStream.on('data', function(data){	
	headers = data.split("\n")[0];
	dataArr.push(headers.split(','));

	//get the next lines
	for(var i=1; ; i++) {
		var nextLine = data.split("\n")[i];
		//if the next line is undefined, it means we have reached the end and therefore we need to break
		if(nextLine !== undefined || typeof nextLine !== 'undefined'){
			dataArr.push(nextLine.split(','));
		} else {
			break;
		}
	}

	//remove last item (which is empty) from array
	dataArr.pop();

	//close the stream
	readStream.destroy();
});

readStream.on('close', function(){
	for(var j=1; j<dataArr.length; j++) {
		for(var i=0; i<dataArr[0].length; i++) {
			//Get the headers, which are located at 0,X in the "2D" data-array.
			tempHeader = dataArr[0][i];
			//Construct JSON objects by accessing the j,i element in the data-array.
			//j begins at 1 because the headers are placed at 0.
			jsObject[tempHeader] = dataArr[j][i];
		}
		//put the JavaScript-objects into the array of JavaScript-objects
		jsObjectsArr.push(jsObject);
		//reset jsObject, so that it can be re-used in the above loop
		jsObject = {};
	}
	//Convert the array of JavaScript-objects into a JSON-String
	jsonString = JSON.stringify(jsObjectsArr);
	console.log(jsonString);

	//write to a file
	jsonFileName = fileName.replace(".csv", ".json");
	fs.writeFile(jsonFileName, jsonString, 'utf8', function(err) {
		if (err){
			return console.log(err);
		}
	});
});


