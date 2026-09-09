import './index.less'
import Ball from '../../../chararcter/FlyGame/ball'
import Wall from '../../../chararcter/FlyGame/wall'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'antd'

type GameStateRoute = {
    CanvasHeight: number
    CanvasWidth: number
}
const gap = 300
export default function FlyGame() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state as GameStateRoute | null
    const { CanvasHeight = 500, CanvasWidth = 1000 } = state ?? {}

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [point, setPoint] = useState<number>(0)

    const gameOverRef = useRef(false)
    const gameId = useRef<number>(0)
    const ballRef = useRef<Ball>(new Ball())
    const wallsRef = useRef<Wall[]>([])
    const isRunning = useRef(false)
    const sizeRef = useRef({ w: 0, h: 0 })
    const queue = useRef<number[]>([])
    const createWall = (canvasW: number, canvasH: number) => {
        const w = new Wall()
        w.initSize(canvasW, canvasH)
        w.resetWall(canvasW)
        return w
    }

    // 初始化画布资源
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        sizeRef.current.w = CanvasWidth
        sizeRef.current.h = CanvasHeight
        canvas.height = CanvasHeight
        canvas.width = CanvasWidth
        canvas.style.width = `${CanvasWidth}px`
        canvas.style.height = `${CanvasHeight}px`

        ballRef.current.reset()
        wallsRef.current = []
        const wallCount = Math.floor(CanvasWidth / gap)
        for (let i = 0; i < wallCount; i++) {
            wallsRef.current.push(createWall(CanvasWidth, CanvasHeight))
        }
        for (let i = 1; i < wallsRef.current.length; i++) {
            wallsRef.current[i].positionX = wallsRef.current[i - 1].positionX + gap
        }
        queue.current = wallsRef.current.map((_, idx) => idx)

        gameOverRef.current = false
        isRunning.current = false // 页面初始化：游戏静止，等待用户触发
        setGameOver(false)
        setPoint(0)

        // 只做【启动游戏】：游戏静止状态，空格启动raf循环
        const handleKeyStart = (e: KeyboardEvent) => {
            if (e.code !== 'Space') return
            const tag = (e.target as HTMLElement).tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA') return
            e.preventDefault()

            if (!isRunning.current && !gameOverRef.current) {
                isRunning.current = true
                gameId.current = requestAnimationFrame(draw)
            }
        }

        window.addEventListener('keydown', handleKeyStart)
        return () => {
            isRunning.current = false
            cancelAnimationFrame(gameId.current)
            window.removeEventListener('keydown', handleKeyStart)
        }
    }, [CanvasWidth, CanvasHeight])

    // 画布点击：启动游戏 / 跳跃
    const handleCanvasClick = () => {
        if (gameOverRef.current) return
        if (!isRunning.current) {
            // 还没开始，点击画布启动游戏循环
            isRunning.current = true
            gameId.current = requestAnimationFrame(draw)
        } else {
            // 正在游戏，点击跳跃
            ballRef.current.jump()
        }
    }

    // 游戏运行中：空格实现跳跃
    useEffect(() => {
        const keyJump = (e: KeyboardEvent) => {
            if (e.code !== 'Space') return
            const tag = (e.target as HTMLElement).tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA') return
            e.preventDefault()
            if (isRunning.current && !gameOverRef.current) {
                ballRef.current.jump()
            }
        }
        window.addEventListener('keydown', keyJump)
        return () => window.removeEventListener('keydown', keyJump)
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
            wall.positionX -= wall.speed
            wall.draw(ctx)
        }

        // 管道回收复用
        for (let i = 0; i < wallsRef.current.length; i++) {
            const wall = wallsRef.current[i]
            if (wall.positionX + wall.WallWidth < 0) {
                const qIdx = queue.current.indexOf(i)
                if (qIdx !== -1) queue.current.splice(qIdx, 1)

                wall.resetWall(w)
                if (queue.current.length > 0) {
                    const lastIdx = queue.current[queue.current.length - 1]
                    wall.positionX = wallsRef.current[lastIdx].positionX + gap
                } else {
                    wall.positionX = w + gap
                }
                queue.current.push(i)
            }
        }

        // 管道碰撞检测
        for (const wall of wallsRef.current) {
            const xOverlap =
                ball.positionX + ball.radius > wall.positionX &&
                ball.positionX - ball.radius < wall.positionX + wall.WallWidth
            if (xOverlap) {
                if (
                    ball.positionY - ball.radius < wall.upWallHeight ||
                    ball.positionY + ball.radius > wall.upWallHeight + wall.space
                ) {
                    gameOverRef.current = true
                    break
                }
            }
        }

        // 计分
        for (const wall of wallsRef.current) {
            const passWall = ball.positionX - ball.radius > wall.positionX + wall.WallWidth
            if (passWall && !wall.scored) {
                wall.scored = true
                setPoint((prev) => prev + 1)
            }
        }

        // 地面碰撞
        if (ball.positionY + ball.radius >= canvas.height) {
            ball.positionY = canvas.height - ball.radius
            ball.accelerationY = 0
            gameOverRef.current = true
        }
        // 顶部边界碰撞
        if (ball.positionY - ball.radius <= 0) {
            ball.positionY = ball.radius
            ball.accelerationY = 0
            gameOverRef.current = true
        }

        if (gameOverRef.current) {
            ctx.font = '36px sans-serif'
            ctx.fillStyle = 'red'
            ctx.textAlign = 'center'
            ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2 - 50)
            setGameOver(true)
            return
        }

        gameId.current = requestAnimationFrame(draw)
    }

    const handleReset = () => {
        const { w } = sizeRef.current
        if (!w) return

        isRunning.current = false
        cancelAnimationFrame(gameId.current)

        ballRef.current.reset()
        wallsRef.current.forEach((wall) => wall.resetWall(w))
        for (let i = 1; i < wallsRef.current.length; i++) {
            wallsRef.current[i].positionX = wallsRef.current[i - 1].positionX + gap
        }
        queue.current = wallsRef.current.map((_, idx) => idx)

        gameOverRef.current = false
        setGameOver(false)
        setPoint(0)

        isRunning.current = true
        gameId.current = requestAnimationFrame(draw)
    }

    return (
        <div style={{ height: '100%' }}>
            <Button style={{ position: 'absolute', left: '50px', top: '50px' }} onClick={() => navigate('/')}>
                返回主页
            </Button>
            <div className="container">
                <h3>积分：{point}</h3>
                <div className="canvasDiv" onClick={handleCanvasClick}>
                    <canvas ref={canvasRef}></canvas>
                    <button onClick={handleReset} style={{ display: gameOver ? 'block' : 'none' }}>
                        重新开始
                    </button>
                </div>
            </div>
        </div>
    )
}
