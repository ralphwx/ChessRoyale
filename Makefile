build:
	python3 build.py lobby.js
	python3 build.py game.js game
	python3 build.py login.js login

lobby:
	python3 build.py lobby.js

game:
	python3 build.py game.js game
.PHONY: build lobby
