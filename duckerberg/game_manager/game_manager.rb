require 'json'
require 'redis'
load    'message_builders.rb'

GAME_DAEMON_LOG = File.join("/home/ubuntu", "duckerberglog", "game_daemon_log.txt")
USER_INFO = "id_pointer::"
OUTBOX = "outbox"
GAME_LENGTH = 100

class GameManager
  include MessageBuilders
  def initialize
    @logger          = File.new(GAME_DAEMON_LOG, 'a')
    @redis           = Redis.new
    @redis.flushdb
    log_message("Redis Flushed")

    @highest_user_id = 0
    # user_name, user_id, socket_id, score
    @users_by_id     = {}
    @ids_by_socket   = {}
    setup_game
  end

  def setup_game
    log_message("Game Restarting...")
    @game_start_time = Time.now.to_i
    @users_by_id.values.each do |user|
      user["score"] = 0
    end
  end

  def prepare_game_signals
    game_time         = pass_timer
    score_table       = pass_full_score_table
    log_message("Sending out game signals :: Game Time: #{game_time}, Score Table: #{score_table}")
    game_over_message = game_over

    if game_over_message.nil?
      @users_by_id.values.each do |user|
        post(game_time, user["socket_id"])
        post(score_table, user["socket_id"])
      end
    else
      endgame_measures(game_over_message, score_table)
    end
  end

  def endgame_measures(game_over_message, score_table)
      @users_by_id.values.each do |user|
        post(game_over_message, user["socket_id"])
        post(score_table, user["socket_id"])
      end
      setup_game
  end

  def handle_message(message_hash)
    message = message_hash["message"]
    type    = message["type"]

    post(send(type, message_hash))
  end

  # Misc functionality
  def post(message, socket_id)
    log_message("trying to post #{message.inspect}")
    return if (not message.is_a?(Hash)) and (not message.is_a?(Array))
    messages = [message] if (not message.is_a?(Array))
    messages.each do |mess|
      @redis.sadd(OUTBOX,{
        "message"   => mess.to_json,
        "socket_id" => socket_id
      }.to_json)
    end
  end

  def log_message(message)
    @logger.syswrite "#{Time.now} :: #{message}\n"
  end
end
