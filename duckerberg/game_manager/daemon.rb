require 'redis'
require 'web_socket'
load    'game_manager.rb'


SLEEP_TIME = 0.2

class GameDaemon
  def initialize
    @game_manager  = GameManager.new
    @outward_socket = WebSocket.new("ws://localhost:8080/")
    @redis          = Redis.new

    # Monitoring Loop
    loop {
      handle_outbox
      @outward_socket.send("READ")
      sleep(SLEEP_TIME)
    }
  end

  def handle_outbox
    message = @redis.spop("inbox")
    return if message.nil?
    @redis.srem("inbox", message)
    begin
      message_hash            = JSON.parse(message)
      message_hash["message"] = JSON.parse(message_hash["message"])
      @game_manager.handle_message(message_hash)
    rescue
      @redis.sadd("inbox", message)
      @game_manager.log_message("returned message to outbox:: #{message}")
    end
  end

  def pass_message(message)
    @redis.sadd("outbox", message)
  end
end

GameDaemon.new
