import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('dicePoints')
export class dicePoints extends Component {

    private label: Label = null;

    protected start(): void {
        this.label = this.getComponent(Label);
    }

    public setText(text: string) {
        console.log(this.label.string)
        this.label.string = text;
    }

}


