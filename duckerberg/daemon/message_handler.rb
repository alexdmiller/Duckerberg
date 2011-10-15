require 'json'
require 'redis'
LOG_FILE = File.join(File.dirname(__FILE__), "..", "log", "log.txt")

class MessageHandler
  def initialize
    @logger  = File.new(LOG_FILE, 'a')
    @redis   = Redis.new
    @sockets = {}
  end

  def add_socket(socket)
    id               = @sockets.size
    @sockets[id]     = socket
    @sockets[socket] = id
  end

  def log_message(message) 
    @logger.syswrite "#{Time.now} :: #{message}\n"
  end

  def receive_message(message, socket)
    log_message("received message: #{message}")
    pass_message(@redis, socket)
  end

  def pass_message(message, socket)
    formatted_message = {
      "message" => message,
      "socket_id" => 39
    }.to_json

    @redis.sadd("outbox", formatted_message)
  end

  def read_inbox
    message = @redis.spop("inbox")
    @redis.srem(message)
    begin
      message_hash     = JSON.parse(message)
      socket_id        = message_hash["socket_id"]
      original_message = message_hash["message"]
      socket           = @sockets[socket_id]
      socket.send(original_message)
    rescue
      @redis.sadd("inbox", message)
    end
  end
end
