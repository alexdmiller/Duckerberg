require 'json'
require 'redis'

GAME_DAEMON_LOG = File.join("/home/ubuntu", "duckerberglog", "game_daemon_log.txt")
USER_INFO = "id_pointer::"

class GameManager
  def initialize
    @logger          = File.new(GAME_DAEMON_LOG, 'a')
    @redis           = Redis.new
    @highest_user_id = 0
    @users           = []
    @users_by_id     = {}
    @ids_by_socket   = {}
  end

  def log_message(message)
    @logger.syswrite "#{message}\n"
  end

  def handle_message(message_hash)
    message = message_hash["message"]
  end

  def respond(hash)

  end

  ### Individual Responses
  def issue_user_id(message_hash)
    socket = message_hash["socket_id"]
    user_name = message_hash["message"]["user_name"]
    user_id = @highest_user_id
    user = [user_name, user_id, 0]


    @users << user
    @users_by_id[user_id]  = user
    @ids_by_socket[socket] = user_id

    @highest_user_id += 1

    respond({
      "type"    => "issue_user_id",
      "user_id" => user_id
    })
  end

end
