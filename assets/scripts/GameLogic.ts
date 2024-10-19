import { _decorator, Component, instantiate, Node, Prefab, Vec3, input, Input, KeyCode, Label, find } from 'cc';
import { diceController } from './diceController';
import { dicePoints } from './UI/dicePoints';

const { ccclass, property, integer } = _decorator;

@ccclass('gameLogic')
export class gameLogic extends Component {

    @property(Prefab)
    dicePrefab?: Prefab = null;

    @integer
    diceCount?: number = 5;

    @property(dicePoints)
    pointsLabel? : dicePoints = null;

    private dices: diceController[] = [];
    private isRolling: boolean = false;


    public init() {
        this.initDices();
    }

    private initDices() {
        if(!this.dicePrefab)
        {
            console.error("Dice prefab is not set!");
            return;
        }

        for(let i = 0; i < this.diceCount; i++)
        {
            const diceNode = instantiate(this.dicePrefab);
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
            
            const dice = diceNode.getComponent(diceController);
            if(dice)
            {
                this.dices.push(dice);
            }
        }
    }

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.dices = this.getComponentsInChildren(diceController);
        console.log(this.pointsLabel)
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

        this.isRolling = true;
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
        console.log('All dice have stopped rolling');
        const results = this.dices.map(dice => dice.determineFaceUp());
        console.log('Results:', results.sort());
        // 在这里你可以添加更多的逻辑，比如更新UI显示结果等
        this.pointsLabel.setText('点数为：' + results);
    }
}
