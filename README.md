# Duckerberg

Duckerberg is a hella awesome game

## Messages

`REQUEST: Game Joining`

`REQUEST: Receive powerup`

`REQUEST: A client sends a score`

`REQUEST: Still Alive`

`POST:    Return powerup`

`POST:    Issue user_id`

`POST:    Pass Timer`

`POST:    Pass Full Score Table`

`POST:    Game over`

I return a score

{
  "type":"set_score|powerup|join_request|still_alive"
}


## Requests
### set_score

{
  "type"     : "set_score",
  "user_id"  : 1,
  "score"    : 1
}

### powerup

{
  "type"         : "powerup",
  "user_id"      : 1,
  "powerup_name" : 1
}

### join_request

{
  "type"      : "join_request",
  "user_name" : "derp"
}

### still_alive

{
  "type"      : "still_alive"
}




## Posts

### return_powerup

{
  "type"         : "return_powerup",
  "powerup_name" : "derp",
  "user_name"    : "garpley"
}

### issue_user_id

{
  "type" : "issue_user_id",
  "user_id" : 1
}

### pass_timer

{
  "type" : "pass_timer",
  "time" : 1
}

### pass_full_score_table

{
  "type" : "pass_full_score_table",
  "table": [
    "user_name" : "garpley",
    "score"     : 1
  ]
}

### game_over

{
  "type" : "game_over"
}
