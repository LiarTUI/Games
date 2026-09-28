import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import reactGamePgae from './pages/reactGamePage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import FlyGame from './pages/reactGamePage/FlyGames/index.tsx';
import Go from './pages/IQGamePage/Go/index.tsx';
const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            { path: 'reactGame', Component: reactGamePgae },
        ]
    },
    {
        path: '/flyGame',
        Component: FlyGame
    },
    {
        path: '/Go',
        Component: Go
    },
])
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
