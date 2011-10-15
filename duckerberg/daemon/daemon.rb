require 'eventmachine'
require 'em-websocket'

EventMachine.run {
  EventMachine::WebSocket.start(:host => "127.0.0.1", :port => 8080) do |socket|
    socket.onopen {
      socket.send "Connection opened up bro"
      puts "Opened Connection"
    }

    socket.onmessage { |msg|
      socket.send "huzzah got your: #{msg}"
      puts "Received Message #{msg}"
    }
  end
}
