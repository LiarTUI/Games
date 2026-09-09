import FlyGames from './FlyGames'
import { FlyGameImg } from '../../assets/reactGame/index'
import './index.less'
import { useNavigate } from 'react-router-dom'
export default function Index() {
    const navigate = useNavigate()
    const gameWithImg = [{
        props: {
            CanvasWidth: 1000,
            CanvasHeight: 500
        },
        label: '笨球先飞',
        game: FlyGames,
        img: FlyGameImg,
    }]
    const handlePlayThisGame = (props: any) => {
        navigate('/flyGame', {
            state: props
        })
    }
    return (
        <div className="ReactGameGrid">
            {
                gameWithImg.map((item) => {
                    const Img = item.img
                    return (
                        <div
                            key={item.label}
                            className="game"
                            onClick={() => handlePlayThisGame(item.props)}
                        >
                            <Img />
                            <span style={{ fontFamily: 'SimHei' }}>{item.label}</span>
                        </div>
                    )
                })
            }
        </div>
    );
}
