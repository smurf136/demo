let bg;
let sign01;
let sign02;
let sign03;
let sign04;
let Mtext;
let Stext01;
let Stext02;
let Stext03;
let Stext04;
let signP;
let con01;
let con02;
let con03;
let con04;
let grass;
let mountain;
let tree;
let ground;

class MainMenu extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'MainMenu'
        });
    }

    preload() {
        this.load.image('bg', './src/assets/BGMenu1.png')
        this.load.image('sign1', './src/assets/Sign1.png')
        this.load.image('sign2', './src/assets/Sign2.png')
        this.load.image('sign3', './src/assets/Sign3.png')
        this.load.image('sign4', './src/assets/Sign4.png')
        this.load.image('grass', './src/assets/Grass.png')
        this.load.image('ground', './src/assets/Ground.png')
        this.load.image('mountain', './src/assets/Mountain.png')
        this.load.image('tree', './src/assets/Tree.png')
    }

    create() {
        bg = this.add.image(0, 0, 'bg').setOrigin(0)
        grass = this.add.image(-30, 65, 'grass').setScale(0.45).setOrigin(0)
        ground = this.add.image(100, 0, 'ground')
        mountain = this.add.image(200, 1000, 'mountain')
        tree = this.add.image(0, 0, 'tree').setScale(0.5).setOrigin(0, 0)

        sign01 = this.add.image(0, 0, 'sign3').setScale(0.4)
        sign02 = this.add.image(0, 0, 'sign1').setScale(0.25)
        sign03 = this.add.image(0, 0, 'sign2').setScale(0.25)
        sign04 = this.add.image(0, 0, 'sign4').setScale(0.25)

        Mtext = this.add.text(0, 0, 'Name', {
            fontFamily: 'font1',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setFontSize(100)
        Stext01 = this.add.text(0, 0, 'Play', {
            fontFamily: 'font1',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setFontSize(60)
        Stext02 = this.add.text(0, 0, 'Setting', {
            fontFamily: 'font1',
            fill: '#ffffff',
            align: 'center',
        }).setOrigin(0.5).setFontSize(60)
        Stext03 = this.add.text(0, 0, 'Quit', {
            fontFamily: 'font1',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setFontSize(60)

        con01 = this.add.container(300, -100, [sign01, Mtext]).setScale(1)
        con02 = this.add.container(300, -100, [sign02, Stext01]).setScale(1)
        con03 = this.add.container(300, -100, [sign03, Stext02]).setScale(1)
        con04 = this.add.container(300, -100, [sign04, Stext03]).setScale(1)
        console.log('con01.x: ' + con01.x + ', con01.y: ' + con01.y)
        //Change text to sign0x next commit 
        Stext01.setInteractive();
        Stext01.on('clicked', function () {
            this.scene.start('GameScene')
        }, this)


        this.input.on('gameobjectup', function (pointer, gameObject) {
            gameObject.emit('clicked', gameObject);
        }, this);

        var _this = this;

        _this.tweens.add({
            targets: con01,
            delay: 1500,
            props: {
                y: {
                    value: 200,
                    duration: 1500
                }
            }
        });
        _this.tweens.add({
            targets: con02,
            delay: 1500,
            props: {
                y: {
                    value: 400,
                    duration: 1500
                }
            }
        });
        _this.tweens.add({
            targets: con03,
            delay: 1500,
            props: {
                y: {
                    value: 550,
                    duration: 1500
                }
            }
        });
        _this.tweens.add({
            targets: con04,
            delay: 1500,
            props: {
                y: {
                    value: 700,
                    duration: 1500
                }
            }
        });
        _this.tweens.add({
            targets: grass,
            props: {
                y: {
                    value: -65,
                    duration: 1500
                }
            }
        });
        _this.tweens.add({
            targets: ground,
            props: {
                y: {
                    value: 100,
                    duration: 1500
                }
            }
        });
        _this.tweens.add({
            targets: mountain,
            props: {
                y: {
                    value: -10,
                    duration: 1500
                }
            }
        });
        _this.tweens.add({
            targets: tree,
            props: {
                y: {
                    value: -100,
                    duration: 1500
                }
            }
        });

        con01.setDepth(1)
        grass.setDepth(1)
        tree.setDepth(0)


    }

    update() {

    }

}
export default MainMenu;
