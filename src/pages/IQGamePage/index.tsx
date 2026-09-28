import Go from './Go'
import { useNavigate } from 'react-router-dom'
export default function Index() {
  const navigate = useNavigate()
  const gameWithImg = [{
    props:{},
    label: '围棋',
    game: Go,
    // img: FlyGameImg,
    address:'/Go'
  }]
  const handlePlayThisGame = (address:string,props: any) => {
    navigate(address, {
      state: props
    })
  }
  return (
    <div>
      {gameWithImg.map((item, index) => {
        return (
          <div
            key={item.label}
            className="game"
            onClick={() => handlePlayThisGame(item.address,item.props)}
          >
            {/* <Img /> */}
            <span style={{ fontFamily: 'SimHei' }}>{item.label}</span>
          </div>
        )
      })}
    </div>
  );
}
