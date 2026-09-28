import './index.less'
import ChessBoard from '../../../chararcter/chess/Chessboard'
import { useEffect, useRef } from 'react'
//@ts-ignore
import { debounce } from 'lodash'
export default function Go() {
  const goRef = useRef<HTMLCanvasElement | null>(null)
  const chessBoardRef = useRef<ChessBoard>(new ChessBoard())

  const _init = () => {
    const canvas = goRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 760
    canvas.height = 760
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    chessBoardRef.current.draw(ctx)
  }
  useEffect(() => {
    _init()
  }, [])
  const ListenMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log(111);
  }
  return (
    <div style={{ padding: '10px' }}>
      <canvas ref={goRef} style={{ height: '760px', width: '760px' }}
        onMouseMove={debounce(ListenMouse,300)}
      >

      </canvas>
    </div>
  );
}
