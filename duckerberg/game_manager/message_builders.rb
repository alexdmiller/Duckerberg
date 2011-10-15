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

    @highest_user_id += 1

    [{
      "type"    => "issue_user_id",
      "user_id" => user_id
    }, socket_id]
  end

  def powerup(message_hash)
    powerup_name = message_hash["powerup_name"]
    user_id      = message_hash["user_id"]
    user_name    = @users_by_id[user_id]["user_name"]

    @users_by_id.map{|x|
      if x["user_id"] == user_id
        nil
      else
        {
          "type" => "return_powerup",
          "powerup_name" => powerup_name,
          "user_name"    => user_name
        }
      end
    }.compact.to_json
  end


  def destroy_socket(message_hash)
    socket_id = message_hash["socket_id"]
    user_id   = @ids_by_socket[socket_id]

    @ids_by_socket.delete(socket_id)
    @users_by_id.delete(user_id)
  end

  # returns a pass_timer message
  def pass_timer
    {
      "type" => "pass_timer",
      "time" => GAME_LENGTH - (Time.now.to_i - @game_start_time)
    }.to_json
  end

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

  def game_over
    time = GAME_LENGTH - (Time.now.to_i - @game_start_time)
    (time < 0 ? { "type" => "game_over" } : nil)
  end

  
end
