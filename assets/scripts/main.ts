import { _decorator, Component, Node } from 'cc';
import { GameLogic } from './GameLogic';
import { uiManager } from "./framework/uiManager";

const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    @property(GameLogic)
    private gameLogic: GameLogic | null = null;

    start() {
        // 游戏初始化逻辑
        GameLogic.init();
        this.showMainUI();
    }

    // 添加其他全局控制方法

    showMainUI()
    {
        uiManager.instance.showDialog('main/mainUI')
    }
}
