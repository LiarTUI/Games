import FlyGames from './pages/FlyGames'
import './App.less'
export default function App() {
    const canvasSize = {
        CanvasWidth: 1000,
        CanvasHeight: 500
    }
    return (
        <div className="game-wrap">
            <FlyGames CanvasHeight={canvasSize.CanvasHeight} CanvasWidth={canvasSize.CanvasWidth}></FlyGames>
        </div>
    )

}