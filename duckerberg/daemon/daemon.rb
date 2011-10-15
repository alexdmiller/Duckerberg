require 'eventmachine'
require 'em-websocket'

EventMachine.run {
  EventMachine::WebSocket.start(:host => "127.0.0.1", :port => 8080) do |socket|
    socket.onopen {
      socket.send "Connection opened up bro"
    }

    socket.onmessage { |msg|
      socket.send "huzzah got your: #{msg}"
    }
  end
}
