# Daemon
#
# Runs an EventMachine Server with Websockets to process connections from clients
# Passes processing to MessageHandler

require 'eventmachine'
require 'em-websocket'
load    'message_handler.rb'

PORT = 8080

handler = MessageHandler.new
sockets = {}

EventMachine.run {

  EventMachine::WebSocket.start(:host => "0.0.0.0", :port => PORT) do |socket|
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
