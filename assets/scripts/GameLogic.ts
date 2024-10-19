import { _decorator, Component, instantiate, Node, Prefab, Vec3, input, Input, KeyCode } from 'cc';
import { DiceController } from './DiceController';
import { UIController } from './UIController';

const { ccclass, property, integer } = _decorator;

@ccclass('main')
export class main extends Component {

    @property(Prefab)
    dicePrefab?: Prefab = null;

    @integer
    diceCount?: number = 5;

    private dices: DiceController[] = [];
    private isRolling: boolean = false;

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
            diceNode.setPosition(new Vec3(i*10, 0, 0));
            
            const diceController = diceNode.getComponent(DiceController);
            if(diceController)
            {
                this.dices.push(diceController);
            }
        }
    }

    onLoad() {
        // this.initDices();
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.dices = this.getComponentsInChildren(DiceController);
        console.log(this.dices);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: any) {
        if (event.keyCode === KeyCode.SPACE) {
            this.rollAllDice();
        }
    }

    private rollAllDice() {
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
        console.log('Results:', results);
        // 在这里你可以添加更多的逻辑，比如更新UI显示结果等
    }
}
