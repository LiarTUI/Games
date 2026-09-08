import './index.less'
import Ball from '../../chararcter/FlyGame/ball'
import Wall from '../../chararcter/FlyGame/wall'
import { useEffect, useRef } from 'react'
import type { FlyGamesProps } from './type'

export default function FlyGame(props: FlyGamesProps) {
    const {
        CanvasHeight,
        CanvasWidth
    } = props
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const gameOverRef = useRef(false)
    const gameId = useRef<number>(0)
    const ballRef = useRef<Ball>(new Ball())
    const wallsRef = useRef<Wall[]>([])
    const isRunning = useRef(false)
    const sizeRef = useRef({
        w: 0,
        h: 0
    })

    const createWall = (canvasW: number, canvasH: number) => {
        const w = new Wall();
        w.initSize(canvasW, canvasH);
        w.resetWall(canvasW);
        return w;
    };

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        if (!CanvasHeight || !CanvasWidth) return
        sizeRef.current.w = CanvasWidth
        sizeRef.current.h = CanvasHeight
        canvas.height = CanvasHeight ?? 500
        canvas.width = CanvasWidth ?? 1000
        canvas.style.width = CanvasWidth ? `${CanvasWidth}px` : '1000px'
        canvas.style.height = CanvasHeight ? `${CanvasHeight}px` : '500px'

        ballRef.current.reset()
        wallsRef.current = []
        for (let i = 0; i < CanvasWidth / 120; i++) {
            wallsRef.current.push(createWall(CanvasWidth, CanvasHeight))
        }
        for (let i = 1; i < wallsRef.current.length; i++) {
            wallsRef.current[i].positionX = wallsRef.current[i - 1].positionX + 220;
        }
        gameOverRef.current = false
        isRunning.current = true
        gameId.current = requestAnimationFrame(() => {
            requestAnimationFrame(draw)
        })

        return () => {
            isRunning.current = false
            cancelAnimationFrame(gameId.current)
        }
    }, [CanvasWidth, CanvasHeight])

    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault()
                if (!gameOverRef.current) {
                    ballRef.current.jump()
                }
            }
        }
        window.addEventListener('keydown', keyDown)
        return () => window.removeEventListener('keydown', keyDown)
    }, [])

    function draw() {
        if (!isRunning.current) return
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const { w } = sizeRef.current
        if (!ctx || !canvas || !w) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const ball = ballRef.current
        ball.draw(ctx)
        ball.accelerationY += ball.gravity
        ball.positionY += ball.accelerationY
        for (const wall of wallsRef.current) {
            wall.positionX -= wall.speed;
            wall.draw(ctx);
        }

        for (const wall of wallsRef.current) {
            if (wall.positionX + wall.WallWidth < 0) {
                wall.resetWall(w);
                wall.positionX = w + 180;
            }
        }
        for (const wall of wallsRef.current) {
            const xOverlap = ball.positionX + ball.radius > wall.positionX
                && ball.positionX - ball.radius < wall.positionX + wall.WallWidth
            if (xOverlap) {
                if (ball.positionY - ball.radius < wall.upWallHeight
                    || ball.positionY + ball.radius > wall.upWallHeight + wall.space) {
                    gameOverRef.current = true
                    break
                }
            }
        }
        // 地面碰撞
        if (ball.positionY + ball.radius >= canvas.height) {
            ball.positionY = canvas.height - ball.radius
            ball.accelerationY = 0
            gameOverRef.current = true
        }
        // 顶部边界
        if (ball.positionY - ball.radius <= 0) {
            ball.positionY = ball.radius
            ball.accelerationY = 0
            gameOverRef.current = true
        }
        if (gameOverRef.current) {
            ctx.font = "36px sans-serif";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("游戏结束", canvas.width / 2, canvas.height / 2);
            return;
        }
        gameId.current = requestAnimationFrame(draw)

    }

    const handleReset = () => {
        const { w } = sizeRef.current
        if (!w) return
        isRunning.current = false;
        cancelAnimationFrame(gameId.current);
        ballRef.current.reset()
        wallsRef.current.forEach(wall => wall.resetWall(w))
        for (let i = 1; i < wallsRef.current.length; i++) {
            wallsRef.current[i].positionX = wallsRef.current[i - 1].positionX + 220;
        }
        gameOverRef.current = false

        isRunning.current = true;
        gameId.current = requestAnimationFrame(() => {
            requestAnimationFrame(draw);
        });
    }

    return (
        <div>
            <canvas ref={canvasRef}></canvas>
            <button onClick={handleReset}>重新开始</button>
        </div>
    );
}
