
//0 means disabled; 1 means enabled;  
var popupStatus = 0; 

function setupUI(){
	console.log("In UI setup");
	centerPopup();
	loadPopup();
	
	$("#name").keypress(function(event) {
		if(event.keyCode == 13 && $("#name").val() != ""){
			sendJoinRequest($("#name").val());
			disablePopup();
			var x = {"table":[{"user_name":"Harnoor", "score":10}, {"user_name":"Tyler", "score":20}, {"user_name":"Alex", "score":30}, {"user_name":"David", "score":14}]};
			loadHighScores(JSON.stringify(x));
		}
	  });
		
	$("#namesubmitted").click(function(){  
		if($("#name").val() != ""){
			sendJoinRequest($("#name").val());
			disablePopup();  
			}
		});  
}

 
 function loadHighScores(msg){
	var x = msg.table;
	if(x == null)
		return;
	var score = -1;
	$("#high_scores > tbody:last").text("");
	for(var i = 0; i<x.length; i++){
		user = x[i].user_name;
		score = x[i].score;
		var text = '<tr><td>' + user + '</td><td>' + score + '</td></tr>';
		if(id == x[i].user_id)
			text = '<tr><td><b>' + user + '</b></td><td><b>' + score + '</b></td></tr>';
		$("#high_scores > tbody:last").append(text);
	}
}


function displayNewMessage(msg, msgID){
	var text = "<div class=messages id=" + msgID + ">" + msg + "</div>";
	$("#message").append(text);
}

function removeMessage(msgID){
	console.log("called removed on " + msgID);
	console.log($("#" + msgID));
	$("#" + msgID).fadeOut('slow');
}



//loading popup with jQuery magic!  
function loadPopup(){  
	//loads popup only if it is disabled  
	if(popupStatus==0){  
		$("#backgroundPopup").css({  
		"opacity": "0.7"  
		});  
		$("#backgroundPopup").fadeIn("slow");  
		$("#popupContact").fadeIn("slow");  
		popupStatus = 1;  
	}
}

//disabling popup with jQuery magic!  
function disablePopup(){  
	//disables popup only if it is enabled  
	if(popupStatus==1){  
		$("#backgroundPopup").fadeOut("slow");  
		$("#popupContact").fadeOut("slow");  
		popupStatus = 0;  
	}  
}

//centering popup  
function centerPopup(){  
	//request data for centering  
	var windowWidth = document.documentElement.clientWidth;  
	var windowHeight = document.documentElement.clientHeight;  
	var popupHeight = $("#popupContact").height();  
	var popupWidth = $("#popupContact").width();  
	//centering  
	$("#popupContact").css({  
	"position": "absolute",  
	"top": windowHeight/2-popupHeight/2,  
	"left": windowWidth/2-popupWidth/2  
	});  
//only need force for IE6  
  
	$("#backgroundPopup").css({  
	"height": windowHeight  
});  
}