export default class PreloadScene extends Phaser.Scene {
	constructor() { super({ key: "Preload" }) }

	preload() {
		this.load.image("tankBody", "assets/tankBody.png")
		this.load.image("tankBarrel", "assets/tankBarrel.png")
		this.load.image("bullet", "assets/bullet.png")
		this.load.image("terrainTiles", "assets/map/terrainTiles.png")
   		this.load.tilemapTiledJSON("terrain", "assets/map/terrain.json")
		this.load.image("playerIcon", "assets/playerIcon.png")
		this.load.image("enemyIcon", "assets/enemyIcon.png")
		this.load.image("shotLarge", "assets/shotLarge.png")
		this.load.atlas('explosions', "assets/effects/explosions.png", "assets/effects/explosions.json")
	}

	create() { this.scene.start("GameScene") }
}