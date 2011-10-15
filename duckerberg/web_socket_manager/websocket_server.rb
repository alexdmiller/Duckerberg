require 'eventmachine'
require 'em-websocket'
load    'message_handler.rb'

handler = MessageHandler.new
sockets = {}

handler.log_message("Starting up Duckerberg server")

EventMachine.run {

  EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080) do |socket|
    socket.onopen {
      handler.add_socket(socket)
    }

    socket.onmessage { |message|
      handler.receive_message(message, socket)
    }

    socket.onclose {
      handler.destroy_socket(socket)
    }

  end
}
