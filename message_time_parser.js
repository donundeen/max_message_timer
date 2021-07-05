autowatch = 1;

outlets = 1;
var messageSet = {};
var table = [];
var messageSetKeys = [];

function clear(){
	post("clearing");
	messageSet = {};	
	table = [];	
}

function setVal(col, row, value){
    post("setVal" + col + " , " + row + " , " + value+ "\n");
    if(!table[row]){
       table[row] = [];	
    }
	if(!value){
		value = "";
	}
    table[row][col] = value.trim();
post (JSON.stringify(table));
      tableToMessageSet();
}

function tableToMessageSet(){
	post("tableToMessageSet\n");
    messageSet = {};
	post (table.length);
	for(var i = 0; i < table.length; i++){
		var row = table[i];
		
		if (row && row.length){
			var timecode = row[0];
			var value = row[1];
			if(timecode && value){
				if(!messageSet[timecode]){
					messageSet[timecode] = [];
				}
				messageSet[timecode].push(value);					
			} 
		}	
	}
	messageSetKeys = Object.keys(messageSet);
}


function getText(text){
	messageSet = {};
//	post("got text\n");
//	post(text +"\n");
	text = text.trim();
	var split = text.split(/:/);
//	post(split.length +"\n");
	
	for(var i = 0; i < split.length; i++){
		var line = split[i];
		line = line.trim();
		if(line === ""){
			continue;
		}
		line = line.replace(/text/, "");
		line = line.replace(/\s+/g, " ");
		line = line.trim();
//		post(line + "\n");
		
		var parts = line.split(/ /);
		var timecode = parts.shift();
     	timecode = timecode.trim();

		var msg = parts.join(" ");
		post( "|"+timecode+"|"+msg+"|\n");
		
		
		if(!messageSet[timecode]){
			messageSet[timecode] = [];
		}
		messageSet[timecode].push(msg);
	}		
}

function getMessage(bar, beat, sub){
	
//	getMessageRegex(bar, beat, sub);
//	return;
	
//	timecode = timecode.trim();
	var timecode = bar + "."+ beat + "." +sub;
//	post("trying to getMessage " + timecode + "\n");
    var rectimecode = "*."+beat+"."+sub;
    var rectimecode2 = "*.*."+sub;
//	post(JSON.stringify(messageSet, null, "  "));
//	outlet(0,"tessst");
	if(messageSet[timecode]){
		for(var i = 0; i < messageSet[timecode].length; i++){
			outlet(0, messageSet[timecode][i]);
		}
	}
	if(messageSet[rectimecode]){
		for(var i = 0; i < messageSet[rectimecode].length; i++){
			outlet(0, messageSet[rectimecode][i]);
		}
	}
	if(messageSet[rectimecode2]){
		for(var i = 0; i < messageSet[rectimecode2].length; i++){
			outlet(0, messageSet[rectimecode2][i]);
		}
	}	
}

function getMessageRegex(bar, beat, sub){
	var timecode = bar + "-"+ beat + "-" +sub;
	for(var i = 0; i<messageSetKeys.length; i++){
		key = messageSetKeys[i];
		if(key.charAt(0)== "/"){
			// key is a regex
			var regex = new RegExp(key.substring(1, key.length - 1));
			if(regex.test(timecode)){
				for(var i = 0; i < messageSet[key].length; i++){
					outlet(0, messageSet[key][i]);
				}				
			}
		}
	}
	

}