import './NFT.scss'
import { Tabs } from 'antd';
import Nft from "./NFTItem"
const { TabPane } = Tabs;
export default function () {
    return (
        <div className='nft-assets'>
            <div className="bg31 p-l-20 p-r-20 p-t-25 p-b-25 flex flex-between">
                <span className="fz-24 fwb cf">NFT Assets</span>
                <div className="btns flex cf ">
                    <div className="bge fz-14 ta p-l-17 p-r-17 p-t-10 p-b-10 m-r-20">Recharge</div>
                    <div className="bg59  fz-14 ta p-l-17 p-r-17 p-t-10 p-b-10">Withdraw</div>
                </div>
            </div>
            
            <Tabs defaultActiveKey="1" className='my-tab m-t-60'>
                <TabPane tab="NFT Favorites (6)" key="1" className='flex flex-wrap'>
                    <Nft/>
                    <Nft/>
                    <Nft/>
                    <Nft/>
                </TabPane>
                <TabPane tab="On sales(25)" key="2">
                </TabPane>
            </Tabs>
        </div>
    )
}