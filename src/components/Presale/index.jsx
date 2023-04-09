
import './index.scss'
import Select from './Select'
import BUSD from '../../assets/images/token/BUSD.svg'
import USDT from '../../assets/images/token/USDT.svg'
import USDC from '../../assets/images/token/USDC.svg'
import CAKE from '../../assets/images/token/CAKE.svg'
import BNB from '../../assets/images/token/BNB.svg'
import ETH from '../../assets/images/token/ETH.svg'
import Tangle from '../../assets/images/base/tangle.svg'

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useLocation } from 'react-router-dom'

import { useCallback, useState } from 'react'
import {Button, InputNumber, Skeleton, Tooltip } from 'antd'
import { useEffect } from 'react'
import { balanceOf, buy, getPrice, queryConfig, queryRoundPrices, querySaledUsdAmount, queryStableCoins } from '../../contract/methods/presale'
import { addPoint, ChainIdMap, findAddressByName, findNameByAddress, formatTime, formatTimeShort, fromUnit, numFormat, showConnectWallet, toFixed, toUnit, toWei, ZERO_ADDRESS } from '../../lib/util'
import { connect } from 'react-redux'
import { getCurAddress } from '../../contract/testnet/address'
import { allowance, approve, sign } from '../../contract/methods'
import { formatTimeStr } from 'antd/lib/statistic/utils'
import Modal from '../../components/Base/Modal'
import notification from '../notification'
import { useRef } from 'react'
import { get, post } from '../../http'
import { setToken } from '../../store'

let marks = {
    12: {
      label: '1Y'
    },
    24: {
      label: '2Y'
    },
    36: {
      label: '3Y'
    },
    48: {
      label: '4Y'
    },
    60: {
      label: '5Y'
    }
  }
let displayMoths = [
    {
        name: '1 year',
        value: 12
    },
    {
        name: '18 months',
        value: 18
    },
    {
        name: '2 years',
        value: 24
    },
    {
        name: '3 years',
        value: 36
    },
    {
        name: '4 years',
        value: 48
    },
    {
        name: '5 years',
        value: 60
    }
]

let iconMap = {
    'USDT': USDT,
    'USDC': USDC,
    'ETH': ETH,
}
let extraDecimal = {
    'USDT': 0,
    'USDC': 0,
    'ETH': 0.01,
}

let decimal = {
    'USDT': 18,
    'USDC': 18,
    'ETH': 18,
}
// let decimal = { // main
//     'USDT': 6,
//     'USDC': 6,
//     'ETH': 18,
// }
let selectOptions = (currentList)=> {
    let arr = []
    currentList.map(item => {
        arr.push({
            label:<span className='options-item flex flex-center'><img className='token-icon m-r-5' src={item.icon} alt="" />{item.name}</span>,
            value: item.name
        })
    })
    return arr
}
const ChooseToken = (props) => {
    let [percent , setPercent] = useState(0)
    let [currentList, setCurrentList] = useState([])
    let [balance, setBalance] = useState(0)
    let [selectCur, setSelectCur] = useState('USDC')
    let [inputNum, setInputNum] = useState('')
    let [price, setPrice] = useState(1)
    let timer = useRef()
    const currencyChange = async (e) => {
        console.log(e)
        setSelectCur(e)
        props.curChange(e)
        if(props.account) {
            try {
                let bal = await balanceOf(findAddressByName(e), props.account)
                console.log(bal)
                setBalance(fromUnit(bal, decimal[e]))
            } catch (err) {
            }
        }
    }
    // const polling = () => {
    //     timer.current && clearInterval(timer.current)
    //     timer.current = setInterval(() => {
    //         console.log(selectCur)
    //         console.log(props.refresh)
    //         currencyChange(selectCur)
    //     }, 20000)
    //   }
    // useEffect(() => {
    //     polling()
    //     return () => clearInterval(timer.current)
    // }, [])
    const handleSetAmount = (value) => {
        if (value === '') {
            setInputNum(value)
          return
        }
        if (!(/^\d+((\.\d+)?|(\.))$/.test(value))) {
          return
        }
        if (value.split('.').length > 1 && value.split('.')[1].length > 3) {
          return
        }
        if (value < 0) {
          return
        }
        setInputNum(value)
      }
    useEffect(async () => {
        let currencies = await queryStableCoins()
        let list = []
        console.log(currencies)
        currencies.map((item, index) => {
            list.push({
                icon: iconMap[findNameByAddress(item)],
                name: findNameByAddress(item)
            })
            if(index==0) {
                list.push({
                    icon: ETH,
                    name: 'ETH'
                })
            }
        })
        // list.push({
        //     icon: CAKE,
        //     name: 'CAKE'
        // })
        setCurrentList(list)
        currencyChange(selectCur)
    }, [props.account])

    useEffect(()=>{
        props.onChange(inputNum)
    }, [inputNum])

    useEffect(() => {
        setInputNum('')
        setPercent(0)
        setSelectCur(selectCur)
        currencyChange(selectCur)
    }, [props.refresh])

    useEffect(()=>{
        if(props.account) {
            balance*percent > 0 ? setInputNum(toFixed(balance*percent/100, 3)||''):setInputNum('')
        } else {
            setInputNum('')
        }
    }, [percent, balance])
    return  (
        <div className="choose w100">
            <div className='choose-token flex flex-column p-l-24 p-r-16'>
                <div className="left-item flex flex-center">
                   <span className='c06 fz-14 m-b-9 flex-1 m-t-11'>Available:{props.account ? (balance ? toFixed(Number(balance), 3):0):'--'}</span>
                   <div className="percent flex flex-between m-t-11">
                        <div className={"pointer fz-14 percent-item ta c06 "+(percent == 25 ? 'active':'')} onClick={()=> {setPercent(25)}}>
                            25%
                        </div>
                        <div className={"pointer fz-14 percent-item ta c06 "+(percent == 50 ? 'active':'')}  onClick={()=> {setPercent(50)}}>
                            50%
                        </div>
                        <div className={"pointer fz-14 percent-item ta c06 "+(percent == 75 ? 'active':'')}  onClick={()=> {setPercent(75)}}>
                            75%
                        </div>
                        <div className={"pointer fz-14 percent-item ta c06 "+(percent == 100 ? 'active':'')}  onClick={()=> {setPercent(100)}}>
                            MAX
                        </div>
                    </div>
                   
                </div>
               
                <div className="right-item flex flex-center flex-between">
                    <input type="text" className='number-input fz-32 fwb c06' placeholder='0' value={inputNum} onChange={(e) => handleSetAmount(e.target.value)}/>
                    <div className="select-box flex flex-end">
                        <Select options={selectOptions(currentList)} onChange={currencyChange}/>
                    </div>
                    
                </div>
            </div>
            

        </div>
    )
}



export default connect(
    (state, props) => {
      return {...state, ...props}
    }
  )( (props)=> {
    let location = useLocation()
    let [selectMonths, setSelectMonths] = useState(12)
    let [showMonths, setShowMonths] = useState(false)
    let [config, setConfig] = useState({})
    let [rounds, setRounds] = useState(1)
    let [progress, setProgress] = useState(0)
    let [price, setPrice] = useState(0)
    let [tokenPrice, setTokenPrice] = useState(1)
    let [inputNum, setInputNum] = useState('')
    let [cur, setCur] = useState('USDC')
    let [needApprove, setNeedApprove] = useState(false)
    let [loading, setLoading] = useState(false)
    let [isLoading, setIsLoading] = useState(false)
    let [refresh, setRefresh] = useState(0)
    let [isCheck, setIsCheck] = useState(false)
    let [showTip, setShowTip] = useState(false)
    let [signature, setSignature] = useState('')
    let [claimStart, setClaimStart] = useState(new Date().getTime()/1000)
    let [isLogin, setIsLogin] = useState(false)
    let [referAddress, setAddress] = useState(location.search ? location.search.replace('?','').split('=')[1]?.toLowerCase():'')
    let [endDate, setEndDate] = useState(new Date(new Date(claimStart*1000).getFullYear(), new Date(claimStart*1000).getMonth()*1+60, new Date(claimStart*1000).getDate()))
    const numChange = (num) => {
        console.log(num)
        setInputNum(num)
    }

  const Login = async() => {
    let signature = await sign('login')
    post('/api/account/connect', {
      chainId: ChainIdMap[localStorage.getItem('kepler_chain')||'Arbitrum'],
      user: props.account,
      signature
    }).then(res => {
      props.dispatch(setToken(res.data.token))
      localStorage.setItem(props.account, res.data.token)
      setIsLogin(true)
    }).catch(err => {
      notification.error({
        message: ('Login Fail'),
        description: ('Something goes wrong')
    });
    })
  }
    const curChange = useCallback( async (name) => {
           console.log(name)
        setCur(name)
        if(props.account) {
            console.log(cur)
            let allow = name == 'ETH' ? 1: await allowance(findAddressByName(name), getCurAddress().Presale).call()
            console.log(allow)
            setNeedApprove(allow <= 0 )
            // setNeedApprove(false )
          }
          if(['ETH'].includes(name)) {
            let prices = await getPrice(findAddressByName(name))
            setTokenPrice(fromUnit(prices))
            console.log(fromUnit(prices))
        } else {
            setTokenPrice(1)
        }
    }, [props.account])
    const toBuy = () => {
        setLoading(true)
        console.log(cur)
        console.log(decimal[cur])
        console.log(toWei(Number(inputNum).toString(), decimal[cur]))
       buy(findAddressByName(cur),toWei(Number(inputNum).toString(), decimal[cur]), (referAddress && referAddress.toLowerCase() != props.account)?referAddress:ZERO_ADDRESS, signature).then(res => {
        setLoading(false)
        setRefresh(refresh+1)
        setShowTip(true)
        props.onSuccess()
       }).catch(err=>{
        setLoading(false)
       })
    }
    
    let toApprove = () => {
        setLoading(true)
        approve(findAddressByName(cur), getCurAddress().Presale).then(res => {
        setNeedApprove(false)
        setLoading(false)
        }).catch(err => {
        setLoading(false)
        })
    }
    const copyAddress = useCallback(async () => {
        if(!props.account) {
          notification.error({
              message: ('Please connect your wallet first')
            });
            return
         }
        await navigator.clipboard.writeText('https://'+window.location.host+'?referee='+props.account);
        notification.success({
          message: ('The invitation link has been copied. Please paste it to your friends!'),
        });
      }, [props.account]);
    useEffect(() => {
        setEndDate(new Date(new Date(claimStart*1000).getFullYear(), new Date(claimStart*1000).getMonth()*1+selectMonths, new Date(claimStart*1000).getDate()))
    }, [selectMonths, claimStart])
    useEffect(async() => {
        setIsLoading(true)
        let saledUsd = await querySaledUsdAmount()
        let config = await queryConfig()
        let prices = await queryRoundPrices()
        let curentRounds = Math.floor(fromUnit(saledUsd)/fromUnit(config.saleAmountPerRound))
        setConfig(config)
        console.log(config)
        setClaimStart(config.claimStartTime)
        setRounds(curentRounds*1+1)
        setPrice(fromUnit(prices[curentRounds]))
        setSelectMonths(12)
        setShowMonths(false)
        setProgress((fromUnit(saledUsd)%fromUnit(config.saleAmountPerRound))*100/fromUnit(config.saleAmountPerRound))
        setIsLoading(false)
    }, [refresh])
    useEffect(async() => {
        setIsLogin(false)
        if(props.account && !localStorage.getItem(props.account)) {
            Login()
        } else {
            setIsLogin(true)
        }
        if(props.account) {
            try {
                let {data: {signature}} = await get('/api/evm/presale/buyParams', {
                    contract: findAddressByName('Presale'),
                    account: props.account
                })
                console.log(signature)
                setSignature(signature)
            } catch {
                setSignature('')
            }
            
        }
    }, [props.account])
    return (
        <div className="private-box cf">
             <div className="fz-24 fwb p-l-24 p-r-24">KEPL Presale</div>
             <div className="flex flex-between w100 fz-16 m-t-30  p-l-24 p-r-24">
                <span>Presale Progress</span>
                <span className='c80'>Round <span className='cf'>{rounds}/10</span></span>
             </div>
             <div className=' p-l-24 p-r-24 w100'>
                <div className="progress flex flex-start w100 m-t-12">
                    <div className="progress-inner bgblue" style={{width: progress+'%'}}></div>
                    <Tooltip title={(progress*fromUnit(config?.saleAmountPerRound)/100).toFixed(2)+'/'+fromUnit(config?.saleAmountPerRound)}><div className="star"></div></Tooltip>
                    
                </div>
             </div>
             <div className="flex flex-between m-t-25  p-l-24 p-r-24">
                <span className='c06'>Current KEPL price</span>
                <span className='cf flex flex-center'>
                    <img src={require('../../assets/images/token/KEPL.png')} className="token-logo m-r-5" alt="" />
                    {
                        isLoading ? <Skeleton.Button active={true} size='small' shape='default' block={false} />: <span>${Number(price).toFixed(6)}</span>
                    }
                    </span>
                    
             </div>
             
             <div className="flex flex-between m-t-12  p-l-24 p-r-24 min-max">
                <span className='c06 flex min-max-inner'><span>Min buyable: </span>    
                {isLoading ? <Skeleton.Button active={true} size='small' shape='default' block={false} />: <span className='cf m-l-3'>{numFormat(toFixed(fromUnit(config.minBuyAmount/tokenPrice),2)*1+extraDecimal[cur])} {cur}</span>}
                </span>
                <span className='c06 flex min-max-inner'><span>Max buyable: </span>  
                {isLoading ? <Skeleton.Button active={true} size='small' shape='default' block={false} />: <span className='cf m-l-3'>{numFormat(toFixed(fromUnit(config.maxBuyAmount/tokenPrice),2)*1)} {cur}</span>}
                </span>
             </div>
             <div className="hr w100 m-t-24"></div>
             {/* choose-token */}
             <div className={"w100 p-24 " +(loading?'unable':'')}>
              <ChooseToken {...props} onChange={numChange} refresh={refresh} curChange={curChange}/>
             </div>
             {/* choose-token */}
             {/* <div className="p-l-24 p-t-10 flex flex-center pointer" onClick={()=>setIsCheck(!isCheck)}>  
                <div className={"checkbox  "+ (isCheck ?'active':'')} >
                    <img src={require('../../assets/images/private/yes.svg').default} alt="" />
                </div>
                <span className='fz-16 cf m-l-11 flex flex-center'>
                    <span style={{color: 'red', top: '3px', position: 'relative'}}>*&nbsp;</span>
                    Choose release period</span>
             </div> */}
             {
                isCheck && (
                   <>
                   <div className={"p-l-24 p-r-24 p-t-10 flex flex-center w100 "+(loading?'unable':'')}>  
                <div className="release-cycle w100">
                    <div className="cycle-inner p-t-12 p-l-16 p-b-12 p-r-16">
                        <div className="flex flex-between cycle">
                            <span className='fz-14 ce flex flex-center'>
                            Release in batches
                                <Tooltip title="The longer KEPL tokens are locked for, the more dividends received.">
                                  <img className='m-l-3' src={require('../../assets/images/passport/question.svg').default} alt="" />
                                </Tooltip>
                               
                            </span>
                            <span className='fz-14 c06'>until {formatTimeShort(endDate.getTime())}</span>
                        </div>
                        <div className="flex flex-between m-t-9 flex-center">
                            <span className='month-input fz-20'>
                              <InputNumber controls={
                                {
                                    downIcon: <span> <img src={Tangle} alt="" className='input-icon' /></span>,
                                    upIcon: <span> <img src={Tangle} alt="" className='rotate input-icon'/></span>
                                }
                              } className='month-input fz-20' min={12} max={60} defaultValue={12} value={selectMonths} onChange={setSelectMonths}/> Months
                            </span>
                            <div className="choose-btn fz-16 ta flex-middle flex flex-center pointer" onClick={()=>setShowMonths(!showMonths)}>
                                {showMonths ?'Hide':'Choose'} preset
                                <img src={Tangle} className="m-l-12" alt="" />
                            </div>
                        </div>
                    </div>
                    {
                        showMonths && <div className="months flex flex-wrap flex-between p-l-10 p-r-10 p-b-10">
                        {
                            displayMoths.reverse().map(item => {
                                return <div className={"month-item pointer " +(item.value == selectMonths ? 'active':'')} onClick={() => {setSelectMonths(item.value)}}>
                               {item.name}
                            </div>
                            })
                        }
                        
                    </div>
                    }
                    
             </div>
             </div>
             <div className={"p-l-46 p-r-46 p-t-24 p-b-24 "+(loading?'unable':'')}>
                <Slider className="rcslider" marks={marks} min={12} max={60} onChange={setSelectMonths} value={selectMonths} defaultValue={selectMonths}/>
             </div>
                   
                   </>
                )
             }
             {
                !signature && <div className='c06 ta fz-14'>You're not in whitelist <a><u className='cblue'>Apply for whitelist</u></a></div>
             }
             <div className="p-l-24 p-r-24 p-t-5 p-b-10">
                {
                    needApprove ? <Button className='w100 submit-btn cf fz-20' disabled={!signature} loading={loading} onClick={toApprove}>
                    Approve {cur}
                  </Button>:(
                    props.account ? (
                        isLogin ? <Button className='w100 submit-btn cf fz-20' loading={loading} onClick={toBuy} disabled={inputNum*tokenPrice < fromUnit(config.minBuyAmount)*1 || inputNum*tokenPrice > fromUnit(config.maxBuyAmount)*1 || !signature}>
                        {
                           inputNum*tokenPrice < fromUnit(config.minBuyAmount)*1 ? (
                            inputNum == 0 ? 'Please input your amount':'Amount is too small'
                           ):(
                            inputNum * tokenPrice > fromUnit(config.maxBuyAmount)*1 ? (
                            'Amount is too large'
                            ):'Submit KEPL PreSale'
                           )
                        }
                        </Button>: <Button className='w100 submit-btn cf fz-20' loading={loading} onClick={Login}>
                        Approve your wallet
                    </Button>
                    )
                    :
                    <Button className='w100 submit-btn cf fz-20' loading={loading} onClick={showConnectWallet}>
                        Connect Wallet
                    </Button>
                  )
                  
                }
             </div>
             {
                (referAddress && referAddress.toLowerCase() != props.account.toLowerCase()) && <div className='ta cd fz-14'>
                Inviter: <Tooltip title={referAddress}><u>{addPoint(referAddress)}</u></Tooltip>
             </div>
             }
             
             
             <Modal isVisible={showTip} onClose={() => {setShowTip(false)}}  title="Successful Presale">
                    <div className="flex flex-center flex-column fz-20 fwb">
                       <img src={require('../../assets/images/private/right.svg').default} alt="" width={100}/>
                        <span className='m-t-10'>Congratulations!</span> 
                    </div>
                    <div className="fz-16 m-t-10">
                    Congratulations on participating in the pre-sale! <br/>
                    veKEPL with same quantity as KEPL has been immediately transferred to your account;<br/>
                    When claiming begins,<br/>
                    You need to burn veKEPL in exchange for KEPL every month;<br/>
                    Invite your friends to join us!
                    </div>
                    <div className="w100 flex flex-middle m-t-24">
                        <Button className='bgblue cf bottom-btn pay-btn-inner fwb fz-20' onClick={copyAddress}>Invite</Button>
                    </div>
            </Modal>
        </div>
    )
})