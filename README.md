# jepurdee-server

[![Greenkeeper badge](https://badges.greenkeeper.io/insanity54/jepurdee-server.svg)](https://greenkeeper.io/)


## How this works

### Jumbotron client app

The jumbotron is the large display on the jepurdee stage. Ideally, this is running on a laptop connected to a big screen TV. Jumbotron client displays a unique QR code to the players in the room. The unique QR code should not exist in more than one room.

### Player signalling app

The player signalling app runs on each player's phone. It allows the player to buzz in when they know the question. The player signalling app establishes a namespaced Socket.io connection to jepurdee-server.

### Game show host app

The game show host app runs on the game host's phone. It allows the game host to control the jumbotron client app. The game show host app establishes a namespaced Socket.io connection to jepurdee-server.

### jepurdee-server

* jepurdee-server serves the jumbotron client app
* jepurdee-server serves the player signalling app
* jepurdee-server provides a Socket.io backend for real-time communication between apps.


## Vue-Socket.io notes

### emitter.js

* It's a class
* It has actionPrefix and mutationPrefix properties
* It has a list of listeners
* listeners can be added and removed via emitter#addListener and emitter#removeListener
* events are added to listeners
* listeners have callbacks
* emitter#dispatchStore dispatches vuex actions and commits vuex mutations

### listener.js

* Is a class
* Has a list of static socket.io reserved event names. "connect", "error", etc.
* Constructer has this.io, this.register, and this.emitter properties.
* listener#emitter is an instance of emitter.js
* listener#register begins listening to all socket.io events.
  * when a socket.io event occurs, the event is emitted via listener#emitter


### mixin.js

* Is a vuejs mixin; functions that get merged with a vue instance
* `beforeCreate()` sets up subscribe() and unsubscribe() functions
* `mounted()` adds listeners based on component's $options.sockets
* `beforeDestroy()` removes all listeners
