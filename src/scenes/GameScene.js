class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        
    }

    create() {
        this.text = this.add.text(180, 180, 'GameScene', {
            font: '48px Arial',
            fill: '#f8f8f2'
        })

        this.text.setInteractive();
        this.text.on('clicked', function() {
            this.scene.start('MainMenu')
        }, this);

        this.input.on('gameobjectup', function(pointer, gameObject) {
            gameObject.emit('clicked', gameObject);
        }, this);
    }

    update() {

    }
}

export default GameScene;
