import Healthbar from "./healthbar.js"

export default class Tank extends Phaser.Physics.Arcade.Sprite {
	constructor({
		scene, 
		x,
		y,
		rotation,
		health,
		playerId,
		isLocalPlayer
	}) {
		super(scene, x, y, "tankBody")

		this.playerId = playerId
		this.isLocalPlayer = isLocalPlayer

		this.setRotation(rotation)
		this.setDepth(1)

		this.barrel = scene.add.image(0, 0, "tankBarrel")
		this.barrel.setDisplayOrigin(2, 6)
		this.barrel.setDepth(2)

		this.health = health
		/*
		if (isLocalPlayer == false || isLocalPlayer == undefined) {
			this.healthbar = new Healthbar({
				scene: scene,
				width: 42,
				height: 10,
				tank: this
			})
		}*/

		if (isLocalPlayer) {
			this.locator = scene.add.image(0, 0, "playerIcon")
			this.locator.setScale(7)
			this.locator.setDepth(3)
		} else {
			this.locator = scene.add.image(0, 0, "enemyIcon")
			this.locator.setScale(7)
			this.locator.setDepth(3)
		}

		this.scene.add.existing(this)
		this.scene.physics.add.existing(this, false)

		this.body.setMaxVelocity(70)
		this.setCollideWorldBounds(true)
	}

	update() {
		this.barrel.setPosition(this.x, this.y)

		this.locator.setPosition(this.x, this.y)
		this.locator.setRotation(this.rotation)

		if (this.healthbar !== undefined) { this.healthbar.update() }
	}

	remove() {
		if (this.healthbar !== undefined) {
			this.healthbar.destroy()
		}
		this.barrel.destroy()
		this.locator.destroy()
		this.destroy()
	}
}