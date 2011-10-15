require 'eventmachine'
require 'em-websocket'
load    'message_handler.rb'

handler = MessageHandler.new

EventMachine.run {
  EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080) do |socket|
    socket.onopen {
      socket.send "Connection opened up bro"
      puts "Opened Connection"
    }

    socket.onmessage { |message|
      socket.send "message received(#{message})"
      handler.receive_message(msg)
    }
  end
}
