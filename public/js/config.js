import PreloadScene from "./scenes/preload.js"
import MenuScene from "./scenes/menu.js"
import GameScene from "./scenes/game.js"
import UiScene from "./scenes/ui.js"

const config = {
	type: Phaser.AUTO,

	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width:  1152,
		height: 648,
	},

	physics: {
		default: "arcade",
		arcade: { gravity: { y: 0 }, debug: false }
	},

	scene: [ PreloadScene, MenuScene, GameScene, UiScene ]
}

const game = new Phaser.Game(config)