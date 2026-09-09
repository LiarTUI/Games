export default class ball {
    positionX: number;
    positionY: number;
    accelerationX: number;
    accelerationY: number;
    gravity: number;
    radius: number;
    color: string;
    jumpPower: number;
    constructor(props: Record<string, any> = {}) {
        this.positionX = props.positionX ?? 100;
        this.positionY = props.positionY ?? 100;
        this.accelerationX = props.accelerationX ?? 5;
        this.accelerationY = props.accelerationY ?? 2;
        this.gravity = props.gravity ?? 0.25;
        this.radius = props.radius ?? 12;
        this.color = props.color ?? "blue";
        this.jumpPower = props.jumpPower ?? -8;
    }
    reset() {
        this.positionX = 100
        this.positionY = 100
        this.accelerationX = 5
        this.accelerationY = 2
    };
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    };
    jump(){
        this.accelerationY = this.jumpPower
    }
}