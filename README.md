# Duckerberg

Duckerberg is a subtly multiplayer web browser game built for the University of
Washington Facebook Hackathon October 2011

## Gameplay

Use the Arrow keys to move the Mark Duckerberg around. Try to collect
apples, but avoid the mean strangers.

Collecting powerups will affect you AND all other players.

Games last in 90 second rounds, and all players play under the same time
scopes.

## The Stack

* Javascript Canvas with Box 2d
* Websocket connections for multiplayer data
* Ruby EventMachine to accept Websocket connections
* Redis for message organizing for the Game Server

## Authors

Four Computer Science Majors at the University of Washington

* Alex Miller for the game mechanics and frontend
* Tyler Rigsby for the game mechanics and frontend
* Harnoor Singh for the frontend and the client interface for the
  server
* David Mah for the backend and linux sysadmining
