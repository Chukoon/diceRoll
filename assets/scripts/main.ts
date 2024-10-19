import { _decorator, Component, Node } from 'cc';
import { gameLogic } from './gameLogic';

const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    @property(gameLogic)
    private gameLogic: gameLogic | null = null;

    start() {
        // 游戏初始化逻辑
        if (this.gameLogic) 
        {
            this.gameLogic.init();
        }
    }

    // 添加其他全局控制方法
}
