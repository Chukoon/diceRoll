import { _decorator, Component, Node, RigidBody, Vec3, randomRange, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('diceController')
export class diceController extends Component {

    private rdBody: RigidBody | null = null;
    private veloThres: number = 0.2;
    private aVeloThres: number = 0.2;
    private isRolling: boolean = false;

    @property
    private minForce: number = 3;

    @property
    private maxForce: number = 5;

    @property
    private minTorque: number = 2;

    @property
    private maxTorque: number = 4;

    private faceDirections: Vec3[] = [
        new Vec3(0, 1, 0),   // 1 (上面)
        new Vec3(0, 0, 1),   // 2 (z 正方向)
        new Vec3(1, 0, 0),   // 3 (x 正方向)
        new Vec3(-1, 0, 0),  // 4 (x 负方向)
        new Vec3(0, 0, -1),  // 5 (z 负方向)
        new Vec3(0, -1, 0)   // 6 (下面)
    ];

    public roll() {
        if (!this.rdBody || this.isRolling) return;

        this.isRolling = true;

        this.rdBody.setLinearVelocity(Vec3.ZERO);
        this.rdBody.setAngularVelocity(Vec3.ZERO);

        let forceRatio = 100;
        const upwardForce = new Vec3(0, randomRange(this.minForce * forceRatio, this.maxForce * forceRatio), 0);
        this.rdBody.applyForce(upwardForce);


        const horizontalForce = new Vec3(
            randomRange(-this.maxForce * forceRatio / 2, this.maxForce * forceRatio / 2),
            0,
            randomRange(-this.maxForce * forceRatio / 2, this.maxForce * forceRatio / 2)
        );
        this.rdBody.applyForce(horizontalForce);


        const torque = new Vec3(
            randomRange(-this.maxTorque * forceRatio, this.maxTorque * forceRatio),
            randomRange(-this.maxTorque * forceRatio, this.maxTorque * forceRatio),
            randomRange(-this.maxTorque * forceRatio, this.maxTorque * forceRatio)
        );
        this.rdBody.applyTorque(torque);
    }

    public checkIfStopped(): boolean {
        if (!this.rdBody) return true;

        const linearVelocity = new Vec3();
        const angularVelocity = new Vec3();
        this.rdBody.getLinearVelocity(linearVelocity);
        this.rdBody.getAngularVelocity(angularVelocity);

        if (linearVelocity.length() < this.veloThres &&
            angularVelocity.length() < this.aVeloThres) {
            this.isRolling = false;
            return true;
        }
        return false;
    }

    public determineFaceUp(): number {
        if (!this.node) return 0;

        const worldUp = new Vec3(0, 1, 0);
        const diceRotation = new Quat();
        this.node.getWorldRotation(diceRotation);

        let maxDot = -1;
        let faceUp = 0;

        this.faceDirections.forEach((faceDir, index) => {
            // 将面的方向从本地空间转换到世界空间
            const worldFaceDir = Vec3.transformQuat(new Vec3(), faceDir, diceRotation);
            
            const dot = Vec3.dot(worldFaceDir, worldUp);
            if (dot > maxDot) {
                maxDot = dot;
                faceUp = index + 1;
            }
        });

        return faceUp;
    }

    start() {
        this.rdBody = this.getComponent(RigidBody);
    }
}
