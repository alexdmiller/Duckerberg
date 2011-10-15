require 'json'
require 'redis'

GAME_DAEMON_LOG = File.join("/home/ubuntu", "duckerberglog", "game_daemon_log.txt")
USER_INFO = "id_pointer::"
OUTBOX = "outbox"
GAME_LENGTH = 100

class GameManager
  def initialize
    @logger          = File.new(GAME_DAEMON_LOG, 'a')
    @redis           = Redis.new
    @redis.flushdb
    log_message("Redis Flushed")

    @highest_user_id = 0
    @game_start_time = Time.now
    # user_name, user_id, socket_id, score
    @users_by_id     = {}
    @ids_by_socket   = {}
  end

  def prepare_game_signals
    log_message("Sending out game signals")
    game_time   = pass_timer
    score_table = pass_full_score_table

    @users_by_id.values.each do |user|
      post(game_time, user["socket_id"])
      post(score_table, user["socket_id"])
    end
  end

  def handle_message(message_hash)
    message = message_hash["message"]
    type    = message["type"]

    send(type, message_hash)
  end


  ### Individual Post Responses

  # returns an issue_user_id message
  def join_request(message_hash)
    user_name = message_hash["message"]["user_name"]
    socket_id = message_hash["socket_id"]
    user_id   = @highest_user_id
    user      = {
      "user_name" => user_name,
      "user_id"   => user_id,
      "socket_id" => socket_id,
      "score"     => 0
    }


    @users_by_id[user_id]     = user
    @ids_by_socket[socket_id] = user_id

    @highest_user_id += 1

    [{
      "type"    => "issue_user_id",
      "user_id" => user_id
    }, socket_id]
  end

  # returns a pass_timer message
  def pass_timer
    {
      "type" => "pass_timer",
      "time" => Time.now - @game_start_time
    }.to_json
  end

  def destroy_socket(message_hash)
    socket_id = message_hash["socket_id"]
    user_id   = @ids_by_socket[socket_id]

    @ids_by_socket.delete(socket_id)
    @users_by_id.delete(user_id)
  end

  def pass_full_score_table
    {
      "type" => "pass_full_score_table",
      "table" => @users_by_id.values.map{|user|
        {
          "user_name" => user["name"],
          "score"     => user["score"]
        }
      }
    }
  end

  # Misc functionality
  def post(message, socket_id)
    return if message.nil?
    @redis.sadd(OUTBOX,{
      "message"   => message.to_json,
      "socket_id" => socket_id
    }.to_json)
  end

  def log_message(message)
    @logger.syswrite "#{Time.now} :: #{message}\n"
  end
end
