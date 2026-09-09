import reactGamePage from './pages/reactGamePage'
import IQGame from './pages/IQGamePage'
import './App.less'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react';
const { Header, Content } = Layout
type MenuItem = Required<MenuProps>['items'][number];
export default function App() {
    const [current, setCurrent] = useState('react')
    const items: MenuItem[] = [
        {
            label: '反应类',
            key: 'react'
        },
        {
            label: '智力类',
            key: 'IQ'
        }
    ]
    const KeyAndComponentMap = [
        {
            key: 'react',
            component: reactGamePage
        },
        {
            key: 'IQ',
            component: IQGame
        }
    ]
    const handleChangeTab: MenuProps['onClick'] = (e) => {
        setCurrent(e.key)
    }
    const currentItem = KeyAndComponentMap.find(item => item.key === current)
    const RenderComponent = currentItem?.component
    return (
        <div className="game-wrap">
            <Layout className="layout">
                <Header className="header">
                    <Menu className="menu" onClick={handleChangeTab} items={items} mode="horizontal" selectedKeys={[current]} />
                </Header>
                <Content>
                    {RenderComponent && <RenderComponent />}
                </Content >
            </Layout>
        </div>
    )

}