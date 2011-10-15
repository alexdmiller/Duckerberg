require 'redis'
require 'web_socket'
load    'game_manager.rb'


LOOP_RATE = 0.2

class GameDaemon
  def initialize
    @game_manager  = GameManager.new
    @outward_socket = WebSocket.new("ws://localhost:8080/")
    @redis          = Redis.new
		@game_manager.log_message("Starting up Game Server")

    # Monitoring Loop
    loop {
			start = Time.now.to_f

      handle_inbox
			@game_manager.prepare_game_signals
      @outward_socket.send("READ")

			margin = Time.now.to_f - start
			sleep_time = (margin > LOOP_RATE ? LOOP_RATE : LOOP_RATE - margin)
      sleep(sleep_time)
    }
  end

  def handle_inbox
    message = @redis.spop("inbox")
    return if message.nil?
    @redis.srem("inbox", message)
    begin
      message_hash            = JSON.parse(message)
      message_hash["message"] = JSON.parse(message_hash["message"])
      @game_manager.handle_message(message_hash)
    rescue
      @redis.sadd("inbox", message)
      @game_manager.log_message("returned message to outbox:: #{message} :: #{$!}")
    end
  end

  def pass_message(message)
    @redis.sadd("outbox", message)
  end
end

GameDaemon.new
