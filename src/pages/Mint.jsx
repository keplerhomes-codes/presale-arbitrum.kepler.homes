import { Link } from 'react-router-dom'
import {useCallback, useState, useEffect} from 'react'
import { Input, Button, InputNumber, Radio, Row, Col, Skeleton, Tooltip   } from 'antd'
import Mintnav from '../components/layouts/Mintnav'
import Mintfooter from '../components/layouts/Mintfooter'
import Captcha from 'react-captcha-code'
import './Mint.scss'
import whitelist from '../lib/whitelist'
import { findCurrencyByAddress, showLogin, ChainIdMap, showConnectWallet, showRegister, fromUnit, toWei, fullNameBySymbol} from '../lib/util'
import Select from '../components/Base/Selectmint'
import Countdown from '../components/Base/Countdown'
import { Collapse, Space, Tabs, Spin } from 'antd';
import { getVariableView, getMintConfig, keccak256MintArgs,  mint, getMintCount, queryPaymentConfig} from '../contract/methods/mint'
import notification from '../components/notification'
import {connect, useSelector} from 'react-redux'
import Tokenomics from './Tokenomics'
import minttext from '../lib/minttext'
import Roadmap from '../components/Mint/roadmap'
import Faq from '../components/Mint/Faq'
import { get, axios_get, post} from '../http'
import { toFixed } from 'accounting'
import videoSrc from './banner.webm'
import { allowance, approve, isAddress } from '../contract/methods'
import { getCurAddress } from '../contract/testnet/address'
import { useLocation } from 'react-router-dom';
import { ZERO_ADDRESS } from '../lib/util'
import {sign} from '../contract/methods/index'
import { t } from 'i18next'
import { setToConnectWallet } from '../store'
import store, { setToken, setUserInfo } from '../store'


const { TabPane } = Tabs;
const Cur = {
  'BNB': require(`../assets/images/token/BNB.svg`).default,
  'ETH': require(`../assets/images/token/ETH.png`)
}
let selectOptions = [
  {
    label: 2,
    value: 2
  },
  {
    label: 4,
    value: 4
  } ,
  {
    label: 5,
    value: 5
  } ,
  {
    label: 7,
    value: 7
  } ,
  {
    label: 8,
    value: 8
  } ,
  {
    label: 9,
    value: 9
  } 
]
export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)( (props)=> {
    let [loading, setLoading] = useState(false)
    let [loadingC, setLoadingC] = useState(false)
    let [currency, setCurrency] = useState('')
    let [currencyAddress, setCurrencyAddress] = useState('')
    let [price, setPrice] = useState('')
    let [wantSuit, setWantsuit] = useState(0)
    let [gender, setGender] = useState(0)
    let [num, setNum] = useState(1)
    let [inputNum, setInputnum] = useState('')
    let [lastNum, setLastnum] = useState(0)
    let [status, setStatus] = useState(0)
    let [deadline, setDeadline] = useState('')
    let [chain, setChain] = useState(props.chain)
    let [mintamount, setMintamount] = useState(0)
    let [refresh, setRefresh] = useState(0)
    let [usdPrice, setUsdprice] = useState(0)
    let [lastTime, setLasttime] = useState(0)
    let [needApprove, setNeedApprove] = useState(true)
    let [referAddress, setAddress] = useState(useLocation().search ? useLocation().search.replace('?','').split('=')[1]?.toLowerCase():'')
    let [showErr, setShowErr] = useState(false)
    let [total, setTotal] = useState(0)

  // const setSort = () => {}
  const changeNum = (num) => {
    setInputnum('')
    if(wantSuit) {
      setNum(6);
    } else {
      setNum(num);
    }
  }
  let setSort = (num) => {
    console.log(num)
    // if (!/^[0-9]*[.,]?[0-9]*$/.test(num) || num.indexOf('+') >=0 || num.indexOf('-') >=0 ) {
    //     return
    // }
    changeNum(num)
    setInputnum(num)
  }
  
  let inputAddress = (e) => {
    setAddress(e.target.value)
  }
  let checkAddress = ()=>{
    if(referAddress && !isAddress(referAddress)) { // if not a address
      setShowErr(true)
      return false 
    } else {
      setShowErr(false)
      return true
    }
  }
  const Login = async(index) => {
    let signature = await sign('login')
    post('/api/account/connect', {
      chainId: ChainIdMap[localStorage.getItem('kepler_chain')||'ETH'],
      user: props.account,
      signature
    }).then(res => {
      props.dispatch(setToken(res.data.token))
      // get person info
      get('/api/v1/account').then(res => {
        store.dispatch(setUserInfo(res.data))
      })
    }).catch(err => {
      notification.error({
        message: t('Login Fail'),
        description: t('Something goes wrong')
    });
    })
  }
  let toApprove = () => {
    setLoading(true)
    approve(currencyAddress, getCurAddress().MysteryBox).then(res => {
      setNeedApprove(false)
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }
  const toMint = async () => {
    if(!checkAddress()) {
      return
    }
    setLoading(true)
    post('/api/box/mint', {
      sender: props.account.toLowerCase(),
      referral: referAddress||ZERO_ADDRESS
    }).then(res => {
      mint(wantSuit?true:false, gender, num, referAddress||ZERO_ADDRESS, '0x'+res.data.signature, Number(price*num).toString(), currencyAddress == ZERO_ADDRESS).then(res => {
        setLoading(false)
        setRefresh(refresh+1)
      }).catch(err => {
        setLoading(false)
        notification.error({
          message: 'Transaction Failed'
        })
      })
    }).catch(err=> {
      setLoading(false)
      notification.error({
        message: "Inviter's Address is not correct"
      })
    })
    
  }
  const TabsData = [
    {
      icon: require('../assets/images/mint/desc.svg').default,
      title: 'Sales description',
      content: minttext['sales description']
    },
    {
      icon: require('../assets/images/mint/nft.svg').default,
      title: 'NFT equity',
      content: minttext['nft equity']
    },
    {
      icon: require('../assets/images/mint/roadmap.svg').default,
      title: 'RoadMap',
      content: <Roadmap/>
    },
    {
      icon: require('../assets/images/mint/faq.svg').default,
      title: 'FAQ',
      content: <Faq/>
    },
    {
      icon: require('../assets/images/mint/tokenomics.svg').default,
      title: 'Tokenomics',
      content: <Tokenomics width={500}/>
    }
  ]
  const fullScreen = () =>{
    var ele = document.getElementById('video');
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullScreen) {
      ele.webkitRequestFullScreen();
    }
  }
  
  const copyAddress = useCallback(async () => {
    if(!props.account) {
      notification.error({
          message: t('Please connect your wallet first')
        });
        return
     }
    await navigator.clipboard.writeText('https://'+window.location.host+'/nft-mint?address='+props.account);
    notification.success({
      message: t('Invitation link has been generated, please send it to your friends!'),
    });
  }, [props.account]);
  const getVariable = async () => {
    setLoadingC(true)
    document.querySelector('.banner') && document.querySelector('.banner').play()
    let variable = await getVariableView()
    let payment = await queryPaymentConfig()
    console.log(variable)
    setPrice(fromUnit(variable.currentPrice))
    setCurrency(findCurrencyByAddress(payment.currency, props.chain))
    setCurrencyAddress(payment.currency)
    setLastnum(Number(variable.maleMintedCount) + Number(variable.femaleMintedCount))
    let last = (Math.floor(new Date().getTime()/1000)-Number(payment.genisTime))%payment.priceAdjustInterval
    setLasttime(payment.priceAdjustInterval-last)
    setLoadingC(false)
    let token_name = fullNameBySymbol[findCurrencyByAddress(payment.currency, props.chain)]
    let token_price = await axios_get('https://api.coingecko.com/api/v3/simple/price', {
      ids: token_name,
      vs_currencies:'usd'
    })
    console.log(token_price)
    token_price[token_name] && setUsdprice(token_price[token_name].usd)
  }
  const getConfig = async() => {
    let config = await getMintConfig()
    setTotal(Number(config.femaleMax)+Number(config.maleMax))
  }
  useEffect(()=> {
    getVariable()
    getConfig()
  }, [])
  useEffect(()=> {
      if(props.chain != chain) {
        window.location.reload()
      }
  }, [props.chain])
  useEffect(()=> {
    wantSuit && setNum(6)
  }, [wantSuit])
  useEffect(async()=>{
    console.log(props.account)
    console.log(currencyAddress)
    if(currencyAddress == ZERO_ADDRESS) {
      setNeedApprove(false)
      return
    }
    if(props.account && currencyAddress) {
      let allow = await allowance(currencyAddress, getCurAddress().MysteryBox).call()
      setNeedApprove(allow <= 0 )
    }
  }, [props.account, currencyAddress])
  useEffect(async ()=> {
    if(props.account) {
      setLoading(true)
      let amount = await getMintCount(props.account.toLowerCase())
      setMintamount(amount)
      if(props.token) {
        get('/api/account/white', {
          address: props.account.toLowerCase()
        }).then(res => {
          setStatus(res.data.status)
          setLoading(false)
        }).catch(err => {
          setStatus('')
          setLoading(false)
        })
      }else {
        setStatus('')
        setLoading(false)
      }
      
    } else {
      setStatus('')
      setLoading(false)
    }
    
  }, [props.account, props.userInfo.email, refresh])
  

  return (
    <div className='mint mint-page mint-bg'>
        <Mintnav/>
         <div className="mint-container">
            {/* <div className="mint-crumbs">Marketplace / Mint / <span className="cur">Mystery Boxes</span></div> */}
            <div className='flex w100 flex-start mint-wrap'>
            <div className='flex-1 left-part'>
              <div className="nft-name cf w100 flex flex-between flex-end">
                <span>
                Kepler Mystery Box
                </span>
                <span className='flex flex-center'>
                <a className='flex cf price-title m-r-20 p-l-20 youtube pointer' target="_blank" href="https://www.youtube.com/channel/UClN9tsN8atf0QHbRtUlX5aw">
                       <img className='m-r-10' src={require('../assets/images/mint/youtube_red.svg').default} alt="" /><img style={{marginLeft: '-5px'}} src={require('../assets/images/mint/xie.svg').default} alt="" />
                  </a>
                <Tooltip color="#E07D26" title={
                    <div>
                      <div>1. Recommenders can get KEPL token reward of 5% of NFT Mint amount. </div>
                      <div>2. Different recommenders have the same address as their own white list.</div>
                    </div>
                  }>
                    <span className='fz-16 apply pointer flex' onClick={copyAddress}>
                      Invite Friend
                      <img src={require('../assets/images/mint/share.svg').default} alt="" className='m-l-3' />
                    </span>
                  </Tooltip>
                  
                </span>
                
                   
              </div>
               {/* <div className="flex">
                     <u className='price-title cf pointer' onClick={fullScreen}>Expand All</u>
                     <a className='flex cf price-title m-l-20 p-l-20 youtube pointer' target="_blank" href="https://www.youtube.com/channel/UClN9tsN8atf0QHbRtUlX5aw">
                       <img className='m-r-10' src={require('../assets/images/mint/youtube.svg').default} alt="" />
                       Youtube
                       <img className='m-l-10' src={require('../assets/images/mint/share.svg').default} alt="" />
                     </a>
                </div> */}
                <div className="banner-box m-t-20">
                {/* <model-viewer autoplay camera-controls alt="cover"  src={require('../assets/B.glb')}></model-viewer> */}


                   <video src={videoSrc} playsInline loop autoPlay muted controls className='banner'></video>
                </div>
                </div>
               <div className='right-part'>
                   <div className="flex flex-center flex-between flex-wrap">
                      <div className="type-title cf">Minted</div>
                      <div className="flex flex-center">
                            <img className='asset' src={require('../assets/images/mint/asset.png')} alt="" />
                         {
                           loadingC ?
                           <Skeleton.Button active={true} size='small' shape='default' block={false} />:
                           <span className='fz-med cf m-l-5'> {lastNum}/{total}</span>
                         }
                          
                        </div>
                   </div>
                   <div className='progress flex m-t-17'>
                     <div className="progress-fixed color" style={{width: (lastNum)*100/total+'%'}}></div>
                     <div className="progress-last flex-1"></div>
                   </div>
                   <div className="flex flex-center flex-wrap m-t-20">
                    <div className="type-title c06 flex flex-column">
                      Countdown 
                    </div>
                    <div className="flex flex-center">
                      <Countdown deadline={lastTime} timeoutFn={getVariable}></Countdown>
                      <span className='fz-14 cf m-l-20'>
                        <Tooltip color="#E07D26" title="The price of the mystery boxes will be 0.5 ETH at the beginning of the auction, with an increase of 0.001 ETH every 2 hours, with a maximum price of 0.7 ETH." placement='rightBottom'>
                        <img src={require('../assets/images/mint/tip.svg').default} alt="" />
                        </Tooltip>
                        
                        </span>
                    </div>
                    
                   </div>
                   <div className="flex flex-center m-t-20">
                    <div className="type-title c06 ">Types</div>
                    <div className='flex cf flex-wrap flex-1 '>
                      <Radio.Group className='my-radio' buttonStyle="solid" name="radiogroup" onChange={(e)=>setWantsuit(e.target.value)} defaultValue={0}>
                        <Radio value={0}  className="cf fz-med m-r-10">Random mystery box</Radio>
                        <Radio value={1}  className="cf fz-med">Kepler suit</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                   {
                     wantSuit ? (
                      <div className="flex flex-center flex-wrap m-t-20">
                         <div className="type-title c06">Gender</div>
                          <div className='flex cf flex-wrap'>
                          <Radio.Group className='my-radio' name="radiogroup"  onChange={(e)=>setGender(e.target.value)}  defaultValue={0}>
                            <Radio value={0} className="cf fz-med  m-r-10">Female</Radio>
                            <Radio value={1}  className="cf fz-med">Male</Radio>
                          </Radio.Group>
                          </div>
                       </div>
                     ):''
                   }
                   <div className="flex flex-center flex-wrap m-t-20">
                   <div className="c06 type-title">
                     Quantity
                   </div>
                   <div className="flex quantity">
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
                       <Select onChange={setSort} options={selectOptions} className={[2,4,5,7,8,9].includes(num) ?'active':''}/>
                    //  <input type="text" value={inputNum} onChange={handleInput} className='num-input fz-med cf ta'/>
                     }
                   </div>
                   </div>
                   {/* price */}
                    <div className='flex flex-column price-area p-t-20'>
                            <div className="price-title c06 flex flex-between">
                               <span className='type-title'>Price</span>
                            </div>
                            <div className='flex flex-center flex-between price'>
                              <span className='flex flex-center'>
                                <img className='eth' src={Cur[currency]} alt="" />
                                <span className='price-num cf fw500 m-l-10 m-r-10'>
                                  {price*num} {currency}
                                </span>
                                <span className="price-title c06">(${usdPrice ? toFixed(usdPrice*price*num, 4):'~'})</span>
                                <Tooltip color="#E07D26" title={
                                  <div>
                                    <div>Estimated gas fee: 25 gwei</div>
                                  </div>
                                }>
                                <img src={require('../assets/images/mint/tips.svg').default} alt="" className='m-l-5' />
                                </Tooltip>
                              </span>
                              
                            </div>
                    </div>
                   {/* price */}


                   <div className='flex flex-between flex-center m-t-10'>
                     {
                       props.account ? (
                         props.token ? (
                          status ? (
                            needApprove ? 
                            <div className="btn-area">
                            <Button loading={loading}  
                            className="mint-btn color ta cf btn w100 my-button"
                            disabled={num<=0 || (mintamount >= 9) || ((9-mintamount) < num)} 
                            onClick={toApprove}>
                            Approve {currency}
                          </Button>
                          </div>:
                          <div className="btn-area">
                            <Button loading={loading}  
                            className=" mint-btn color ta cf btn w100 my-button"
                            disabled={num<=0 || (mintamount >= 9) || ((9-mintamount) < num)} 
                            onClick={toMint}>
                            Mint ({9-mintamount})
                              </Button> 
                          </div>
                           ):(
                            <div className="btn-area">
                             <div className='flex flex-column'>
                               <Link className='cf fz-14 ta apply p-b-5 ' target="_blank" to="/nft-whitelist">Apply for whitelist</Link>
                               <Button disabled
                               loading={loading} 
                                className="mint-btn color ta cf btn w100 my-button" >
                                Not In WhiteList
                              </Button>
                             </div>
                             </div>
                           )

                         ):(
                          <div className="btn-area">
                           <Button loading={loading}  
                            className="mint-btn color ta cf btn w100 my-button"
                            disabled={num<=0 || (mintamount >= 9) || ((9-mintamount) < num)} 
                            onClick={Login}>
                            Approve your wallet
                          </Button>
                          </div>
                         )

                        


                        
                       ):(
                        <div className="btn-area">
                        <Button loading={loading}  
                          className="mint-btn color ta cf btn w100 my-button" 
                          onClick={showConnectWallet}>
                          Connect Wallet
                        </Button>
                        </div>
                       )
                     }
                    </div>
                    {
                      // props.account && signature && !needApprove ? (
                        <div className="input-area cf flex flex-column  handle-area m-t-8 p-t-5">
                          <div className="flex flex-center flex-between">
                              <span className='cf flex fz-16 flex-center'>
                                Referred by
                              <Tooltip color="#E07D26" title={
                                <div>
                                  <div>1. Recommenders can get KEPL token reward of 5% of NFT Mint amount. </div>
                                  <div>2. Different recommenders have the same address as their own white list.</div>
                                </div>
                              }>
                              <img src={require('../assets/images/mint/tips.svg').default} alt="" className='m-l-5' />
                              </Tooltip>
                              {
                                showErr ? <span className='ce m-l-10'>Wrong address!</span>:''
                              }
                              </span>
                              {
                                props.account && <a className='cf flex fz-16 flex-center apply' target="_blank" href="/profile?tab=rewards">
                                My Invite Rewards <img src={require('../assets/images/mint/share.svg').default} alt="" className='m-l-3' />
                              </a>
                              }
                              

                          </div>
                        
                        <input onChange={inputAddress} disabled={num<=0 || (mintamount >= 9) || ((9-mintamount) < num)}  type="text" className='p-15 m-t-10' placeholder="Please input the inviter's wallet address" value={referAddress}/>
                        <div className="btn-area">
                        <Tooltip color="#E07D26" title={
                                <div>
                                  <div>1. Recommenders can get KEPL token reward of 5% of NFT Mint amount. </div>
                                  <div>2. Different recommenders have the same address as their own white list.</div>
                                </div>
                              }>
                          <Button
                            className="mint-btn blue-color ta cf btn w100 my-button-blue m-t-17 flex flex-center flex-middle" 
                            onClick={copyAddress}>
                                    <img src={require('../assets/images/mint/add.svg').default} alt="" className='m-r-5'/>
                                    Invite Friend
                          </Button>
                        </Tooltip>
                        </div>
                        </div>
                        
                      // ):''
                    }
                   
              </div> 
              </div> 

              
              {/* <img src="" alt="" className='banner'/> */}

            {/* tabs   */}
            <Tabs className='my-tab mint-tab'>
              {
                TabsData.map(item => {
                    return (<TabPane tab={
                      <div className='flex flex-center'>
                        <img src={item.icon} alt="" />
                        <span className='tab-title m-l-10'>
                          {item.title}
                        </span>
                        
                      </div>
                    } key={item.title}>
                      <div className="cf tab-content m-t-10">{item.content}</div>
                    </TabPane>)
                })
              }
               
            </Tabs>
            <video height={0} src={videoSrc} id="video" playsInline loop autoPlay controls muted></video>
        
         </div>
         
         <Mintfooter />
    </div>
  )
}
);