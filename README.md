# Duckerberg

Powerup, server returns name of powerup to the same group except
original sender

Every client has a list of scores


REQUEST: Game Joining
REQUEST: Receive powerup
REQUEST: A client sends a score
REQUEST: Still Alive

POST:    Return powerup
POST:    Issue user_id
POST:    Pass Timer
POST:    Pass Full Score Table
POST:    Game over

I return a score

{
  "type":"set_score|powerup|join_request|still_alive"
}


## Requests
### set_score

{
  "type"     : "set_score"
  "user_id"  : int
  "score"    : int
}

### powerup

{
  "type"         : "powerup"
  "user_id"      : int
  "powerup_name" : string
}

### join_request

{
  "type"      : "join_request"
  "user_name" : string
}

### still_alive

{
  "type"      : "still_alive"
}




## Posts

### return_powerup

{
  "type"         : "return_powerup"
  "powerup_name" : string
}

### issue_user_id

{
  "type" : "issue_user_id"
  "user_id" : int
}

### pass_timer

{
  "type" : "pass_timer"
  "time" : int(seconds)
}

### pass_full_score_table

{
  "type" : "pass_full_score_table"
  [
    "user_id" : int
    "score"   : int
  ]
}

### game_over

{
  "type" : "game_over"
}
