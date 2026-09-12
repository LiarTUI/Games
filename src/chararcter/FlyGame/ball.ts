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
        this.positionY = props.positionY ?? 300;
        this.accelerationX = props.accelerationX ?? 5;
        this.accelerationY = props.accelerationY ?? 5;
        this.gravity = props.gravity ?? 0.10;
        this.radius = props.radius ?? 12;
        this.color = props.color ?? "pink";
        this.jumpPower = props.jumpPower ?? -3.7;
    }
    reset() {
        this.positionX = 100
        this.positionY = 300
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