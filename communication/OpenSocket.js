var socket;
var id = 1;

//0 means disabled; 1 means enabled;  
var popupStatus = 0; 
 $(document).ready(function(){
   connect();
   $("#scoreclick").click(sendScore);
   $("#powerupclick").click(sendPowerUp);
   $("#requestclick").click(sendJoinRequest);
   $("#aliveclick").click(sendAlive);

	centerPopup();
	loadPopup();
	
	$("#name").keypress(function(event) {
		if(event.keyCode == 13){
			sendJoinRequest($("#name").val());
			disablePopup();
		}
	  });
		
	$("#namesubmitted").click(function(){  
		if($("#name").val() != ""){
			sendJoinRequest($("#name").val());
			disablePopup();  
			}
		});  

 });
 
 function getID(){
	id = parseInt($("#user_id").val());
 }
 
 // { "type" : "set_score", "user_id" : 1, "score" : 1 }
 function sendScore(){
	getID();
	var score = parseInt($("#score").val());
	var obj = {"type":"set_score", "user_id":id, "score":score};
	socket.send(JSON.stringify(obj));
 }
 
 // { "type" : "powerup", "user_id" : 1, "powerup_name" : 1 }
 function sendPowerUp(powerup){
	getID();
	var name = powerup.name;
	var obj = {"type":"powerup", "user_id":id, "powerup_name":name};
	socket.send(JSON.stringify(obj));
 }
 
 // { "type" : "join_request", "user_name" : "derp" }
 function sendJoinRequest(name){
	var obj = {"type":"join_request", "user_name":name};
	socket.send(JSON.stringify(obj));
 }
 
 function sendAlive(){
	var obj = {"type":"still_alive"};
	socket.send(JSON.stringify(obj));
 }

function returnPowerUp(msg){
	var powerup = {"powerup_name":msg.powerup_name, "user_name":msg.user_name};
	onPowerUp(powerup);
 }
 
 function issueUserID(msg){
	onUserID(msg.user_id);
 }
 
 function passTimer(msg){
	onTimer(msg.time);
 }
 
 function passFullScoreTable(msg){
	onHighScores(msg.table);
 }
 
 function gameOver(msg){
	onEndGame();
 }
 
 function readMessage(msg){
	try{
		var parsedJSON = JSON.parse(msg);
		var type = parsedJSON.type; 
		if(type == "return_powerup"){
			returnPowerUp(type);
		}
		if(type == "issue_user_id"){
			issueUserID(type);
		}
		if(type == "pass_timer"){
			passTimer(type);
		}
		if(type == "pass_full_score_table"){
			passFullScoreTable(type);
		}
		if(type == "game_over"){
			gameOver(type);
		}
	}
	catch(exception){
	
	}
	
 }
 
function connect(){ 
	try {		
		//107.20.160.172
		//port 8080
		
		socket = new WebSocket("ws://107.20.160.172:8080");
		
		
		socket.onopen = function(msg){
			console.log("Socket succesfully opened");
		}

		socket.onmessage = function(msg){
			readMessage(msg.data);
		}

		socket.onclose = function(msg){
			console.log("Socket closed");
		}
		
	}
	
	catch(exception){
		console.log("Error" + exception);
	}
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
