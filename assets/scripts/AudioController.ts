import { _decorator, Component, Node, AudioSource, resources, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {


    @property(AudioSource)
    private audioSource: AudioSource = null!;

    onLoad() {
        this.node.addComponent(AudioSource);
        this.audioSource = this.node.getComponent(AudioSource);

        resources.load('musics/diceRollMusic-1', AudioClip, (err, clip) => {
            if (err) {
                console.error(err);
                return;
            }
            this.audioSource.clip = clip;
        });


    }

    public playOnShot() {
        console.log("play audio");
        this.audioSource.playOneShot(this.audioSource.clip, 1);
    }

    public stop() {
        this.audioSource.stop();
    }

    public pause() {
        this.audioSource.pause();
    }

    public setVolume(volume: number) {
        this.audioSource.volume = volume;
    }
}


