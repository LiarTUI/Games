import FlyGames from './pages/FlyGames'
export default function App() {
    const canvasSize = {
        CanvasWidth: 1000,
        CanvasHeight: 500
    }
    return (
        <div>
            <FlyGames CanvasHeight={canvasSize.CanvasHeight} CanvasWidth={canvasSize.CanvasWidth}></FlyGames>
        </div>
    )

}