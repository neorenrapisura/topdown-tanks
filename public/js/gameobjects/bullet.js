import Explosion from "./explosion.js"

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
	constructor({
		scene,
		x,
		y,
		rotation,
		shooterId
	}) {
		const offset = new Phaser.Math.Vector2(42, 0)
		offset.rotate(rotation)

		super(scene, x + offset.x, y + offset.y, "bullet")

		this.lifetime = 1000
		this.shooterId = shooterId
		this.setRotation(rotation)

		this.scene.add.existing(this)
		this.scene.physics.add.existing(this, false)

		this.muzzleFlash = scene.add.image(x + offset.x, y + offset.y, "shotLarge")
		this.muzzleFlash.setRotation(rotation)
		this.muzzleFlash.setDepth(3)

		this.scene.time.addEvent({
			delay: 125,
			callback: _ => {
				this.muzzleFlash.destroy()
			},
			callbackScope: this,
			loop: false
		})
	}

	update(time, dt) {
		this.lifetime -= 1 * dt
		if (this.lifetime < 0) {
			this.explode()
			return
		}

		this.scene.physics.velocityFromRotation(this.rotation, 500, this.body.velocity)
	}

	explode() {
		new Explosion({
			scene: this.scene,
			x: this.x,
			y: this.y,
			key: "explosionSmoke"
		})

		this.destroy()
	}
}