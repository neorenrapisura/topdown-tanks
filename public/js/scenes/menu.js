export default class MenuScene extends Phaser.Scene {
	constructor() { super( {key: "MenuScene"} ) }

	create() {
		this.pressed = false

		//title
		this.titleText = this.add.text(this.scale.width / 2, 100, "pretend this is a better menu", {
			fontFamily: "PixelEmulator",
			fontSize : "40px",
			color: "#ffffff"
		})
		this.titleText.setOrigin(0.5, 0.5)

		//button
		this.playButton = this.add.rectangle(this.scale.width / 2, 300, 250, 60, "0xffffff")
		this.playButton.setInteractive()
		this.playButton.on("pointerover", () => { this.playButton.setFillStyle("0xbfbfbf") })
		this.playButton.on("pointerout", () => { this.playButton.setFillStyle("0xffffff") })
		this.playButton.on("pointerdown", () => { 
			if (this.pressed == false) {
				this.fadeOut()
				this.pressed = true
			}
		})

		//button text
		this.buttonText = this.add.text(this.playButton.x, this.playButton.y, "PLAY", {
			fontFamily: "PixelEmulator",
			fontSize : "20px",
			color: "#000000"
		})
		this.buttonText.setOrigin(0.5, 0.5)
	}

	fadeOut() {
		this.cameras.main.fadeOut(300)
		this.cameras.main.once('camerafadeoutcomplete', () => {
    		this.scene.start("GameScene")
			this.scene.launch("UiScene") 
    	})
	}
}