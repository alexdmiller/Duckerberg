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
    log_message("Sending out game signals")
    game_time         = pass_timer
    score_table       = pass_full_score_table
    game_over_message = game_over

    if game_over_message.nil?
      @users_by_id.values.each do |user|
        log_message("Game Signals for #{user.inspect}")
        post(game_time, user["socket_id"])
        post(score_table, user["socket_id"])
      end
    else
      endgame_measures(game_over_message)
    end
  end

  def endgame_measures(game_over_message)
      @users_by_id.values.each do |user|
        post(game_over_message, user["socket_id"])
        post(score_table, user["socket_id"])
      end
      setup_game
  end

  def handle_message(message_hash)
    message = message_hash["message"]
    type    = message["type"]

    send(type, message_hash)
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
