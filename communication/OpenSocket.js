var socket;
var id = 1;

var onPowerUp;
var onTimer;
var onEndGame;

function setupSocket(){
   connect();
}
 
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
	id = msg.user_id;
 }
 
 function passTimer(msg){
	onTimer(msg.time);
 }
 
 function gameOver(msg){
	onEndGame();
 }
 
 function readMessage(msg){
		var parsedJSON = JSON.parse(msg);
		var type = parsedJSON.type; 
		if(type == "return_powerup"){
			returnPowerUp(parsedJSON);
		}
		if(type == "issue_user_id"){
			issueUserID(parsedJSON);
		}
		if(type == "pass_timer"){
			passTimer(parsedJSON);
		}
		if(type == "pass_full_score_table"){
			loadHighScores(parsedJSON);
		}
		if(type == "game_over"){
			gameOver(parsedJSON);
		}
 }
 
function connect(){ 
	try {		
		socket = new WebSocket("ws://107.20.160.172:8080");
		
		socket.onopen = function(msg){
			console.log("Socket succesfully opened");
		}

		socket.onmessage = function(msg){
			console.log(msg.data);
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

  
  
