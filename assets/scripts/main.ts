import { _decorator, Component, Node } from 'cc';
import { GameLogic } from './GameLogic';

const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    @property(GameLogic)
    private gameLogic: GameLogic | null = null;

    start() {
        // 游戏初始化逻辑
        if (this.gameLogic) 
        {
            this.gameLogic.init();
        }
    }

    // 添加其他全局控制方法
}
