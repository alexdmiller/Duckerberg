require 'eventmachine'
require 'em-websocket'
load    'message_handler.rb'

handler = MessageHandler.new
sockets = {}

EventMachine.run {

  EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080) do |socket|
    socket.onopen {
      socket.send "Connection opened up bro"
      handler.log_message("Connection Opened")
      handler.add_socket(socket)
    }

    socket.onmessage { |message|
      socket.send "message received(#{message})"
      handler.receive_message(message, socket)
    }

  end
}
