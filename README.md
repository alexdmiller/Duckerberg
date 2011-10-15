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
* Websocket connects for multiplayer data
* Ruby EventMachine running WebSockets for two way message passing
* Redis for server data organization

## Authors

Four Computer Science Majors at the University of Washington
* Alex Miller
* Tyler Rigsby
* David Mah
* Harnoor Singh
