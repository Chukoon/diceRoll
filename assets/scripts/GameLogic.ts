import { _decorator, Component, instantiate, Node, Prefab, Vec3, input, Input, KeyCode, Label, find, assetManager, resources } from 'cc';
import { AudioController } from './AudioController';
import { DiceController } from './DiceController';
import { dicePoints } from './UI/dicePoints';


const { ccclass, property, integer } = _decorator;

@ccclass('GameLogic')
export class GameLogic extends Component {


    @integer
    diceCount?: number = 5;

    @property(dicePoints)
    pointsLabel?: dicePoints = null;

    @property(Node)
    rollButton: Node = null;

    private dices: DiceController[] = [];
    private isRolling: boolean = false;
    private rollAudio: AudioController = null;

    private dicePrefabName: string = null;

    public init() {
        this.loadDicePrefab();
        this.loadRollAudio();
    }

    private loadRollAudio() {
        this.addComponent(AudioController);
        this.rollAudio = this.getComponent(AudioController);
    }

    private loadDicePrefab() {
        resources.load('prefabs/dices/dice-regular-black', Prefab, (err, prefab) => {
            if (err) {
                console.log('load dice prefab error');
                console.error(err);
                return;
            }
            this.initDices(prefab);
        });
    }

    private initDices(dicePrefab: Prefab) {
        for (let i = 0; i < this.diceCount; i++) {
            const diceNode = instantiate(dicePrefab);
            this.node.addChild(diceNode);

            // Generate random position within a 5x5x5 space
            const randomX = Math.random() * 5 - 2.5;
            const randomY = Math.random() * 5;
            const randomZ = Math.random() * 5 - 2.5;
            diceNode.setPosition(new Vec3(randomX, randomY, randomZ));

            // Generate random rotation
            const randomRotX = Math.random() * 360;
            const randomRotY = Math.random() * 360;
            const randomRotZ = Math.random() * 360;
            diceNode.setRotationFromEuler(randomRotX, randomRotY, randomRotZ);

            const dice = diceNode.getComponent(DiceController);
            if (dice) {
                this.dices.push(dice);
            }
        }
    }

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: any) {
        if (event.keyCode === KeyCode.SPACE) {
            this.rollAllDice();
        }
    }

    public rollAllDice() {
        if (this.isRolling) return;

        this.rollAudio.playOnShot();
        this.isRolling = true;
        this.rollButton.active = false;
        this.dices.forEach(dice => dice.roll());
        this.schedule(this.checkAllDiceStopped, 0.1);
    }

    private checkAllDiceStopped() {
        const allStopped = this.dices.every(dice => dice.checkIfStopped());
        if (allStopped) {
            this.isRolling = false;
            this.unschedule(this.checkAllDiceStopped);
            this.onAllDiceStopped();
        }
    }

    private onAllDiceStopped() {
        const results = this.dices.map(dice => dice.determineFaceUp()).sort();
        // 在这里你可以添加更多的逻辑，比如更新UI显示结果等
        this.pointsLabel.setText('点数为：' + results);
        this.rollButton.active = true;
    }
}
