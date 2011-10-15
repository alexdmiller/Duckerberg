# MessageBuilders
#
# Holds ways to respond to client messages as well as prepare signals to send to clients
# Each should return a Hash if sending one signal to send
# An Array if sending many messages
# Or nil if not sending a message

module MessageBuilders

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
    @sockets_by_id[user_id]   = socket_id

    @highest_user_id += 1

    { "message" => {
        "type"    => "issue_user_id",
        "user_id" => user_id
      },
      "socket_id" => socket_id
    }
  end

  # returns a return_powerup message to hella people
  def powerup(message_hash)
    powerup_name = message_hash["powerup_name"]
    user_id      = message_hash["user_id"]
    user_name    = @users_by_id[user_id]["user_name"]

    @users_by_id.map{|x|
      if x["user_id"] == user_id
        nil
      else
        { "message" => {
            "type"         => "return_powerup",
            "powerup_name" => powerup_name,
            "user_name"    => user_name
          },
          "socket_id" => @sockets_by_id[user_id]
        }
      end
    }.compact
  end

  def destroy_socket(message_hash)
    log_message("Trying to destroy socket for #{message_hash.inspect}")
    socket_id = message_hash["socket_id"]
    user_id   = @ids_by_socket[socket_id]

    @sockets_by_id.delete(user_id)
    @ids_by_socket.delete(socket_id)
    @users_by_id.delete(user_id)
    nil
  end

  def set_score(message_hash)
    user_id        = message_hash["user_id"]
    @user          = @users_by_id[user_id]
    @user["score"] = message_hash["score"]
    nil
  end

  # returns a pass_timer message
  def pass_timer
    {
      "type" => "pass_timer",
      "time" => GAME_LENGTH - (Time.now.to_i - @game_start_time)
    }
  end

  # returns a pass_full_score_table message
  def pass_full_score_table
    {
      "type" => "pass_full_score_table",
      "table" => @users_by_id.values.map{|user|
        {
          "user_name" => user["user_name"],
          "score"     => user["score"]
        }
      }
    }
  end

  # returns a game_over message if the game is over
  # otherwise returns nil
  def game_over
    time = GAME_LENGTH - (Time.now.to_i - @game_start_time)
    (time < 0 ? { "type" => "game_over" } : nil)
  end

end
