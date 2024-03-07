export default class Minimap extends Phaser.Cameras.Scene2D.Camera {
	constructor({
		scene,
		x,
		y,
		width = 160,
		height = 160
	}) {
		super(x, y, width, height)

		this.setScene(scene)
		this.setScroll(800, 800)
		this.setZoom(0.1)

		// placeholder **hopefully**
		this.overlay = scene.add.rectangle(800, 800, 1600, 1600, "0x000000", 0.25)

		this.scene.cameras.addExisting(this)
	}
}