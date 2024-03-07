export default class UiScene extends Phaser.Scene {
	constructor() { super({ key: "UiScene" }) }

	create() {
		this.healthbarBackground = this.add.graphics()
		this.healthbarBackground.fillStyle("0xff0000")
		this.healthbarBackground.fillRoundedRect(20, 20, 200, 20, 5)

		this.healthbar = this.add.graphics()
		this.healthbar.fillStyle("0x00ff00", 1)
		this.healthbar.fillRoundedRect(20, 20, 200, 20, 5)
	}

	update() {
		
	}
}