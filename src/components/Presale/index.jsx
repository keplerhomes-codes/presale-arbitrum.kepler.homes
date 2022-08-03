
import './index.scss'
import Select from './Select'
import BUSD from '../../assets/images/token/BUSD.svg'
import USDT from '../../assets/images/token/USDT.svg'
import USDC from '../../assets/images/token/USDC.svg'
import Tangle from '../../assets/images/base/tangle.svg'

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useLocation } from 'react-router-dom'

import { useCallback, useState } from 'react'
import {Button, InputNumber, Tooltip } from 'antd'
import { useEffect } from 'react'
import { balanceOf, buy, queryConfig, queryRoundPrices, querySaledUsdAmount, queryStableCoins } from '../../contract/methods/presale'
import { addPoint, findAddressByName, findNameByAddress, formatTime, formatTimeShort, fromUnit, numFormat, showConnectWallet, toFixed, toUnit, toWei, ZERO_ADDRESS } from '../../lib/util'
import { connect } from 'react-redux'
import { getCurAddress } from '../../contract/testnet/address'
import { allowance, approve } from '../../contract/methods'
import { formatTimeStr } from 'antd/lib/statistic/utils'
import Modal from '../../components/Base/Modal'
import notification from '../notification'

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
    'BUSD': BUSD,
    'USDT': USDT,
    'USDC': USDC,
}

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
    let [selectCur, setSelectCur] = useState('BUSD')
    let [inputNum, setInputNum] = useState('')
    const currencyChange = async (e) => {
        setSelectCur(e)
        props.curChange(e)
        if(props.account) {
            let bal = await balanceOf(findAddressByName(e), props.account)
            setBalance(fromUnit(bal))
        }
    }
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
        currencies.map(item => {
            list.push({
                icon: iconMap[findNameByAddress(item)],
                name: findNameByAddress(item)
            })
        })
        setCurrentList(list)
        currencyChange(selectCur)
    }, [props.account])

    useEffect(()=>{
        props.onChange(inputNum)
    }, [inputNum])

    useEffect(() => {
        setInputNum('')
        setPercent(0)
        setSelectCur('BUSD')
        currencyChange('BUSD')
    }, [props.refresh])

    useEffect(()=>{
        if(props.account) {
            setInputNum(toFixed(balance*percent/100, 3)||'')
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
                        <Select options={selectOptions(currentList)}  onChange={currencyChange}/>
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
    let [inputNum, setInputNum] = useState(0)
    let [cur, setCur] = useState('BUSD')
    let [needApprove, setNeedApprove] = useState(false)
    let [loading, setLoading] = useState(false)
    let [refresh, setRefresh] = useState(0)
    let [isCheck, setIsCheck] = useState(false)
    let [showTip, setShowTip] = useState(false)
    
    let [referAddress, setAddress] = useState(location.search ? location.search.replace('?','').split('=')[1]?.toLowerCase():'')
    let [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth()*1+12, new Date().getDate()))
    const numChange = (num) => {
        console.log(num)
        setInputNum(num)
    }
    const curChange = async (name) => {
        setCur(name)
        if(props.account) {
            console.log(cur)
            let allow = await allowance(findAddressByName(name), getCurAddress().Presale).call()
            console.log(allow)
            setNeedApprove(allow <= 0 )
          }
    }
    const toBuy = () => {
        setLoading(true)
       buy(findAddressByName(cur),toWei(Number(inputNum).toString()), selectMonths, (referAddress && referAddress.toLowerCase() != props.account)?referAddress:ZERO_ADDRESS).then(res => {
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
        setEndDate(new Date(new Date().getFullYear(), new Date().getMonth()*1+selectMonths, new Date().getDate()))
    }, [selectMonths])
    useEffect(async() => {
        let saledUsd = await querySaledUsdAmount()
        let config = await queryConfig()
        let prices = await queryRoundPrices()
        let curentRounds = Math.floor(fromUnit(saledUsd)/fromUnit(config.saleAmountPerRound))
        setConfig(config)
        setRounds(curentRounds*1+1)
        setPrice(fromUnit(prices[curentRounds]))
        setSelectMonths(12)
        setShowMonths(false)
        setProgress((fromUnit(saledUsd)%fromUnit(config.saleAmountPerRound))*100/fromUnit(config.saleAmountPerRound))
    }, [refresh])
    return (
        <div className="private-box cf">
             <div className="fz-24 fwb p-l-24 p-r-24">KEPL Presale</div>
             <div className="flex flex-between w100 fz-16 m-t-30  p-l-24 p-r-24">
                <span>PreSale Progress</span>
                <span className='c80'>Round <span className='cf'>{rounds}/10</span></span>
             </div>
             <div className=' p-l-24 p-r-24 w100'>
                <div className="progress flex flex-start w100 m-t-12">
                    <div className="progress-inner bgblue" style={{width: progress+'%'}}></div>
                    <Tooltip title={(progress*1000).toFixed(2)+'/'+100000}><div className="star"></div></Tooltip>
                    
                </div>
             </div>
             <div className="flex flex-between m-t-25  p-l-24 p-r-24">
                <span className='c06'>Current KEPL price</span>
                <span className='cf flex flex-center'>
                    <img src={require('../../assets/images/token/KEPL.png')} className="token-logo m-r-5" alt="" />
                    ${Number(price).toFixed(6)}</span>
             </div>
             
             <div className="flex flex-between m-t-12  p-l-24 p-r-24 min-max">
                <span className='c06 flex min-max-inner'><span>Min buyable: </span>    <span className='cf m-l-3'>{numFormat(fromUnit(config.minBuyAmount))} USD</span></span>
                <span className='c06 flex min-max-inner'><span>Max buyable: </span>  <span className='cf m-l-3'>{numFormat(fromUnit(config.maxBuyAmount))} USD</span></span>
             </div>
             <div className="hr w100 m-t-24"></div>
             {/* choose-token */}
             <div className="w100 p-24">
              <ChooseToken {...props} onChange={numChange} refresh={refresh} curChange={curChange}/>
             </div>
             {/* choose-token */}
             <div className="p-l-24 p-t-10 flex flex-center pointer" onClick={()=>setIsCheck(!isCheck)}>  
                <div className={"checkbox  "+ (isCheck ?'active':'')} >
                    <img src={require('../../assets/images/private/yes.svg').default} alt="" />
                </div>
                <span className='fz-16 cf m-l-11'>Select the locking period</span>
             </div>
             {
                isCheck && (
                   <>
                   <div className="p-l-24 p-r-24 p-t-10 flex flex-center w100">  
                <div className="release-cycle w100">
                    <div className="cycle-inner p-t-12 p-l-16 p-b-12 p-r-16">
                        <div className="flex flex-between cycle">
                            <span className='fz-14 ce flex flex-center'>
                            Locking period
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
                              } className='month-input fz-20' min={6} max={60} defaultValue={6} value={selectMonths} onChange={setSelectMonths}/> Months
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
                            displayMoths.map(item => {
                                return <div className={"month-item pointer " +(item.value == selectMonths ? 'active':'')} onClick={() => {setSelectMonths(item.value)}}>
                               {item.name}
                            </div>
                            })
                        }
                        
                    </div>
                    }
                    
             </div>
             </div>
             <div className="p-l-46 p-r-46 p-t-24 p-b-24">
                <Slider className="rcslider" marks={marks} min={12} max={60} onChange={setSelectMonths} value={selectMonths} defaultValue={selectMonths}/>
             </div>
                   
                   </>
                )
             }
             
             <div className="p-l-24 p-r-24 p-t-24 p-b-10">
                {
                    needApprove ? <Button className='w100 submit-btn cf fz-20' loading={loading} onClick={toApprove}>
                    Approve {cur}
                  </Button>:(
                    props.account ?
                    <Button className='w100 submit-btn cf fz-20' loading={loading} onClick={toBuy} disabled={inputNum < 2000 || inputNum > 100000}>
                    {
                       inputNum < 2000 ? (
                        inputNum == 0 ? 'Please input your amount':'Amount is too small'
                       ):(
                        inputNum > 100000 ? (
                        'Amount is too large'
                        ):'Submit KEPL PreSale'
                       )
                    }
                    </Button>:
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