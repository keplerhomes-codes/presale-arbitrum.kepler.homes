import Airnav from "../components/layouts/Airnav"
import './Airdrop.scss'
import { Button, Carousel} from "antd"
import { Link } from "react-router-dom"
import { tokenList } from "../lib/airdrop"
import {queryVariables, queryClaimers} from '../contract/methods/airdrop'
import { useEffect, useState} from "react"
import { addPoint, findNameByAddress, fromUnit, numFormat, toUnit, toWei } from "../lib/util"
import { toFixed } from "accounting"
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const Claimprogress = ({info}) => {
    let [refresh, setRefresh] = useState(0)
    let [totalRewardAmount, setTotalRewardAmount] = useState(0)
    let [totalClaimedRewardAmount, setTotalClaimedRewardAmount] = useState(0)
    
    useEffect(async ()=>{
        if(info.type) {
            let config = await queryVariables(info.tokenName)
            console.log(config)
            setTotalRewardAmount(fromUnit(config.totalRewardAmount))
            setTotalClaimedRewardAmount(fromUnit(config.totalClaimedRewardAmount))
        }
        
    },[refresh])
    return (
        <div className="token-item flex flex-center m-b-50">
                             <div className="logo-area">
                             <img src={info.icon} alt="" className="token-logo"/>
                             <span className="show-p">
                              <img src={require('../assets/images/airdrop/hover.png')} alt="" className="hover"/>
                             </span>
                             
                             </div>
                             <div className="flex flex-column progress-part cf flex-1 p-l-34">
                                 <span className="fz-20 fwb token-name">{info.name}</span>
                                 <div className="flex flex-between w100 progress-info">
                                     <span className="cf">holders claimed</span>
                                     <span>{numFormat(Number(totalClaimedRewardAmount).toFixed(0))}/{numFormat(totalRewardAmount) }</span>
                                 </div>
                                 <div className="progress-outter m-t-15 w100 flex flex-between flex-center">
                                     <div className={"progress-inner "+info.className} style={{width:(totalClaimedRewardAmount*100/totalRewardAmount)+'%'}}></div>
                                     <span className="fz-12 progress-text">{(totalClaimedRewardAmount*100/totalRewardAmount).toFixed(2)}%</span>
                                 </div>
                             </div>
                         </div>
    )
}
const Avatar = [
    require(`../assets/images/airdrop/avatar/1.svg`).default,
    require(`../assets/images/airdrop/avatar/2.svg`).default,
    require(`../assets/images/airdrop/avatar/3.svg`).default,
    require(`../assets/images/airdrop/avatar/4.svg`).default,
    require(`../assets/images/airdrop/avatar/5.svg`).default,
    require(`../assets/images/airdrop/avatar/6.svg`).default,
    require(`../assets/images/airdrop/avatar/7.svg`).default,
    require(`../assets/images/airdrop/avatar/8.svg`).default,
    require(`../assets/images/airdrop/avatar/9.svg`).default,
    require(`../assets/images/airdrop/avatar/10.svg`).default,
]
let communityList = [
    {
      name: 'twitter',
      icon: require('../assets/images/airdrop/twitter.svg').default,
      activeIcon: require('../assets/images/airdrop/twitter_active.svg').default,
      link: 'https://twitter.com/KeplerHomes'
    },
    {
      name: 'telegram',
      icon: require('../assets/images/airdrop/telegram.svg').default,
      activeIcon: require('../assets/images/airdrop/telegram_active.svg').default,
      link: 'https://t.me/KeplerHomes'
    },
    {
      name: 'discord',
      icon: require('../assets/images/airdrop/discord.svg').default,
      activeIcon: require('../assets/images/airdrop/discord_active.svg').default,
      link: 'https://discord.gg/keplerhomes'
    },
    {
      name: 'medium',
      icon: require('../assets/images/airdrop/medium.svg').default,
      activeIcon: require('../assets/images/airdrop/medium_active.svg').default,
      link: 'https://medium.com/@KeplerHomes'
    }
  
  ]
const Who = () => {
    let [claimersList, setClaimers] = useState([])

    const getClaimers =async() => {
        let claimers1 = await queryClaimers('APE')
        let claimers2 = await queryClaimers('BEND')
        let claimers3 = await queryClaimers('LOOKS')
        let claimers4 = await queryClaimers('AXS')
        let claimers5 = await queryClaimers('SAND')
        let claimers6 = await queryClaimers('WRLD')
        setClaimers([...claimers1, ...claimers2, ...claimers3, ...claimers4, ...claimers5, ...claimers6].reverse())
     }
     useEffect(()=>{
         getClaimers()
     },[])
    return (
        <div className="who">
            <img className="flower" src={require('../assets/images/airdrop/flower.svg').default} alt="" />
            <div className="message">
                <Carousel dotPosition="right" autoplay dots={false}>
                            <div className="p-3">
                                <div className="cf flex msg-item flex-between">
                                    <span className="flex flex-center message-text fz-16 fw500">
                                        <img  className="avatar" src={Avatar[0]} alt="" />
                                        {addPoint(claimersList[0], 3)}
                                    </span>
                                    <span className="message-text">
                                    Claimed 400.00 PreKEPL
                                    </span>
                                </div>
                            </div>
                {
                        claimersList.length && claimersList.map((item, index) => {
                           return (
                            (index%2==0 && index>0) && <div className="p-3" key={index}>
                                <div className="cf flex msg-item flex-between">
                                    <span className="flex flex-center message-text fz-16 fw500">
                                        <img  className="avatar" src={Avatar[Math.floor(Math.random()*10)]} alt="" />
                                        {addPoint(item, 3)}
                                    </span>
                                    <span className="message-text">
                                    Claimed 400.00 PreKEPL
                                    </span>
                                </div>
                            </div>
                           )
                        })
                    }
                </Carousel>
                <Carousel dotPosition="right" autoplay dots={false}>
                            <div className="p-3">
                                <div className="cf flex msg-item flex-between">
                                    <span className="flex flex-center message-text fz-16 fw500">
                                    <img  className="avatar" src={Avatar[1]} alt="" />
                                        {addPoint(claimersList[1], 3)}
                                    </span>
                                    <span className="message-text">
                                    Claimed 400.00 PreKEPL
                                    </span>
                                </div>
                            </div>
                {
                        claimersList.length && claimersList.map((item, index) => {
                           return (
                            (index%2==1 && index>1) && <div className="p-3" key={index}>
                                <div className="cf flex msg-item flex-between">
                                    <span className="flex flex-center message-text fz-16 fw500">
                                        <img  className="avatar" src={Avatar[Math.floor(Math.random()*10)]} alt="" />
                                        {addPoint(item, 3)}
                                    </span>
                                    <span className="message-text">
                                    Claimed 400.00 PreKEPL
                                    </span>
                                </div>
                            </div>
                           )
                        })
                    }
                </Carousel>
                
            </div>
        </div>
    )
}
export default () => {
    let [activeKey, setActive] = useState('1')
    return (
        <div className="airdrop w100 m-t-0">
            <Airnav/>


            <div className="airdrop-banner p-t-60 w100">
                
                 <div className="airdrop-banner-content flex flex-between">
                     <div className="air-left-part p-t-104">
                         <div className="kepler fwb">Kepler Homes</div>
                         <div className="slogan fwb">
                         an <div className="aaa flex flex-center flex-middle">
                            AAA 
                           <img src={require('../assets/images/airdrop/silk.svg').default} alt="" />
                         </div> blockchain based NFT Game owned by players.
                         </div>
                         <div className="fz-18 cf m-t-30 kepler-desc">
                         Kepler's first airdrop reward will be given to the token holders of 
                         </div>
                         
                         <div className="fz-18 cf fwb pointer ce kepler-desc-ce">
                         AXS(Axie Infinity),SAND(The Sandbox),WRLD(NFT Worlds), LOOKS (LooksRare), APE (Apecoin), and BEND (BendDao)
                         </div>
                         <div className="btns flex flex-between m-t-60 ">
                             <Link to="/airdrop/claim">
                             <Button className="my-button fz-20 color cf air-btn claim-btn fwb">AirDrop Claim</Button>
                             </Link>
                             <a href="https://nft-mint.kepler.homes/nft-whitelist" target="_blank">
                             <Button className="my-button fz-20 cf air-btn white-btn fwb">NFT Whitelist</Button>
                             </a>
                         </div>
                         <div className="show-m flex flex-center flex-middle m-t-30">
                         <a className="m-l-13 m-r-13 trust_icon flex flex-center" href="https://resources.kepler.homes/kepler-audit-trustlook.pdf" target="_blank">
                            <img src={require('../assets/images/airdrop/trust.svg').default} alt="" className='icon'/>
                            {/* <span className='cf fz-16'>Audit by TrustLook</span> */}
                            </a>
                           {
                                communityList.map(item => {
                                    return (
                                    <a className="m-l-13 m-r-13 community_icon" href={item.link} target="_blank">
                                        <img src={item.icon} alt="" className='icon'/>
                                    </a>
                                    )
                                })
                            }
                         </div>
                         
                         <div className="white-line show-m">
                             <div className="line-item"></div>
                         </div>

                     </div>

                     {/* right-part */}
                     <div className="air-right-part p-t-100">
                      <div className="tab-nav-progress flex flex-center flex-middle pointer m-b-60">
                          <div className={"tab-nav-inner flex-1 "+(activeKey =="1"? 'active':'')} onClick={()=>setActive('1')}></div>
                          <div className={"tab-nav-inner flex-1 "+(activeKey =="2"? 'active':'')} onClick={()=>setActive('2')}></div>
                      </div>
                     <Tabs activeKey={activeKey} className="progress-tab" animated>
                        <TabPane tab="1" key="1">
                        {
                             tokenList.map((item, index) => {
                                    return index < 3 && <Claimprogress info={item} />
                             })
                         }
                        </TabPane>
                        <TabPane tab="2" key="2">
                        {
                             tokenList.map((item, index) => {
                                return index >= 3 && <Claimprogress info={item} />
                             })
                         }
                        </TabPane>
                      </Tabs>

                         


                     </div>


                     <img src={require('../assets/images/airdrop/arrow.png')} alt="" className="arrow show-p"/>
                     {/* right-part */}
                     <Who/>


                 </div>

               
                 

            </div>
            <div className="airdrop-info">
                <div className="airdrop-info-content">
                    <div className=" flex flex-around metrics-box">
                        <div className="metrics">
                            <span className="fz-56 fwb metrics-title">Token <br></br>Metrics</span>
                            <div className="fz-24 m-t-30 metrics-desc">
                                The<span className="fwb ce"> rewarded PreKEPL can be swaped to KEPL </span>
                                which can be consumed in the Kepler Homes' ecosystem acitivities.
                            </div>
                        </div>
                        <div className="right-info-part">
                            
                            <div className="giveaway giveaway-area">
                                <div className="fz-24 fwb giveaway-title">6,000,000 PreKEPL</div>
                                <div className="fz-18 m-t-5 giveaway-desc">Airdrop Giveaway</div>
                            </div>
                            
                            <div className="giveaway snapshot">
                                <div className="fz-24 fwb giveaway-title">2022-05-10 24:00:00 UTC</div>
                                <div className="fz-18 m-t-5 giveaway-desc">Snapshot Time: BEND,APE,LOOKS</div>
                            </div>
                            <div className="giveaway start">
                                <div className="fz-24 fwb giveaway-title">2022-05-26 12:00:00 UTC</div>
                                <div className="fz-18 m-t-5 giveaway-desc">Snapshot Time: AXS,SAND,WRLD</div>
                            </div>
                             {/*<div className="giveaway end">
                                <div className="fz-24 fwb giveaway-title">2022-12-12 12:23:32 pm</div>
                                <div className="fz-18 m-t-5 giveaway-desc">End Date</div>
                            </div> */}

                        </div>
                    </div>
                    

                    <img className="star star1 show-p" width={149} src={require('../assets/images/airdrop/star.png')} alt="" />
                    <img className="star star2 show-p" width={60} src={require('../assets/images/airdrop/starmini.png')} alt="" />
                    <img className="star star3 show-p" width={40} src={require('../assets/images/airdrop/starmi.png')} alt="" />

                    <div className="question fz-18">
                        Want to know more about the Kepler NFT?
                        The NFT 
                        <a href="https://nft-mint.kepler.homes/nft-whitelist" target="_blank"><u className="fwb"> whitelist</u> </a>
                        
                        is still open, don`t miss it!

                        <div className="line line1"></div>
                        <div className="line line2"></div>
                        <div className="line line3"></div>
                        <div className="line line4"></div>
                    </div>
                    <div className="footer flex flex-center flex-middle">
                        <img src={require('../assets/images/airdrop/mini-logo.png')} alt="" className="mini-logo"/>
                        <span className="fz-14 m-l-11">Kepler © 2022, All rights reserved</span>
                    </div>

                </div>


                <img src={require('../assets/images/airdrop/lines.png')} alt="" className="w100 lines-img show-p"/>
                <div className="show-m w100 flex flex-middle">
                    <img src={require('../assets/images/airdrop/lines.png')} alt="" className="lines-mobile"/>
                </div>
            </div>

        </div>
    )
}