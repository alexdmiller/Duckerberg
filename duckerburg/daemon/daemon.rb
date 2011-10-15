require 'eventmachine'

EventMachine.run {
  EventMachine::WebSocket.start(:host => "localhost", :port => 8080) do |socket|
    socket.onopen {
      socket.send "Connection opened up bro"
    }

    socket.onmessage { |msg|
      socket.send "huzzah got your: #{msg}"
    }
  end
}
