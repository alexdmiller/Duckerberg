# MessageHandler
#
# Handles sockets of clients and their messages.
# Sends the messages to the Game Server through a set on redis,
# and Sends messages back to clients through a set on redis

require 'json'
require 'redis'
LOG_FILE = File.join("/home/ubuntu", "duckerberglog", "websocket_log.txt")
INBOX    = "inbox"
OUTBOX   = "outbox"

class MessageHandler
  def initialize
    @logger  = File.new(LOG_FILE, 'a')
    log_message("Starting up Duckerberg server")

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

    # Destroy on the Game Manager Side
    message = { "type" => "destroy_socket" }.to_json
    pass_message(message, socket)

    # Destroy on the WebSocket Manager Side
    @sockets.delete(id)
    @sockets.delete(socket)
    log_message("Destroyed Closed Socket Connection #{id}")
  end

  # Takes a message and passes it on to Game Server
  def receive_message(message, socket)
    if message == "READ"
      process_outbox
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

  # Passes a message to the Game Server with data on socket_id
  def pass_message(message, socket)
    formatted_message = {
      "message" => JSON.parse(message),
      "socket_id" => @sockets[socket]
    }.to_json

    @redis.rpush(INBOX, formatted_message)
  end

  # Processes messages sent from the Game Server meant for the clients
  def process_outbox
    while message = @redis.lpop(OUTBOX)
      begin
        log_message("Message is #{message.inspect}")
        message_hash     = JSON.parse(message)
        socket_id        = message_hash["socket_id"]
        original_message = message_hash["message"].to_json
        socket           = @sockets[socket_id]
        send_to_socket(socket, original_message)
      rescue
        # @redis.rpush(OUTBOX, message)
        log_message("returned message to outbox:: #{message}")
      end
    end
    true
  end

  def send_to_socket(socket, message)
    begin
      socket.send(message)
      socket_id = @sockets[socket]
      log_message("sent message to socket #{socket_id} :: #{message}")
    rescue
      log_message("sending to socket #{socket_id} failed:: #{$!} #{$!.backtrace}")
    end
  end

  ## Misc
  def log_message(message)
    @logger.syswrite "#{Time.now} :: #{message}\n"
  end
end
