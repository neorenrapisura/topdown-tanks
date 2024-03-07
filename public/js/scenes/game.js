import Tank from "../gameobjects/tank.js"
import Bullet from "../gameobjects/bullet.js"
import Minimap from "../gameobjects/minimap.js"
import Explosion from "../gameobjects/explosion.js"

export default class GameScene extends Phaser.Scene {
	constructor() { super({ key: "GameScene" }) }

	init() {
		this.socket = io()

		this.cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			r: Phaser.Input.Keyboard.KeyCodes.R,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE
		})
		
		this.cameras.main.fadeIn(300)
		this.scene.launch("UiScene")
	}

	create() {
		this.bullets = this.physics.add.group({ runChildUpdate: true })
		this.otherPlayers = this.physics.add.group({ runChildUpdate: true })
		this.otherBullets = this.physics.add.group({ runChildUpdate: true })

		const map = this.make.tilemap({ key: "terrain" })
		const tileset = map.addTilesetImage("terrainTiles_default", "terrainTiles")
		const ground = map.createLayer("Ground", tileset)

		this.physics.world.setBounds(0, 0, 1600, 1600)
		this.cameras.main.setBounds(0, 0, 1600, 1600)

		this.cameras.main.setZoom(0.75)

		this.minimap = new Minimap({
			scene: this,
			x: window.innerWidth - 160,
			y: 10
		})
		this.minimap.ignore(ground)
		this.minimap.setName("minimap")
		this.cameras.main.ignore(this.minimap.overlay)
		
		// point barrel towards mouse
		this.input.on("pointermove", pointer => {
			if (this.player == undefined) { return }

			const rot = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY)

      		this.player.barrel.setRotation(rot)

			this.socket.emit("barrelRotation", rot)
		})

		// shooting
		this.input.on("pointerdown", _ => {
			if (this.player == undefined) { return }
			if (this.time.now > this.player.lastFired) {

				this.player.health -= 20

				const b = new Bullet({
					scene: this,
					x: this.player.x,
					y: this.player.y,
					rotation: this.player.barrel.rotation,
					shooterId: this.player.playerId
				})

				this.bullets.add(b)
				this.minimap.ignore(b)

				this.socket.emit("fireBullet", {
					x: this.player.x,
					y: this.player.y,
					rotation: this.player.barrel.rotation,
					shooterId: this.player.shooterId
				})

				this.player.lastFired = this.time.now + 750
			}
		})

		// collisions
		this.physics.add.overlap(this.bullets, this.otherPlayers, b => {
			b.destroy()
		}, null, this)

		/*
		==================
		socket.io events
		==================
		*/

		this.socket.on("getPlayers", players => {
			Object.keys(players).forEach( id => {

				if (players[id].playerId === this.socket.id) {

					this.player = new Tank({
						scene: this,
						x: players[id].x,
						y: players[id].y,
						rotation: players[id].rotation,
						health: players[id].health,
						playerId: players[id].playerId,
						isLocalPlayer: true
					})

					this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
					this.cameras.main.ignore(this.player.locator)
					this.minimap.ignore(this.player)

					this.physics.add.overlap(this.player, this.otherBullets, this.playerHit, null, this)

					this.player.lastFired = 0

				} else {

					this.addPlayer(players[id])

				}

			}, this)
		})

		this.socket.on("bodyMoved", data => {
			this.otherPlayers.getChildren().forEach( player => {
				if (player.playerId === data.playerId) {
					player.setPosition(data.x, data.y)
					player.setRotation(data.rotation)
				}
			})
		})

		this.socket.on("barrelRotated", data => {
			this.otherPlayers.getChildren().forEach( player => {
				if (player.playerId === data.playerId) {
					player.barrel.setRotation(data.rotation)
				}
			})
		})

		this.socket.on("bulletFired", bulletData => {
			const b = new Bullet({
				scene: this,
				x: bulletData.x,
				y: bulletData.y,
				rotation: bulletData.rotation,
				shooterId: bulletData.shooterId
			})
			this.otherBullets.add(b)
			this.minimap.ignore(b)
		})

		this.socket.on("playerHit", data => {
			this.otherPlayers.getChildren().forEach( player => {
				if (player.playerId === data.playerId) {
					player.health = data.health
				}
			})
		})

		this.socket.on("joining", player => {
			this.addPlayer(player)
		})

		this.socket.on("leaving", id => {
			this.otherPlayers.getChildren().forEach( player => {
				if (player.playerId === id) { player.remove() }
			})
		})
	}

	update(time, dt) {
		if (this.player == undefined) { return }

		// player movement
		if (this.cursors.up.isDown) {
			this.physics.velocityFromRotation(this.player.rotation, 70, this.player.body.velocity)

			if (this.cursors.left.isDown) {
				this.player.setAngularVelocity(-75)
			} else if (this.cursors.right.isDown) {
				this.player.setAngularVelocity(75)
			} else {
				this.player.setAngularVelocity(0)
			}

			this.socket.emit("bodyMovement", {
				x: this.player.x,
				y: this.player.y,
				rotation: this.player.rotation
			})

		} else {
			this.physics.velocityFromRotation(this.player.rotation, 0, this.player.body.velocity)
			this.player.setAngularVelocity(0)
		}

		this.player.update()
	}

	addPlayer(playerInfo) {
		const player = new Tank({
			scene: this,
			x: playerInfo.x,
			y: playerInfo.y,
			rotation: playerInfo.rotation,
			health: playerInfo.health,
			playerId: playerInfo.playerId,
			isLocalPlayer: false
		})
		
		this.otherPlayers.add(player)

		this.cameras.main.ignore(player.locator)
		this.minimap.ignore(player)
	}

	playerHit(_, bullet) {
		bullet.destroy()
		this.player.health -= 20
		
		this.socket.emit("hit", this.player.health)
	}
}