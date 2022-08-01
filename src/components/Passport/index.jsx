import './index.scss'
import KeplerPassport from '../../assets/images/passport/KeplerPassporth.png'
import UniversePassport from '../../assets/images/passport/UniversePassporth.png'
import ZeusPassport from '../../assets/images/passport/ZeusPassporth.png'
import star from '../../assets/images/passport/xing.svg'
import arrow from '../../assets/images/passport/arrow.svg'
import plus from '../../assets/images/passport/plus.svg'
import minus from '../../assets/images/passport/minus.svg'
import { Carousel, Tooltip } from 'antd';
import BUSD from '../../assets/images/token/BUSD.svg'
import USDT from '../../assets/images/token/USDT.svg'
import USDC from '../../assets/images/token/USDC.svg'
import {Button} from 'antd'
import { useState } from 'react'
import { Collapse, Space } from 'antd';
import arrow1 from '../../assets/images/passport/arrow1.svg'

const { Panel } = Collapse;
let bannerImages = [
    {
        name: 'Zeus Passport',
        img: ZeusPassport,
        price:199,
        color: 'rgba(205, 186, 250, 1)',
        index: 0,
        active:true
    },
    {
        name: 'Kepler Passport',
        img: KeplerPassport,
        price: 299,
        color: 'rgba(0, 216, 229, 1)',
        index: 1,
        active:false
    },
    {
        name: 'Universe Passport',
        img: UniversePassport,
        price: 799,
        color: 'rgba(255, 220, 133, 1)',
        index: 2,
        active:false
    }
]
const Carousels = function() {
    
    let [activeIndex, setActiveIndex] = useState(0)
    return (
        <div className='flex flex-column carousel'>
            <Carousel dotPosition="bottom">
                {
                    bannerImages.map(item => {
                        return (
                            <div key={item.name}>
                                <img src={item.img} alt="" />
                                <div className="star flex cgold fz-24 flex-middle">
                                    <img src={star} alt="" />
                                    <span className='p-12'>{item.name}</span>
                                    <img src={star} alt="" />
                                </div>
                            </div>
                        )
                    })
                }
            </Carousel>
            
            <Space direction="vertical" size={0}>
                
                <Collapse  expandIcon={() => <img src={arrow1} alt="" className="arrow" />} expandIconPosition="right">
                <Panel header="How to earn">
                    <p dangerouslySetInnerHTML={{__html: '456'}}></p>
                </Panel>
                </Collapse>
                <Collapse  expandIcon={() => <img src={arrow1} alt="" className="arrow" />} expandIconPosition="right">
                <Panel header="Passport FAQ">
                    <p dangerouslySetInnerHTML={{__html: '456'}}></p>
                </Panel>
                </Collapse>

            </Space>
        </div>
    )
}
const Types = function ({info, activeChange}) {
    let [num, setNum] = useState(1)
    return (
        <div className={'type-box flex flex-column p-16 pointer '+(info.active?'active':'')} onClick={()=>activeChange(info.index)}>
            <span className="yes">
                <img src={require('../../assets/images/passport/yes.svg').default} alt="" />
            </span>
            <span className="fz-16">{info.name}</span>
            <span className='price kepler fwb m-t-10 flex flex-center' style={{color: info.active ?info.color:'#fff'}}>
                <img src={BUSD} alt="" className='token' />
                <span className="fz-32 m-l-6">
                 {info.price}
                </span>
                <span className='fz-18 m-l-6 m-t-10 '>BUSD</span>
            </span>
            <div className="cal flex flex-between m-t-6">
                <img src={minus} alt="" onClick={()=> {
                    num >1 && setNum(num-1)
                }}/>
                <input type="text" className='ta' value={num}/>
                <img src={plus} alt="" onClick={()=> {
                    num <10 && setNum(num+1)
                }}/>
            </div>
        </div>
    )
}
const Good = function() {
    let [goodsList, setGoodsList] = useState(bannerImages)
    const activeChange = (index) => {
        console.log(index)
        let list = [...goodsList]
        list.map(item => {
            item.active = false
            if(item.index == index) {
                item.active = true
            }
            return item
        })
        setGoodsList(list)
    }
    return (
        <div className='flex flex-column good'>
            <div className="benefits">
                <div className="title fz-20 c0">Passport Core Benefits Display</div>
                <div className="contents fz-16 cf">
                The genesis NFT collection from Ultiverse, Electric Sheep consists of 10,000 PFPs that unlock a variety of utilities and benefits within our social gaming metaverse for holders.
                </div>
            </div>
            <div className="select-area m-t-30">
                <div className="title fz-16 cf">
                  Select PassType
                </div>
                <div className="types flex flex-between m-t-16">
                    {
                        goodsList.map(item => {
                            return  <Types key={item.name} info={item} activeChange={activeChange}/>
                        })
                    }
                </div>
            </div>
            
            <div className="currency-area m-t-36 flex flex-center">
                <div className="title fz-16 cf ">
                  Price
                </div>
                <div className="tokens flex flex-center fz-42 cgold fwb">
                    $199
                </div>
                <div className="fz-16 cf m-l-12">≈ $ 189.98</div>
                <div className="discount fz-16">-60%</div>
            </div>
            <div className="member flex flex-first flex-center m-t-36">
                <img src={require('../../assets/images/passport/checkbox.svg').default} alt="" />
                <span className='fz-16 cf m-l-11'>Game guild & agent bulk purchase</span>
                <Tooltip title="tip">
                    <img className='m-l-8' src={require('../../assets/images/passport/question.svg').default} alt="" />
                </Tooltip>
            </div>
            <div className='fz-14 cf m-t-40'>
            Sales Policy Description:
            <span className='desc fz-14 '>
                Buy more than 5 Zeus cards at one time, you can become a silver card agent, and you can get 20% of the agent's sales commission, which will be directly credited to your account
            </span>
            </div>
            <div className='flex flex-center flex-between m-t-56'>
                <Button className='bgold c0 bottom-btn pay-btn fz-20'>Pay Passport</Button>
                <Button className='cgold bottom-btn invite-btn fz-20'>Invite friends</Button>
            </div>
        </div>
    )
}



export default function () {
    return (
        <div className="cf passport flex  m-t-50 flex-between">
            <Carousels/>
            <Good/>
        </div>
    )
}