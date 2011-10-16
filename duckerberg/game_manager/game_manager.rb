# GameManager
#
# Manages games of Duckerberg by organizing data that is shared between players, like the countdown clock and the score board
# Also processes messages passed from the game clients and creates messages to send to clients

require 'json'
require 'redis'
load    'message_builders.rb'

GAME_DAEMON_LOG = File.join("/home/ubuntu", "duckerberglog", "game_daemon_log.txt")
USER_INFO = "id_pointer::"
OUTBOX = "outbox"
GAME_LENGTH = 35

class GameManager
  include MessageBuilders

  # Sets up structures to organize users
  def initialize
    @logger          = File.new(GAME_DAEMON_LOG, 'a')
    @redis           = Redis.new
    @redis.flushdb
    log_message("Redis Flushed")

    @highest_user_id = 0
    # user_name, user_id, socket_id, score
    @users_by_id     = {}
    @ids_by_socket   = {}
    @sockets_by_id   = {}
    setup_game
  end

  # Starts a new game by resetting the game clock and setting scores to 0
  def setup_game
    log_message("Game Restarting...")
    @game_start_time = Time.now.to_i
    @users_by_id.values.each do |user|
      user["score"] = 0
    end
  end

  # Sends out messages to users that recur over common intervals
  # For instance Score and Game clock
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

  # Runs game changes for when the game is over
  def endgame_measures(game_over_message, score_table)
      @users_by_id.values.each do |user|
        post(game_over_message, user["socket_id"])
        post(score_table, user["socket_id"])
      end
      setup_game
  end

  # Takes a client message and processes it, possibly sending a message back
  def handle_message(message_hash)
    socket_id = message_hash["socket_id"]
    message   = message_hash["message"]
    type      = message["type"]

    post(send(type, message_hash))
  end

  # Misc functionality
  # Sends the Message to socket_id through redis to the websocket server
  # All individual messages are of the form {"type" : string, "message" : JSON}, 
  # So an Array is guaranteed to be multiple messages while a hash is guaranteed to be one message
  def post(message, socket_id = nil)
    log_message("trying to post #{message.inspect}")
    if socket_id
      messages = [{
        "message"   => message,
        "socket_id" => socket_id
      }]

    else
      return if (not message.is_a?(Hash)) and (not message.is_a?(Array))
      messages = message
      messages = [message] if (not message.is_a?(Array))

    end
    messages.each do |mess|
      @redis.rpush(OUTBOX, mess.to_json)
    end
  end

  def log_message(message)
    @logger.syswrite "#{Time.now} :: #{message}\n"
  end
end
