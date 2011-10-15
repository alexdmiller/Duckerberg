require 'json'
require 'redis'
INLOG_FILE = File.join("/home/ubuntu", "duckerberglog", "inlog.txt")

class MessageHandler
  def initialize
    @inlogger  = File.new(INLOG_FILE, 'a')
    @redis   = Redis.new
    @sockets = {}
    @current_new_socket_id = 0
  end

  def add_socket(socket)
    id               = @current_new_socket_id
    @sockets[id]     = socket
    @sockets[socket] = id
    log_message("Connection Opened -- Socket id: #{id}")
    @current_new_socket_id += 1
  end

  def destroy_socket(socket)
    id = @sockets[socket]
    @sockets.delete(id)
    @sockets.delete(socket)
    log_message("Destroyed Closed Socket Connection #{id}")
    message = { "type" => "destroy_socket" }.to_json
    pass_message(message, socket)
  end

  def receive_message(message, socket)
    if message == "READ"
      read_outbox
      return
    end

    if message == "GAME_SERVER"
      destroy_socket(socket)
      return
    end

    socket_id = @sockets[socket]
    log_message("Received message from socket #{socket_id} : #{message}")
    pass_message(message, socket)
  end

  def pass_message(message, socket)
    formatted_message = {
      "message" => message,
      "socket_id" => @sockets[socket]
    }.to_json

    @redis.sadd("inbox", formatted_message)
  end

  def read_outbox
    message = @redis.spop("outbox")
    return if message.nil?

    @redis.srem("outbox", message)
    begin
      message_hash     = JSON.parse(message)
      socket_id        = message_hash["socket_id"]
      original_message = message_hash["message"]
      socket           = @sockets[socket_id]
      send_to_socket(socket, original_message, socket_id)
    rescue
      @redis.sadd("outbox", message)
      log_message("returned message to outbox:: #{message}")
    end
    true
  end

  def send_to_socket(socket, message, socket_id)
    begin
      socket.send(message)
      log_message("sent message to socket #{socket_id} :: #{message}")
    rescue
      log_message("sending to socket #{socket_id} failed:: #{$!}")
    end
  end


  ## Misc
  def log_message(message)
    @inlogger.syswrite "#{Time.now} :: #{message}\n"
  end
end

