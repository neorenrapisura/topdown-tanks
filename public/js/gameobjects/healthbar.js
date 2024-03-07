export default class Healthbar extends Phaser.GameObjects.Container {
	constructor({
		scene,
		width,
		height,
		tank
	}) {
		super(scene, 0, 0)

		this.tank = tank

		this.background = scene.add.graphics()
		this.background.fillStyle("0xff0000", 1)
		this.background.fillRect(0, 0, 42, 10)

		this.main = scene.add.graphics()
		this.main.fillStyle("0x00ff00", 1)
		this.main.fillRect(0, 0, 42, 10)

		this.add([ this.background, this.main ])
		this.scene.add.existing(this)
	}

	update() {
		this.main.scaleX = this.tank.health / 100
		this.setPosition(this.tank.x - 20, this.tank.y + 30)
	}
}