import './Mysterybox.scss'
import Countdown from '../components/Base/Countdown'
import {Button, Checkbox} from 'antd'
import { Tabs } from 'antd';
import Share from '../components/Market/Share'
import { get, post } from '../http'
import { useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import Swipe from '../components/Base/Swipe'
import { FullChainIdName, findNameByAddress, toFixed, ChainIdMap , formatTime, findAddressByName, findNftIdByAddress} from '../lib/util';
import { getToken, getItem ,approve, allowance, close, buy, listNft,sign, getSupportedCurrencies, setApprovalForAll, isApprovedForAll} from '../contract/methods'
import store from '../store';
import {getCurAddress} from '../contract/testnet/address';
import notification from '../components/notification';
import Modal from '../components/Base/Modal'
import Input from '../components/Base/Input'
import { useTranslation} from 'react-i18next'
import {ConsoleSqlOutlined, Loading3QuartersOutlined} from '@ant-design/icons';
import { open, queryItem} from '../contract/methods/mint';
import minttext from '../lib/minttext'
import { chainSymbolMap } from '../wallet/helper/getNetworkData';
import {connect, useSelector} from 'react-redux'
import Viewer from 'react-viewer';
import { setToken, setUserInfo } from '../store';

const { TabPane } = Tabs;
const Loading = ({show, showChange}) => {
  let [showLoading, setShowLoading] = useState(false)
  
  useEffect(()=> {
    setShowLoading(show)
  }, [show])
  return (
  <Modal isVisible={showLoading} title="Canceling" onClose={() =>{showChange(false);setShowLoading(false)} }>
      <div className="w100 flex flex-center flex-middle flex-column">
        <div className="fz-16 c14">
        Please wait for us to process your request
        </div>
          <Loading3QuartersOutlined className='m-t-60 m-b-20' spin style={{fontSize: '80px', color: '#E07D26'}}/>
        <div className="fz--16 c14">
        Waiting for blockchain confirmation
        </div>
      </div>
  </Modal>
  )
}

const Success = ({show, info, showChange}) => {
  let [showSuccess, setShowSuccess] = useState(false)
  
  useEffect(()=> {
    setShowSuccess(show)
  }, [show])
  return (
  <Modal isVisible={showSuccess} title="Success" onClose={() =>{showChange(false);setShowSuccess(false)} }>
      <div className="w100 flex flex-center flex-middle flex-column">
        <div className="img-box">
          <img src={info.cover} alt="" />
          <div className="right flex flex-center flex-middle">
            <img src={require('../assets/images/base/right.svg').default} alt="" />
          </div>
        </div>
        <div className="c14 fz-14 ta p-t-12">#{info.tokenId}  </div>
        <div className="fz-20 c14 fwb m-t-30">Transaction sent</div>
        <Button  className="btn color confirm-btn ta my-button color m-t-10 ta cf btn  w100 my-button">View in browser</Button>
      </div>
  </Modal>
  )
}

const Confirm = ({show, showChange}) => {
  let [showConfirm, setShowConfirm] = useState(false)
  useEffect(()=> {
    setShowConfirm(show)
  }, [show])
  return (
  <Modal isVisible={showConfirm} title="Open Box" onClose={() =>{showChange(false);setShowConfirm(false)} }>
      <div className="w100 flex flex-center flex-middle flex-column">
        <div className="img-box p-t-30 p-b-30 p-l-50 p-r-50 flex flex-center">
           <img src={require('../assets/images/nft/mystery.png')} alt="" />
        </div>
        <div className="c14 fz-16 ta p-t-12">Waiting for wallet confirming...</div>
        
      </div>
  </Modal>
  )
}

const NftItem = ({nft,nftTokenId}) => {
   const [detail, setDetail] = useState({})
   useEffect(async ()=>{
     if(nft && nftTokenId) {
       console.log(nft)
       let result =  await get(`/api/token/${findNftIdByAddress(nft)}/${nftTokenId}`)
       console.log(result)
       setDetail(result)
     }

   }, [nft, nftTokenId])

  return (
      <div className='nft-open-item p-5 p-b-25'>
        <img src={detail.image} alt="" />
        <div className='fz-14'>
          {findNameByAddress(nft)} #{nftTokenId}
        </div>
      </div>
  )
}

const Opened = ({show, showChange, openResult}) => {
  let [showOpen, setShowOpen] = useState(false)
  useEffect(()=> {
    setShowOpen(show)
  }, [show])
  return (
  <Modal isVisible={showOpen} title="Open Result" hideclose onClose={() =>{showChange(false);setShowOpen(false)} }>
      <div className="w100 flex flex-center flex-middle flex-column">
        <div className="img-box p-t-10 p-b-20 flex flex-center flex-wrap">
           {
             openResult && openResult.nftTokenIds && openResult.nftTokenIds.split(',').map((item, idx) => {
               return <NftItem nftTokenId={item} nft={openResult.nfts.split(',')[idx]} key={idx}/>
             })
           }
        </div>
        <Link to="/mynft" className='w100'>
          <Button
          className="btn color confirm-btn ta my-button color ta cf btn  w100 my-button"
          >Return to MyNFT
          </Button>
        </Link>

        
      </div>
  </Modal>
  )
}

const Complete = ({show, showChange}) => {
  let [showComplete, setShowComplete] = useState(false)
  useEffect(()=> {
    setShowComplete(show)
  }, [show])
  return (
  <Modal isVisible={showComplete} title="NFT listed" onClose={() =>{showChange(false);setShowComplete(false)} }>
      <div className="w100 flex flex-center flex-middle flex-column">
        <div className="img-box flex flex-center">
          <img src={require('../assets/images/nft/success.svg').default}  alt="" />
        </div>
        <div className="fz-16 c14 fwb m-t-40">Your posting has been listed</div>
      </div>
  </Modal>
  )
}

const ListTable = ({show, id, showChange, onSuccess}) => {
  let { t ,i18n} = useTranslation()
  let [showListTable, setShowListTable] = useState(false)
  let [currencies, setCurrencies] = useState([])
  let [selectCurrency, setSelectCurrency] = useState('')
  let [sellPrice, setSellprice] = useState(0)
  let [isRead, setRead] = useState(false)
  let [needApprove, setNeedApprove] = useState(false)
  let [loading, setLoading] = useState(false)
  let toApprove = () => {
      setLoading (true)
      setApprovalForAll(findAddressByName('MysteryBox'), findAddressByName('NFTMarket')).then(res => {
        setNeedApprove(false)
        setLoading (false)
      }).catch(()=>{
        setLoading (false)
      })
  }
  
  let handleInput = (e) => {
    console.log(e.target.value)
    if (!/^[0-9]*[.,]?[0-9]*$/.test(e.target.value) || e.target.value.indexOf('+') >=0 || e.target.value.indexOf('-') >=0 ) {
        return
    }
    setSellprice(e.target.value)
  }
  let toList = () => {
    listNft(
      id,
      findAddressByName('MysteryBox'),
      selectCurrency,
      sellPrice
    ).then(res => {
      setShowListTable(false)
      onSuccess()
    })
  }
  useEffect(async()=> {
    setShowListTable(show)
    if(show) {
      let currencies = await getSupportedCurrencies()
      setCurrencies(currencies)
    }
  }, [show])
  useEffect(async ()=>{
    let isApprove = await isApprovedForAll(findAddressByName('MysteryBox'), findAddressByName('NFTMarket'))
    setNeedApprove(!isApprove)
  }, [])
  return (
  <Modal isVisible={showListTable} title="List for sell" onClose={() =>{showChange(false);setShowListTable(false)} }>
      <div className="w100">
         <div className="fz-14 c14">Price</div>
         <div className="currency-box flex flex-wrap">
           {
             currencies.map(item => {
               return (
                findNameByAddress(item) ?<div key={item} onClick={_=> setSelectCurrency(item)} className={'currency-item c14 fz-14 ta pointer '+(item == selectCurrency ? 'active': '')}>{findNameByAddress(item)}</div>:''
               )
             })
           }
         </div>
         <input type="text" className="m-t-10 num-input my-input p-10 fz-16" value={sellPrice} placeholder="Enter price" onChange={handleInput}/>
         <div className="fz-14 c14 m-t-30">Fee</div>
         <div className="c14 fwb fz-14 m-t-10">The marketplace will charge 0.5% of your price.</div>
         {
           selectCurrency ? (
            <div className="fee-box m-t-20">
              <div className="fee-item flex flex-between">
                <div>
                    <span className="circle"></span>
                    <span className='c8c fz-14 m-l-9'>Handling fee</span>
                </div>
                <div className="fz-14 fwb">{toFixed(sellPrice*0.05, 4)} {findNameByAddress(selectCurrency)}</div>
              </div>
              <div className="fee-item flex flex-between m-t-5">
                <div>
                    <span className="circle"></span>
                    <span className='c8c fz-14 m-l-9'>Amount to account</span>
                </div>
                <div className="fz-14 fwb">{toFixed(sellPrice*(1-0.05), 4)}</div>
              </div>
            </div>
           ):''
         }
         
         <div className="check m-t-30 m-b-30">
           <Checkbox className='my-checkbox' onChange={(e)=>setRead(e.target.checked)}>I approve Kepler marketplace Terms & Conditions</Checkbox>
         </div>
         {
           needApprove ? 
           <Button
        onClick={toApprove}
        loading={loading}
        className="btn color confirm-btn ta my-button color ta cf btn  w100 my-button"
        >Approve
        </Button>:
        <Button
        disabled={!isRead || !selectCurrency || !sellPrice}
        onClick={toList}
        className="btn color confirm-btn ta my-button color ta cf btn  w100 my-button"
        >Post your Listing
        </Button>
         }
      </div>
  </Modal>
  )
}



export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)((props)=> {
  let { t ,i18n} = useTranslation()
  let {id} = useParams()
  let [activeIndex, setActiveIndex] = useState(0)
  let [banners, setBanners] = useState([])
  let [attributes, setAttributes] = useState([])
  let [isMynft, setIsmynft] = useState(false)
  let [needApprove, setNeedApprove] = useState(false)
  let [showSuccess, setShowSuccess] = useState(false)
  let [showLoading, setShowLoading] = useState(false)
  let [showComplete, setShowComplete] = useState(false)
  let [showConfirm, setShowConfirm] = useState(false)
  let [showOpen, setShowOpen] = useState(false)
  let [showListTable, setShowListTable] = useState(false)
  let [isShow, setShow] = useState(false)
  let [loading, setLoading] = useState(false)
  let [status, setStatus] = useState(1) // status: 1: listing 2:sold 3： closed
  let [detail, setDetail] = useState({
    banners,
    order: {},
    metaData: {}
  })
  let [mysteryDetail, setMysteryDetail] = useState({})
  let [openResult, setOpenResult] = useState({})
  let checkNeedApprove = async (currency) => {
    if(!store.getState().account) { // no connect wallet
      return
    }
    let allow = await allowance(currency, getCurAddress().NFTMarket).call()
    setNeedApprove(allow < 10) 
  }
  let toShowListTable = () => {
    setShowListTable(true)
  }
  
  const toLogin = async() => {
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
    approve(detail.order.currencyAddress, getCurAddress().NFTMarket).then(res => {
      setNeedApprove(false)
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }
  let toOpen = () => {
    post('/api/box/open', {
      chainId: ChainIdMap[localStorage.getItem('kepler_chain')||'ETH'],
      boxId: id
    }).then(res => {
      setOpenResult(res.data)
      open(
        id,
        res.data.nfts,
        res.data.nftTokenIds,
        res.data.deadline,
        res.data.signature
      ).then(res => {
        setShowConfirm(false)
        setShowOpen(true)
      }).catch(err => {
        setShowConfirm(false)
      })
    })
    setShowConfirm(true)
  }
  useEffect(async ()=>{
    let detail  = await queryItem(id)
    console.log(detail)
    setMysteryDetail(detail)
  }, [id])
  return (
    <div >
    <div className="nft-detail w100 p-t-100 p-l-40 p-b-60 p-r-40">
        <div className="flex flex-center flex-between">
          <div className="bread cf fz-16">
              <Link className='pointer' to="/mynft">My NFT /  </Link>
              <span className='ce'>NFT Details</span>
          </div>
          <Button className='blue-btn' onClick={() => {window.history.go(-1)}}>Return</Button>
        </div>
        
        <div className="flex flex-start m-t-40">
           <div className="nft-cover">
             
               <div className="cover m-b-20">
               {/* <model-viewer autoplay camera-controls alt="123" src={require('./scene.glb')}></model-viewer> */}
                <img src={require('../assets/images/nft/cover.png')} alt="" />
               </div>
               {/* <Swipe images={banners} onChange={activeChange}></Swipe> */}
               <div className="fz-14 c56 m-t-20">Contract address</div>
               <div className="fz-14 cf m-t-6 fwb">
               <a className=' m-l-5 flex islink'  target="_blank" href={`${chainSymbolMap[props.chain]().params.blockExplorerUrls[0]}/token/${findAddressByName('MysteryBox')}?a=${id}`}>
               {findAddressByName('MysteryBox')}
                 <img width={14} className=' m-l-5' src={require('../assets/images/base/fenxiang.svg').default} alt="" />
                </a>
                 </div>
               <div className="fz-14 c56 m-t-20">Issue date</div>
               <div className="fz-14 cf m-t-6 fwb">{formatTime(mysteryDetail.mintTime||0)}</div>
               
               {/* <div className="fz-14 c56 m-t-20">Blockchain</div>
               <div className="fz-14 cf m-t-6 fwb">{FullChainIdName[detail.order.chainId]}</div>
               
               <div className="fz-14 c56 m-t-20">Token Standard</div>
               <div className="fz-14 cf m-t-6 fwb">ERC721</div> */}
           </div>
           <div className="flex-1 m-l-50">
               <div className="fz-18 cf flex flex-between">
                 <span className='flex'># {id} </span>
                 {/* <Share info={{...detail.order, favorite: detail.favorite}} showFav={false}/> */}
               </div>
               <div className="fz-32 fwb cf m-b-20">Kepler suits</div>
               
               <div className="flex">
                 <img src={require('../assets/images/nft/person.svg').default} alt="" />
                 <div className="flex flex-column m-l-16">
                    <span className="c56 fz-18">Referral</span>
                    <span className='cf fz-14'>{mysteryDetail.referral}</span>

                 </div>
               </div>
               <div className={"fz-16 fwb c56 m-t-40 "+(isShow ? 'show':'hide')}>
                {minttext['sales description']}               
              </div>
               <div className="fz-14 cf flex flex-center m-t-10 pointer" onClick={()=>setShow(!isShow)}>
                 {isShow?'Hide':'Read More'}
                 <img className={'m-l-4 ' +(isShow ? 'show-icon':'hide-icon') } src={require('../assets/images/base/arrow-bottom.svg').default}/>
               </div>
              <div className='flex'>
                
                {
                  props.token ? 
                    <>
                      <Button className="buy-btn my-button cf fz-24 fwb ta m-t-30 pointer"
                      onClick={toOpen}
                      loading={loading}
                      >
                      Open box
                      </Button>
                      <Button className="list-btn m-l-20 cf fz-24 fwb ta m-t-30 pointer"
                      onClick={toShowListTable}
                      loading={loading}
                      >
                        <p className="list-text">
                        List for sell
                        </p>
                      </Button>
                    </>:
                  <Button className="buy-btn my-button cf fz-24 fwb ta m-t-30 pointer"
                  onClick={toLogin}
                  loading={loading}
                  >
                  Approve your wallet
                  </Button>
                }
                

              </div>
           </div>
        </div>
    </div>
    <Success show={showSuccess} showChange={setShowSuccess} info={{cover: banners.length ?banners[0]:'', tokenId: detail.order.tokenId}}/>
    <Confirm show={showConfirm} showChange={setShowConfirm} info={{cover: banners.length ?banners[0]:'', order: detail.order}}/>
    <Loading show={showLoading} showChange={setShowLoading}/>
    <ListTable show={showListTable} showChange={setShowListTable} onSuccess={()=>setShowComplete(true)} id={id}/>
    <Complete show={showComplete} showChange={setShowComplete}/>
    <Opened show={showOpen} showChange={setShowOpen} openResult={openResult}/>
    </div>
  )
})