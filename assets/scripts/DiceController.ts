import { _decorator, Component, Node, RigidBody, Vec3, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DiceController')
export class DiceController extends Component {

    private rdBody: RigidBody | null = null;
    private veloThres: number = 0.1;
    private aVeloThres: number = 0.1;
    private isRolling: boolean = false;

    @property
    private minForce: number = 3;

    @property
    private maxForce: number = 5;

    @property
    private minTorque: number = 2;

    @property
    private maxTorque: number = 4;

    public roll() {
        if (!this.rdBody || this.isRolling) return;
        
        this.isRolling = true;

        this.rdBody.setLinearVelocity(Vec3.ZERO);
        this.rdBody.setAngularVelocity(Vec3.ZERO);

        const upwardForce = new Vec3(0, randomRange(this.minForce, this.maxForce), 0);
        this.rdBody.applyForce(upwardForce);

        const horizontalForce = new Vec3(
            randomRange(-this.maxForce/2, this.maxForce/2),
            0,
            randomRange(-this.maxForce/2, this.maxForce/2)
        );
        this.rdBody.applyForce(horizontalForce);

        const torque = new Vec3(
            randomRange(-this.maxTorque, this.maxTorque),
            randomRange(-this.maxTorque, this.maxTorque),
            randomRange(-this.maxTorque, this.maxTorque)
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

        const upDirection = this.node.up;
        const faces = [new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1),
        new Vec3(-1, 0, 0), new Vec3(0, -1, 0), new Vec3(0, 0, -1)
        ];

        let maxDot = -1;
        let faceUp = 0;

        faces.forEach((face, index) => {
            const dot = Vec3.dot(face, upDirection);
            if(dot > maxDot)
            {
                maxDot = dot;
                faceUp = index + 1;
            }
        })

        return faceUp;
    }

    start() {
        this.rdBody = this.getComponent(RigidBody);
    }
}
