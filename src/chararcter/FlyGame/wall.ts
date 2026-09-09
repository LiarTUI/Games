export default class wall {
    positionX!: number;
    positionY!: number;
    WallWidth: number;
    speed: number;
    space: number;
    upWallHeight: number;
    downWallHeight: number;
    constructor(props: Record<string, any> = {}) {
        this.WallWidth = props.WallWidth ?? 10;
        this.speed = props.speed ?? 3;
        this.space = props.space ?? 220;
        this.upWallHeight = props.upWallHeight ?? 0;
        this.downWallHeight = props.downWallHeight ?? 0;
    }
    initSize(CanvasW: number, CanvasH: number) {
        this.positionX = CanvasW
        this.positionY = CanvasH
    }
    resetWall(CanvasW: number) {
        this.positionX = CanvasW
        this.upWallHeight = Math.floor(Math.random() * (500 - this.space))
        this.downWallHeight = 500 - this.space - this.upWallHeight
    };
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#666666"
        ctx.fillRect(this.positionX, 0, this.WallWidth, this.upWallHeight)
        ctx.fillRect(this.positionX, this.upWallHeight + this.space, this.WallWidth, this.downWallHeight)
    }
}