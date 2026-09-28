class ChessBoard {
    #size;
    constructor(props?: any) {
        this.#size = 19
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(0, 0)
        ctx.fillStyle = '#F1CE7E'
        ctx.fillRect(0, 0, this.#size * 40, this.#size * 40);
        ctx.strokeStyle = "#8D7433"
        for (let i = 1; i <= this.#size - 1; i++) {
            ctx.moveTo(i * 40, 0)
            ctx.lineTo(i * 40, this.#size * 40)
        }
        for (let i = 1; i <= this.#size - 1; i++) {
            ctx.moveTo(0, i * 40)
            ctx.lineTo(this.#size * 40, i * 40)
        }
        
        ctx.stroke()
        ctx.beginPath()
        ctx.lineWidth=3
        ctx.strokeStyle = "#41341d"
        ctx.strokeRect(0,0,this.#size * 40, this.#size * 40)
    };
}

export default ChessBoard