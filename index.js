const express = require('express')
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)

var players = {}

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

io.on("connection", socket => {
	console.log("a player connected")

	// store new player
	players[socket.id] = {
		x: Math.floor(Math.random() * 1600),
		y: Math.floor(Math.random() * 1600),
		rotation: 0,
		health: 100,
		playerId: socket.id
	}

	socket.emit("getPlayers", players)
	socket.broadcast.emit("joining", players[socket.id])

	socket.on("bodyMovement", newPos => {
		players[socket.id].x = newPos.x,
		players[socket.id].y = newPos.y,
		players[socket.id].rotation = newPos.rotation,

		socket.broadcast.emit("bodyMoved", {
			playerId: socket.id,
			x: players[socket.id].x,
			y: players[socket.id].y,
			rotation: players[socket.id].rotation
		})
	})

	// barrel not connected to player object
	socket.on("barrelRotation", newRotation => { 
		socket.broadcast.emit("barrelRotated", { playerId: socket.id, rotation: newRotation })
	})

	socket.on("fireBullet", bulletData => {
		socket.broadcast.emit("bulletFired", {
			x: bulletData.x,
			y: bulletData.y,
			rotation: bulletData.rotation,
			playerId: bulletData.playerId
		})
	})

	socket.on("hit", newHealth => {
		players[socket.id].health = newHealth
		socket.broadcast.emit("playerHit", { 
			playerId: socket.id,
			health: players[socket.id].health 
		})
	})

	socket.on("disconnect", _ => {
		console.log("a player disconnected")

		delete players[socket.id]
		io.emit("leaving", socket.id)
	})
})

server.listen(8081, _ => {
	console.log(`listening on ${server.address().port}`)
})