var socket;
var id = 1;

var onPowerUp;
var onUserID;
var onTimer;
var onHighScores;
var onEndGame;

 $(document).ready(function(){
   connect();
   $("#scoreclick").click(sendScore);
   $("#powerupclick").click(sendPowerUp);
   $("#requestclick").click(sendJoinRequest);
   $("#aliveclick").click(sendAlive);
 });
 
 function getID(){
	id = $("#user_id").val();
 }
 
 // { "type" : "set_score", "user_id" : 1, "score" : 1 }
 function sendScore(){
	getID();
	var score = $("#score").val();
	socket.send("type : set_score, user_id : " + id + ", score : " + score);
 }
 
 // { "type" : "powerup", "user_id" : 1, "powerup_name" : 1 }
 function sendPowerUp(){
	getID();
	var name = $("#powerup").val();
	socket.send("type : powerup, user_id : " + id + ", powerup_name : " + name);
 }
 
 // { "type" : "join_request", "user_name" : "derp" }
 function sendJoinRequest(){
	var name = $("#request").val();
	socket.send("type : request, user_name : " + name);
 }
 
 function sendAlive(){
	socket.send("type : still_alive");
 }

function returnPowerUp(msg){
	var powerup = {"powerup_name":msg.powerup_name, "user_name":msg.user_name};
	onPowerUp(powerup);;
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
 
function connect(){ 

	try {		
		//107.20.160.172
		//port 8080
		
		socket = new WebSocket("ws://107.20.160.172:8080");
		
		
		socket.onopen = function(msg){
			alert("Socket succesfully opened");
		}

		socket.onmessage = function(msg){
			readMessage(msg.data);
		}

		socket.onclose = function(msg){
			alert("Socket closed");
		}
		
	}
	
	catch(exception){
		alert("Error" + exception);
	}
}



