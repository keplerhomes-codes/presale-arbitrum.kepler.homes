import './NFT.scss'
import Countdown from '../components/Base/Countdown'
import {Button, Checkbox} from 'antd'
import { Tabs } from 'antd';
import Share from '../components/Market/Share'
import { get } from '../http'
import { useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import Swipe from '../components/Base/Swipe'
import { FullChainIdName, findNameByAddress, toFixed, addPoint } from '../lib/util';
import { getToken, getItem ,approve, allowance, close, buy, listNft, getSupportedCurrencies, setApprovalForAll} from '../contract/methods'
import store from '../store';
import {getCurAddress} from '../contract/testnet/address';
import notification from '../components/notification';
import Modal from '../components/Base/Modal'
import Input from '../components/Base/Input'
import { useTranslation} from 'react-i18next'
import {Loading3QuartersOutlined} from '@ant-design/icons';
import Viewer from 'react-viewer';

const { TabPane } = Tabs;
const Loading = ({show, showChange}) => {
  let { t ,i18n} = useTranslation()
  let [showLoading, setShowLoading] = useState(false)
  
  useEffect(()=> {
    setShowLoading(show)
  }, [show])
  return (
  <Modal isVisible={showLoading} title="Canceling" onClose={() =>{showChange(false);setShowLoading(false)} }>
      <div className="w100 flex flex-center flex-middle flex-column">
        <div className="fz-med c14">
          {t('Please wait for us to process your request')}
        
        </div>
          <Loading3QuartersOutlined className='m-t-60 m-b-20' spin style={{fontSize: '80px', color: '#E07D26'}}/>
        <div className="fz--16 c14">
        {t('Waiting for blockchain confirmation')}
        </div>
      </div>
  </Modal>
  )
}

const Success = ({show, info, showChange}) => {
  let [showSuccess, setShowSuccess] = useState(false)
  let { t ,i18n} = useTranslation()
  
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
        <div className="c14 fz-mini ta p-t-12">#{info.tokenId}  </div>
        <div className="fz-20 c14 fwb m-t-30">{t('Transaction sent')}</div>
        <Button  className="btn color confirm-btn ta my-button color m-t-10 ta cf btn  w100 my-button">{t('View in browser')}</Button>
      </div>
  </Modal>
  )
}

const Confirm = ({show, info, showChange}) => {
  let { t ,i18n} = useTranslation()

  let [showConfirm, setShowConfirm] = useState(false)
  useEffect(()=> {
    setShowConfirm(show)
  }, [show])
  return (
  <Modal isVisible={showConfirm} title={t("Completing trade for ") + (info.order.tradeAmount)+' '+(findNameByAddress(info.order.currencyAddress))} onClose={() =>{showChange(false);setShowConfirm(false)} }>
      <div className="w100 flex flex-center flex-middle flex-column">
        <div className="img-box flex flex-center">
          <img src={require('../assets/images/nft/confirm.svg').default} alt="" />
          <div className="color-line">
            <div className="white-line"></div>
          </div>
          <img src={info.cover} className="cover" alt="" />
          <div className="color-line">
            <div className="white-line"></div>
          </div>
          <img src={require('../assets/images/nft/share.svg').default} alt="" />
        </div>
        <div className="c14 fz-mini ta p-t-12">#{info.order.tokenId}</div>
        <div className="fz-20 c14 fwb m-t-60">{t("Awaiting confirmation")}</div>
        <div className="fz-mini c14">{t("Please confirm this transaction in your wallet")}</div>
      </div>
  </Modal>
  )
}

const Complete = ({show, showChange}) => {
  let { t ,i18n} = useTranslation()
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
        <div className="fz-med c14 fwb m-t-40">{t("Your posting has been listed")}</div>
      </div>
  </Modal>
  )
}

const ListTable = ({show, info, showChange, onSuccess}) => {
  let { t ,i18n} = useTranslation()
  let [showListTable, setShowListTable] = useState(false)
  let [currencies, setCurrencies] = useState([])
  let [selectCurrency, setSelectCurrency] = useState('')
  let [sellPrice, setSellprice] = useState(0)
  let [isRead, setRead] = useState(false)
  let toList = () => {
    listNft(
      info.tokenId,
      info.contractAddress,
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
  return (
  <Modal isVisible={showListTable} title="List for sell" onClose={() =>{showChange(false);setShowListTable(false)} }>
      <div className="w100">
         <div className="fz-mini c14">{t("Price")}</div>
         <div className="currency-box flex flex-wrap">
           {
             currencies.map(item => {
               return (
                findNameByAddress(item) ?<div onClick={_=> setSelectCurrency(item)} className={'currency-item c14 fz-14 ta pointer '+(item == selectCurrency ? 'active': '')}>{findNameByAddress(item)}</div>:''
               )
             })
           }
         </div>
         <Input type="number" className="m-t-10" placeholder="Enter price" onChange={(e)=>setSellprice(e.target.value)}/>
         <div className="fz-mini c14 m-t-30">{t("Fee")}</div>
         <div className="c14 fwb fz-mini m-t-10">{t("The marketplace will charge 0.5% of your price.")}</div>
         {
           selectCurrency ? (
            <div className="fee-box m-t-20">
              <div className="fee-item flex flex-between">
                <div>
                    <span className="circle"></span>
                    <span className='c8c fz-mini m-l-9'>{t("Handling fee")}</span>
                </div>
                <div className="fz-mini fwb">{toFixed(sellPrice*0.05, 4)} {findNameByAddress(selectCurrency)}</div>
              </div>
              <div className="fee-item flex flex-between m-t-5">
                <div>
                    <span className="circle"></span>
                    <span className='c8c fz-mini m-l-9'>{t("Amount to account")}</span>
                </div>
                <div className="fz-mini fwb">{toFixed(sellPrice*(1-0.05), 4)}</div>
              </div>
            </div>
           ):''
         }
         
         <div className="check m-t-30 m-b-30">
           <Checkbox className='my-checkbox' onChange={(e)=>setRead(e.target.checked)}>{t("I approve Kepler marketplace Terms & Conditions")}</Checkbox>
         </div>
        <Button
        disabled={!isRead || !selectCurrency || !sellPrice}
        onClick={toList}
        className="btn color confirm-btn ta my-button color ta cf btn  w100 my-button"
        >{t("Post your Listing")}
        </Button>
      </div>
  </Modal>
  )
}




export default function (props) {
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
  let [showListTable, setShowListTable] = useState(false)
  let [loading, setLoading] = useState(false)
  let [visible, setVisible] = useState(false)
  let [status, setStatus] = useState(1) // status: 1: listing 2:sold 3： closed
  let [detail, setDetail] = useState({
    banners,
    order: {},
    metaData: {}
  })
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
  let toApprove = () => {
    setLoading(true)
    approve(detail.order.currencyAddress, getCurAddress().NFTMarket).then(res => {
      setNeedApprove(false)
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }
  let toClose = () => {
    setLoading(true)
    setShowLoading(true)
    close(detail.order.orderId).then(res => {
      setLoading(false)
      setShowLoading(false)
    })
  }
  let toBuy = () => {
    if(!store.getState().account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description:  t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setLoading(true)
    setShowConfirm(true)
    buy(detail.order.orderId).then(res => {
      setShowConfirm(false)
      setShowSuccess(true)
      setLoading(false)
    }).catch(err => {
      setShowConfirm(false)
      setLoading(false)
    })
  }
  useEffect(async ()=> {
      try {
        
          get('/api/order/detail', {
              chainId: 97,
              orderId: id
          }).then(async res => {
              setDetail(res.data)
              setBanners(res.data.banners.split(','))
              let attr = res.data.metaData.attributes
              // .filter(item => {
              //   return item.display_type
              // })
              setAttributes(attr)
              setIsmynft(res.data.order.makerAddress.toLowerCase() == store.getState().account.toLowerCase())
              checkNeedApprove(res.data.order.currencyAddress)
              let nftItem = await getItem(id)
              setStatus(nftItem.status)
              
          })
      }catch(err) {

      }
  }, [id])

  let activeChange = (index) => {
    setActiveIndex(index)
  }
  return (
    <div >
    <div className="nft-detail w100 p-t-100 p-l-40 p-b-60 p-r-40">
        <div className="flex flex-center flex-between show-p">
          <div className="bread cf fz-med">
          <Link className='pointer' to="/market">{t('MarketPlace')}  / </Link>
              <span className='ce'>{t('NFT Details')}</span>
          </div>
          <Button className='blue-btn' onClick={() => {window.history.go(-1)}}>{t('Return')}</Button>
        </div>
        
        <div className="flex nft-content m-t-40 ">
           <div className="nft-cover">
               <div className="cover m-b-20">
               {/* <model-viewer autoplay camera-controls alt="123" src={require('./scene.glb')}></model-viewer> */}
                <img src={banners[activeIndex]} alt="" onClick={()=>{setVisible(true)}}/>
               </div>
               <Viewer
                  visible={visible}
                  onClose={()=>setVisible(false)}
                  images={[{ src: banners[activeIndex], alt: '' }]}
                />

               <Swipe images={banners} onChange={activeChange}></Swipe>
               <div className="fz-mini show-p c56 m-t-20">{t('Contract address')}</div>
               <div className="fz-mini show-p cf m-t-6 fwb">
               <a className=' m-l-5 flex islink'  target="_blank" href={`https://testnet.bscscan.com/token/${detail.order.contractAddress}?a=${detail.order.tokenId}`}>
                 {detail.order.contractAddress}
                 <img width={14} className=' m-l-5' src={require('../assets/images/base/fenxiang.svg').default} alt="" />
                </a>
                </div>
               <div className="fz-mini show-p c56 m-t-20">{t('Issue date')}</div>
               <div className="fz-mini show-p cf m-t-6 fwb">{detail.order.updatedAt}</div>
               
               <div className="fz-mini show-p c56 m-t-20">{t('Blockchain')}</div>
               <div className="fz-mini show-p cf m-t-6 fwb">{FullChainIdName[detail.order.chainId]}</div>
               
               <div className="fz-mini show-p c56 m-t-20">{t('Token Standard')}</div>
               <div className="fz-mini show-p cf m-t-6 fwb">ERC721</div>
           </div>
           <div className="flex-1 nft-info">
               <div className="fz-18 cf flex flex-between">
                 <span className='flex nft-name-area'>
                   <span># {detail.order.tokenId} </span>
                   <span className='m-l-20 flex ownedby show-p'>{t('Owned by')}
                      <a className='ce m-l-5 flex maker-address islink'  target="_blank" href={`https://testnet.bscscan.com/address/${detail.order.makerAddress}`}>
                        {detail.order.makerAddress?.substr(0,5)+'...'+detail.order.makerAddress?.substr(detail.order.makerAddress?.length-5,)}
                        <img className=' m-l-5' src={require('../assets/images/base/fenxiang2.svg').default} alt="" />
                      </a>
                    </span>
                 </span>

                 <Share info={{...detail.order, favorite: detail.favorite}}/>
               </div>
               <div>
               <span className='m-l-20 flex ownedby show-m cf fz-mini'>
                       {t('Owned by')}
                      <a className='ce m-l-5 flex maker-address '  target="_blank" href={`https://testnet.bscscan.com/address/${detail.order.makerAddress}`}>
                        {detail.order.makerAddress?.substr(0,5)+'...'+detail.order.makerAddress?.substr(detail.order.makerAddress?.length-5,)}
                        <img className=' m-l-5' src={require('../assets/images/base/fenxiang2.svg').default} alt="" />
                      </a>
                </span>
               </div>
               <div className=" nftname fwb cf">{detail.metaData.name}</div>
               <span className="bg31 cf fz-mini p-l-17 p-r-17 p-t-7 p-b-7 ">{t('Legendary')}</span>
               <div className="fz-med fwb c56 desc">
                 {detail.metaData.description}
                </div>
               {/* <div className="fz-mini cf flex flex-center m-t-20 pointer">
                 Read More
                 <img className='m-l-4' src={require('../assets/images/base/arrow-bottom.svg').default}/>
               </div> */}
              <div className="flex flex-between flex-center price-area">
                 <div className="flex flex-column price-item">
                  <span className="fz-med cf">{t('Price')}</span>
                    <div className="price flex flex-center">
                      <img className='token' src={require('../assets/images/token/USDT.svg').default} alt="" />
                      <span className="fz-32 fwb cf m-l-8">{detail.order.tradeAmount} {findNameByAddress(detail.order.currencyAddress)}</span>
                      {/* <span className="fz-med c56 m-l-8">≈ $ 189.98</span> */}
                  </div>
                 </div>
                 
                 <div className='flex flex-column price-item'>
                  <span className="fz-med cf m-b-10">{t('Deadline')}</span>
                  <Countdown/>
                 </div>
              </div>
              {
                isMynft ? 
                <Button className="buy-btn my-button cf fz-24 fwb ta m-t-30 pointer"
               onClick={status == 1 ?toClose:toShowListTable}
               loading={loading}
              >
                {
                  status == 1 ? 'Cancel Listing' : 'List for sell'
                }
              </Button>:
              <Button className="buy-btn my-button cf fz-24 fwb ta m-t-30 pointer"
               onClick={needApprove?toApprove:toBuy}
               loading={loading}
              >
                {
                  needApprove ? `${t('Approve')}${findNameByAddress(detail.order.currencyAddress)}`:t('Buy Now')
                }
              </Button>

              }
              <div className="show-m">
              <Tabs defaultActiveKey="1" className='my-tab m-t-20'>
                <TabPane tab="Properties" key="1">
                  <div className=" prop-wrap flex flex-wrap flex-between">
                    {
                      attributes && attributes.map((item, index) => {
                        return (
                        <div className="prop flex flex-middle flex-column" key={index}>
                            <div className="ce fz-mini ta">[{item.trait_type}]</div>
                            <div className="cf fz-mini ta">{item.value}</div>
                            {/* <div className="cf fz-mini ta">{item.value}</div> */}
                        </div>
                        )
                      })
                    }
                    {
                      (() => {
                        let len = 3-(attributes?.length % 3)
                        let offset = []
                        for(let i =0;i<len; i++) {
                          offset.push(
                            <div  key={i} className="prop offset flex flex-middle flex-column">
                              
                          </div>
                          )
                        }
                        return offset
                      })()
                    }
                  </div>
                  
                </TabPane>
                <TabPane tab="Basic" key="2">
                 <div className="basic">
                    <div className="basic-line flex flex-between">
                       <div className="c06 fz-med basic-title">{t('Wearing part')}</div>
                       <div className="cf fz-med">{
                         detail.metaData.attributes ?
                         (
                          detail.metaData.attributes.find(item => item.trait_type == 'part').value
                         ):''
                       }</div>
                    </div>
                    <div className="basic-line flex flex-between">
                       <div className="c06 fz-med basic-title">{t('Profession')}</div>
                       <div className="cf fz-med">{
                          detail.metaData.attributes ?
                          (
                           detail.metaData.attributes.find(item => item.trait_type == 'profession').value
                          ):''
                       }</div>
                    </div>
                    <div className="basic-line flex flex-between">
                       <div className="c06 fz-med basic-title">{t('Dressing requirements')}</div>
                      <div className="ce fz-med">{
                          detail.metaData.attributes ?
                          (
                           detail.metaData.attributes.find(item => item.trait_type == 'level').value
                          ):''
                       }</div>
                    </div>
                 </div>
                </TabPane>
                <TabPane tab="Details" key="3" className='show-m'>
                 <div className="basic">
                  
                  <div className="flex flex-between">
                   <div className="fz-med c56 ">{t('Contract address')}</div>
                   <div className="fz-med cf  fwb">
                      <a className=' m-l-5 flex ce'  target="_blank" href={`https://testnet.bscscan.com/token/${detail.order.contractAddress}?a=${detail.order.tokenId}`}>
                      {addPoint(detail.order.contractAddress, 7)}
                      <img width={14} className=' m-l-5' src={require('../assets/images/base/fenxiang.svg').default} alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-between m-t-5">
                     <div className="fz-med c56 ">{t('Issue date')}</div>
                    <div className="fz-med cf  fwb">{detail.order.updatedAt}</div>
                  </div>
                  <div className="flex flex-between m-t-5">
                    <div className="fz-med c56 ">{t('Blockchain')}</div>
                    <div className="fz-med cf  fwb">{FullChainIdName[detail.order.chainId]}</div>
                  </div>
                  <div className="flex flex-between m-t-5">
                    <div className="fz-med c56 ">{t('Token Standard')}</div>
                    <div className="fz-med cf  fwb">ERC721</div>
                  </div>

                    
                    
                    
                    
                    
                 </div>
                </TabPane>
              </Tabs>
              </div>
              
              <div className="show-p">
              <Tabs defaultActiveKey="1" className='my-tab m-t-20'>
                <TabPane tab="Properties" key="1">
                  <div className=" prop-wrap flex flex-wrap flex-between">
                    {
                      attributes && attributes.map((item, index) => {
                        return (
                        <div className="prop flex flex-middle flex-column" key={index}>
                            <div className="ce fz-mini ta">[{item.trait_type}]</div>
                            <div className="cf fz-mini ta">{item.value}</div>
                            {/* <div className="cf fz-mini ta">{item.value}</div> */}
                        </div>
                        )
                      })
                    }
                    {
                      (() => {
                        let len = 3-(attributes?.length % 3)
                        let offset = []
                        for(let i =0;i<len; i++) {
                          offset.push(
                            <div  key={i} className="prop offset flex flex-middle flex-column">
                              
                          </div>
                          )
                        }
                        return offset
                      })()
                    }
                  </div>
                  
                </TabPane>
                <TabPane tab="Basic" key="2">
                 <div className="basic">
                    <div className="basic-line flex">
                       <div className="c06 fz-mini basic-title">{t('Wearing part')}</div>
                       <div className="cf fz-mini">{
                         detail.metaData.attributes ?
                         (
                          detail.metaData.attributes.find(item => item.trait_type == 'part').value
                         ):''
                       }</div>
                    </div>
                    <div className="basic-line flex">
                       <div className="c06 fz-mini basic-title">{t('Profession')}</div>
                       <div className="cf fz-mini">{
                          detail.metaData.attributes ?
                          (
                           detail.metaData.attributes.find(item => item.trait_type == 'profession').value
                          ):''
                       }</div>
                    </div>
                    <div className="basic-line flex">
                       <div className="c06 fz-mini basic-title">{t('Dressing requirements')}</div>
                      <div className="ce fz-mini">{
                          detail.metaData.attributes ?
                          (
                           detail.metaData.attributes.find(item => item.trait_type == 'level').value
                          ):''
                       }</div>
                    </div>
                 </div>
                </TabPane>
              </Tabs>
              </div>
              
           </div>
        </div>
    </div>
    <Success show={showSuccess} showChange={setShowSuccess} info={{cover: banners.length ?banners[0]:'', tokenId: detail.order.tokenId}}/>
    <Confirm show={showConfirm} showChange={setShowConfirm} info={{cover: banners.length ?banners[0]:'', order: detail.order}}/>
    <Loading show={showLoading} showChange={setShowLoading}/>
    <ListTable show={showListTable} showChange={setShowListTable} onSuccess={()=>setShowComplete(true)} info={detail.order}/>
    <Complete show={showComplete} showChange={setShowComplete}/>
    </div>
  )
}