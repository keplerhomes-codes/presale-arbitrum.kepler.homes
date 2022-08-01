import { Link } from 'react-router-dom'
import {useCallback, useState, useEffect} from 'react'
import { Input, Button, InputNumber } from 'antd'
import Mintnav from '../components/layouts/Mintnav'
import Mintfooter from '../components/layouts/Mintfooter'
import Captcha from 'react-captcha-code'
import './Mint.scss'
import whitelist from '../lib/whitelist'
import { findCurrencyByAddress, showLogin, showRegister, fromUnit, toWei} from '../lib/util'
import Select from '../components/Base/Select'
import Countdown from '../components/Base/Countdown'
import { Collapse, Space, Tabs, Spin } from 'antd';
import { getPrice, getCurrency, mint} from '../contract/methods'
import notification from '../components/notification'
import {connect, useSelector} from 'react-redux'


const { TabPane } = Tabs;
const Cur = {
  'BNB': require(`../assets/images/token/BNB.svg`).default,
  'ETH': require(`../assets/images/token/ETH.png`)
}
export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)( (props)=> {
    let [cap, setCap] = useState('')
    let [loading, setLoading] = useState(false)
    let [currency, setCurrency] = useState('')
    let [price, setPrice] = useState('')
    let [wantSuit, setWantsuit] = useState(0)
    let [gender, setGender] = useState(0)
    let [num, setNum] = useState(1)

  const changeNum = (num) => {
    if(wantSuit) {
      setNum(6);
    } else {
      setNum(num);
    }
  }
  const toMint = () => {
    setLoading(true)
    console.log(price*num)
    mint(wantSuit?true:false, gender, num, Number(price*num).toString()).then(res => {
      setLoading(false)
    }).catch(err => {
      setLoading(false)
      notification.error({
        message: 'Transaction Failed'
      })
    })
  }
  const TabsData = [
    {
      icon: require('../assets/images/mint/desc.svg').default,
      title: 'Sales description',
      content:(<div>
        The player is a member of the Zeus II fleet. After a forced landing in the wilderness, contact with the mothership Titania is restored. Unfortunately, the signal is unstable and often disconnected.
        <br />
        Scientists assess that it may be related to the ion storm that the advanc team encountered during their landing. The Titanian Fleet senior management immediately developed the "Spring Action" plan.</div>)
    },
    {
      icon: require('../assets/images/mint/nft.svg').default,
      title: 'NFT equity'
    },
    {
      icon: require('../assets/images/mint/roadmap.svg').default,
      title: 'RoadMap'
    },
    {
      icon: require('../assets/images/mint/faq.svg').default,
      title: 'FAQ'
    },
    {
      icon: require('../assets/images/mint/tokenomics.svg').default,
      title: 'Tokenomics'
    }
  ]
  useEffect(async ()=> {
    setPrice(fromUnit(await getPrice()))
    let currency = await getCurrency()
    setCurrency(findCurrencyByAddress(currency))

  }, [props.chain])
  useEffect(()=> {
    setNum(6)
  }, [wantSuit])
  

  return (
    <div className='mint mint-page mint-bg'>
        <Mintnav/>
         <div className="mint-container">
            {/* <div className="mint-crumbs">Marketplace / Mint / <span className="cur">Mystery Boxes</span></div> */}
            <div className="flex flex-start m-t-40">
              <div className="banner">
              <model-viewer autoplay camera-controls alt="123" src={require('./gril.glb')}></model-viewer>
              </div>
              {/* <img src="" alt="" className='banner'/> */}
              <div className="m-l-60 flex-1">
                   <div className="flex">
                     <u className='fz-16 cf'>Expand All</u>
                     <span className='flex cf fz-16 m-l-20 p-l-20 youtube'>
                       <img className='m-r-10' src={require('../assets/images/mint/youtube.svg').default} alt="" />
                       Youtube
                       <img className='m-l-10' src={require('../assets/images/mint/share.svg').default} alt="" />
                     </span>
                   </div>

                   <div className="fz-40 cf ffm  m-t-20">
                     Kepler Mystery Box
                   </div>

                   <div className='flex m-t-20'>
                     <div className="bg3a flex flex-center p-l-18 p-r-18">
                        <img className='asset' src={require('../assets/images/mint/asset.png')} alt="" />
                       <span className='fz-20 cf'> 1399</span>
                     </div>
                     <Select className="bg3a" options={[
                       {
                         label: 'Random matching',
                         value: 0
                       },
                       {
                        label: 'I want mech suit',
                        value: 1
                      }
                     ]} onChange={setWantsuit}/>
                     
                     <Select className="bg3a" options={[
                       {
                         label: 'Female',
                         value: 0
                       },
                       {
                        label: 'Male',
                        value: 1
                      }
                     ]} onChange={setGender}/>
                   </div>
                   <div className="fz-20 cf m-t-30">
                    Description
                   </div>
                   <div className="fz-14 cf m-t-10">
                      Opening the mystery box, you could get a kepler ticket which could be swapped for a Dracoo NFT on https://kepler.homes/ with 6 parts, which could be Common, Rare, Epic or Legendary. 
                   </div>
                   <div className="fz-20 cf m-t-30">
                     Countdown
                   </div>
                   <div className='m-t-10 flex flex-between'>
                     <Countdown></Countdown>
                     <div className='fz-14 cf flex flex-center'>
                       Dutch auction countdown Instructions
                      <img className="m-l-10" src={require('../assets/images/mint/question.svg').default} alt="" />
                     </div>
                   </div>
                   <div className="fz-20 cf m-t-30">
                     Quantity
                   </div>
                   <div className="flex m-t-10">
                     <div className={"num cf pointer m-r-10 "+(num==1?'active':'')} onClick={()=>changeNum(1)}>
                       1
                     </div>
                     <div className={"num cf pointer m-r-10 "+(num==3?'active':'')} onClick={()=>changeNum(3)}>
                       3
                     </div>
                     <div className={"num cf pointer m-r-10 "+(num==6?'active':'')} onClick={()=>changeNum(6)}>
                       6
                     </div>
                     {
                       wantSuit ? '':
                     <input type="text" onChange={(e) =>changeNum(e)} className='num-input fz-20 cf ta'/>
                     }
                   </div>

                   <div className='flex flex-between flex-center m-t-60'>
                     <div className='flex flex-column'>
                          <span className="fz-20 cf">Price</span>
                          <div className='flex flex-center price m-t-10'>
                            <img className='eth' src={Cur[currency]} alt="" />
                            <span className='fz-30 cf fwb m-l-10 m-r-10'>
                              {price} {currency}
                            </span>
                            <span className="fz-16 cf">($495.76)</span>
                          </div>

                     </div>
                      <Button loading={loading}  className="mint-btn color ta cf btn w100 my-button" onClick={toMint}>Mint</Button>
                   </div>
              </div>

            </div>

            {/* tabs   */}
            <Tabs className='my-tab m-t-120'>
              {
                TabsData.map(item => {
                    return (<TabPane tab={
                      <div className='flex flex-center p-b-36 p-r-60'>
                        <img src={item.icon} alt="" />
                        <span className='fz-20 m-l-10'>
                          {item.title}
                        </span>
                        
                      </div>
                    } key={item.title}>
                      <div className="cf fz-20 m-t-10">{item.content}</div>
                    </TabPane>)
                })
              }
               
            </Tabs>



            
        
        
         </div>
         
         <Mintfooter />
    </div>
  )
}
);