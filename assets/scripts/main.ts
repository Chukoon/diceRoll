import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
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

    private initDices() {
        if(!this.dicePrefab)
        {
            console.error("Dice prefab is not set!");
            return;
        }

        for(let i = 0; i < this.diceCount; i++)
        {
            const diceNode = instantiate(this.dicePrefab);
            
            diceNode.setPosition(new Vec3(i*10, 0, 0));
            
            const diceController = diceNode.getComponent(DiceController);
            if(diceController)
            {
                this.dices.push(diceController);
            }
        }
    }

    

    onLoad() {
        this.initDices();
    }

   
}


