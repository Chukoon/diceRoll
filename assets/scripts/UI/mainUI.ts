import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
import { eventTarget, GameLogic } from '../GameLogic';
import { dicePoints } from './dicePoints';

@ccclass('mainUI')
export class mainUI extends Component {

    @property(dicePoints)
    scoreLabel: dicePoints = null!;

    @property(Node)
    rollButton: Node = null!;

    @property(Node)
    skinSelectButton: Node = null!;

    onLoad() {
        // 添加事件监听
        eventTarget.on('diceRollComplete', this.onDiceRollComplete, this);
    }

    onDestroy() {
        // 移除事件监听
        eventTarget.off('diceRollComplete', this.onDiceRollComplete, this);
    }

    onRollButton(){
        this.rollButton.active = false;
        GameLogic.rollAllDice();
    }

    onDiceRollComplete(results: number[]) {
        console.log('Dice roll results:', results);
        // 在这里处理骰子结果
        // 例如，更新 UI 显示
        this.updateScoreDisplay(results);
        this.rollButton.active = true;
    }

    private updateScoreDisplay(results: number[]) {
        // 根据结果更新分数显示
        // 这里假设 scoreLabel 是一个 dicePoints 组件，有一个 updatePoints 方法
        this.scoreLabel.setText('结果为' + results);
    }
}


