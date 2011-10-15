
var socket;
var id = 1;

 $(document).ready(function(){
   //connect();
   $("#scoreclick").click(sendScore);
   $("#powerupclick").click(sendPowerUp);
   $("#requestclick").click(sendRequest);
   $("#aliveclick").click(sendAlive);
 });
 
 function getID(){
	id = $("#user_id").val();
 }
 
 // { "type" : "set_score", "user_id" : 1, "score" : 1 }
 function sendScore(){
	getID();
	var score = $("#score").val();
	socket.send("type : set_score, user_id : " + id + ", score :" + score);
 }
 
 function sendPowerUp(){
 
 }
 
 function sendRequest(){
 
 }
 function sendAlive(){
 
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
			alert(msg.data);
		}

		socket.onclose = function(msg){
			alert("Socket closed");
		}
		
	}
	
	catch(exception){
		alert("Error" + exception);
	}
}

function sendMessage(msg){
	socket.send(msg);

}



