export default class Explosion extends Phaser.Physics.Arcade.Sprite {
	constructor({
		scene,
		x,
		y,
		key,
		texture = "explosions"
	}) {
		super(scene, x, y, texture)

		const animFrames = scene.anims.generateFrameNames(texture, {
            start: 1,
            end: 5,
            zeroPad: 0,
            prefix:	key,
            suffix: ".png"
        })

		scene.anims.create({
            key: key,
            frames: animFrames,
            frameRate: 10,
            repeat: 0
        })

		scene.add.existing(this)
		scene.minimap.ignore(this)
		this.play(key)

		this.on("animationcomplete", _ => {
			this.destroy()
		})
	}
}