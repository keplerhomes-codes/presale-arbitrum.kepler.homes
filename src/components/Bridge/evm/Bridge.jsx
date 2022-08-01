import '../Bridge.scss'
import { useEffect, useState, useRef} from 'react'
import { Collapse, Space, Tabs, Spin, Input, Table, Button, List } from 'antd';
import arrow from '../../../assets/images/faq/arrow.svg'
import classNames from 'classnames';
import { get, post } from '../../../http';
import {connect} from 'react-redux'
import iconArrow from '../../../assets/images/bridge/arrow.svg'
import iconSwitch from '../../../assets/images/bridge/switch.svg'
import Modal from '../../Base/Modal'
import { sign } from '../../../contract/methods'
import { applyToken, applyNFT, balanceOf, allowance as getAllowance, approve, keccak256ClaimTokenArgs, claimToken, getBridgeSupportedNFTs, tokensOfOwner, tokenURI, nftName, isApprovedForAll, setApprovalForAll, claimNFT } from '../../../contract/methods'
import {getAddress, getCurAddress} from '../../../contract/testnet/address'
import BigNumber from "bignumber.js";
import useInterval from '@use-it/interval';
import ethereum from '../../../assets/images/ConnectWallet/ethereum.png'
import binance from '../../../assets/images/ConnectWallet/binance.png'
import solana from '../../../assets/images/ConnectWallet/solana.png'
import avalanche from '../../../assets/images/ConnectWallet/avalanche.png'
import polygon from '../../../assets/images/ConnectWallet/polygon.png'
import KEPL from '../../../assets/images/token/KEPL.png'
import { showConnectWallet } from '../../../lib/util'
import VirtualList from 'rc-virtual-list';
import { useTranslation } from 'react-i18next'
import Empty from '../../Farm/Empty'

const { TabPane } = Tabs;

const chainList = [{
  name: "Ethereum",
  symbol: "ETH",
  chainId: "5",
  fee: "0.001",
  icon: ethereum,
}, {
  name: "Solana",
  symbol: "Solana",
  chainId: "5010",
  fee: "0.01",
  icon: solana,
}, {
  name: "Polygon",
  symbol: "Polygon",
  chainId: "80001",
  fee: "0.1",
  icon: polygon,
}, {
  name: "Avalanche",
  symbol: "Avalanche",
  chainId: "43113",
  fee: "0.01",
  icon: avalanche,
}, {
  name: "Binance",
  symbol: "BSC",
  chainId: "97",
  fee: "0.01",
  icon: binance,
}]

const tokenList = [{
  name: "KEPL",
  desc: "Kepler Token",
  icon: KEPL,
}, {
  name: "KEME",
  desc: "Kepler metaverse",
  icon: KEPL,
}]

function Bridge(props) {
  const {t, i18n} = useTranslation()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('send')
  const [type, setType] = useState('token')
  const [percent, setPercent] = useState(0)
  const [isSwitchChainVisible, setIsSwitchChainVisible] = useState(false)
  const [isSwitchTokenVisible, setIsSwitchTokenVisible] = useState(false)
  const [isSwitchNftVisible, setIsSwitchNftVisible] = useState(false)
  const [activeToken, setActiveToken] = useState(tokenList[0])
  const [activeNft, setActiveNft] = useState()
  const [activeFromChain, setActiveFromChain] = useState(chainList.find(chain => chain.symbol === props.chain))
  const [activeToChain, setActiveToChain] = useState()
  const [isFromChainActive, setIsFromChainActive] = useState(true)
  const [fromBalance, setFromBalance] = useState(0)
  const [toBalance, setToBalance] = useState(0)
  const [fromTokenAddress, setFromTokenAddress] = useState()
  const [amount, setAmount] = useState('')
  const [receipient, setReceipient] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [needApprove, setNeedApprove] = useState(false)
  const [needApproveNft, setNeedApproveNft] = useState(false)
  const [allowance, setAllowance] = useState()
  const [claimListAll, setClaimListAll] = useState([])
  const [claimList, setClaimList] = useState([])
  const [symbolMap, setSymbolMap] = useState({})
  const [isLoadingClaimList, setIsLoadingClaimList] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [claimLoadingMap, setClaimLoadingMap] = useState({})
  const [reload, setReload] = useState(0)
  const [nftList, setNftList] = useState([])
  const [tokenIdList, setTokenIdList] = useState([])
  const [tokenIdIndex, setTokenIdIndex] = useState(0)
  const [isLoadingNftFirst, setIsLoadingNftFirst] = useState(false)
  const [isLoadingNft, setIsLoadingNft] = useState(false)

  const onScrollNft = async e => {
    if (e.target.scrollHeight - e.target.scrollTop <= 400) {
      if (tokenIdIndex > tokenIdList.length) {
        return
      }
      setIsLoadingNft(true)
      await appendNft(tokenIdList.slice(tokenIdIndex, tokenIdIndex + 10));
      setIsLoadingNft(false)
      setTokenIdIndex(tokenIdIndex + 10)
    }
  }

  const appendNft = (tokenIdList) => {
    return new Promise(function(resolve, reject) {
      let doneCount = 0
      if (!tokenIdList.length) {
        resolve()
      }
      tokenIdList.forEach(token => {
        tokenURI(token.nft, token.tokenId, activeFromChain.symbol).then(uri => {
          get(uri).then(res => {
            setNftList(nftList => {
              return [
                ...nftList,
                {
                  ...res,
                  contract: token.nft,
                  key: `${token.nft}-${token.tokenId}`,
                  contractName: token.name,
                  id: token.tokenId,
                }
              ]
            })
            doneCount++
            if (doneCount === tokenIdList.length) {
              resolve()
            }
          })
        })
      })
    })
  }

  const handleShowSwitchNft = async () => {
    try {
      setNftList([])
      setIsSwitchNftVisible(true)
      setIsLoadingNftFirst(true)
      const nfts = await getBridgeSupportedNFTs(activeFromChain.symbol)
      const reqs = []
      const reqsNftNames = []
      const nftAddressList = []
      nfts.forEach(nft => {
        nftAddressList.push(nft)
        reqs.push(tokensOfOwner(nft, props.account, activeFromChain.symbol))
        reqsNftNames.push(nftName(nft, activeFromChain.symbol))
      })
  
      const resNameList = await Promise.all(reqsNftNames)
      const resList = await Promise.all(reqs)
      console.log(resList)
  
      const tokenIdList = []
  
      resList.forEach((tokenIds, index) => {
        tokenIdList.push(
          ...tokenIds.map(tokenId => {
            return {
              tokenId,
              nft: nftAddressList[index],
              name: resNameList[index],
            }
          })
        )
      })
      
      await appendNft(tokenIdList.slice(0, 10))
      setIsLoadingNftFirst(false)
      setTokenIdList(tokenIdList)
      setTokenIdIndex(10)
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(()=> {
    if (!props.chain || props.chain === 'Solana' || tab !== 'send') {
      return
    }
    const chain = chainList.find(chain => chain.symbol === props.chain)
    setActiveFromChain(chain)
    setActiveToChain(undefined)
  }, [props.chain, tab])

  useEffect(()=> {
    if (!props.chain || props.chain === 'Solana' || !claimListAll.length || tab !== 'claim') {
      setClaimList([])
      setIsLoadingClaimList(false)
      return
    }
    const chain = chainList.find(chain => chain.symbol === props.chain)
    let claimList = claimListAll.filter(item => {
      return +item.toChainId === +chain.chainId
    })

    const reqs = []
    claimList.forEach(claim => {
      if (claim.bridgeType === 'NFT') {
        reqs.push(nftName(claim.toContract.replace('0x000000000000000000000000', '0x'), props.chain))
      } else {
        reqs.push(new Promise(function (res, rej) {
          res()
        }))
      }
    })

    Promise.all(reqs).then(names => {
      console.log(names)
      claimList = claimList.map((claim, index) => {
        return {
          ...claim,
          name: `${names[index]} #${claim.tokenIds}`
        }
      })

      setIsLoadingClaimList(false)
      setClaimList(claimList)
    }).catch((e) => {
      console.log(e)
    })
  }, [props.chain, tab, claimListAll])

  useEffect(()=> {
    if (!props.account || props.chain === 'Solana') {
      return
    }

    if (tab === 'claim') {
      async function run() {
        try {
          const signature = await sign('claim')
          setIsLoadingClaimList(true)
          const chain = chainList.find(chain => chain.symbol === props.chain)
          const list = await get('/api/bridge/list', {
            receipient: props.account,
            signature,
            chainId: chain.chainId
          })
          console.log(list)
          setClaimListAll(list.data)
          list.data.forEach(item => {
            const chain = chainList.find(chain => +chain.chainId === +item.toChainId)
            const address = getAddress(chain.symbol)
            for (let key of Object.keys(address)) {
              if (`0x000000000000000000000000${address[key].slice(2)}` === item.toContract) {
                setSymbolMap(symbolMap => {
                  return {
                    ...symbolMap,
                    [item.toContract]: key
                  }
                })
                break
              }
            }
          });
        } catch(e) {
          setIsLoadingClaimList(false)
        }
      }

      run()
    }
  }, [props.account, props.chain, tab, reload])

  useEffect(()=> {
    if (!props.account || props.chain === 'Solana' || !fromTokenAddress || tab !== 'send' || type !== 'token') {
      return
    }
    getAllowance(fromTokenAddress, getCurAddress().Bridge).call().then(allow => {
      setAllowance(allow)
      setNeedApprove(+allow === 0)
    })
  }, [props.account, props.chain, tab, fromTokenAddress])

  useEffect(()=> {
    if (!props.account || props.chain === 'Solana' || tab !== 'send' || type !== 'nft' || !activeNft) {
      return
    }
    isApprovedForAll(activeNft.contract, getCurAddress().Bridge).then(bool => {
      console.log(bool)
      setNeedApproveNft(!bool)
    })
  }, [props.account, props.chain, tab, activeNft])

  useEffect(()=> {
    if (percent === 0) {
      return
    }
    setAmount(new BigNumber(fromBalance).dividedBy(10 ** 18).multipliedBy(percent).toFixed(3, 1))
  }, [percent, fromBalance])

  useEffect(()=> {
    if (!props.account || props.chain === 'Solana' || tab !== 'send' || type !== 'token') {
      return
    }
    const address = getAddress(activeFromChain.symbol)[activeToken.name]
    setFromTokenAddress(address)
    balanceOf(address, props.account, activeFromChain.symbol).then(balance => {
      setFromBalance(balance)
    })
    
  }, [activeFromChain, props.account, props.chain, activeToken, tab, type, reload])

  const handleSetAmount = (value) => {
    setPercent(0)
    if (value === '') {
      setAmount(value)
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
    setAmount(value)
  }

  const handleApprove = () => {
    setIsApproving(true)
    approve(fromTokenAddress, getCurAddress().Bridge).then(res => {
      setNeedApprove(false)
      setIsApproving(false)
    }).catch(err => {
      setIsApproving(false)
    })
  }

  const handleConfirm = async () => {
    try {
      setIsConfirming(true)
      const signature = await sign('bridgeToken')
      const resToken = await post('/api/bridge/token', {
        applicant: props.account,
        receipient: receipient,
        fromChainId: activeFromChain.chainId,
        toChainId: activeToChain.chainId,
        amount: amount,
        fromToken: fromTokenAddress,
        signature: signature
      })

      if (resToken.code !== 1) {
        // error msg

        setIsConfirming(false)
        return
      }

      const resApplyToken = await applyToken({
        ...resToken.data,
        sendFee: new BigNumber(activeFromChain.fee).multipliedBy(10 ** 18).toString()
      })

      setIsConfirming(false)
      setReload(reload => {
        return reload + 1
      })
    } catch(e) {
      console.log(e)
      setIsConfirming(false)
    }
  }

  const handleApproveNft = () => {
    setIsApproving(true)
    setApprovalForAll(activeNft.contract, getCurAddress().Bridge).then(res => {
      setNeedApproveNft(false)
      setIsApproving(false)
    }).catch(err => {
      setIsApproving(false)
    })
  }

  const handleConfirmNft = async () => {
    try {
      setIsConfirming(true)
      const signature = await sign('bridgeNFT')
      const resToken = await post('/api/bridge/nft', {
        applicant: props.account,
        receipient: receipient,
        fromChainId: activeFromChain.chainId,
        toChainId: activeToChain.chainId,
        tokenIds: activeNft.id,
        fromNFT: activeNft.contract,
        signature: signature
      })

      if (resToken.code !== 1) {
        // error msg

        setIsConfirming(false)
        return
      }

      const resApplyToken = await applyNFT({
        ...resToken.data,
        fromNFT: resToken.data.fromToken,
        sendFee: new BigNumber(activeFromChain.fee).multipliedBy(10 ** 18).toString()
      })

      setIsConfirming(false)
      setReload(reload => {
        return reload + 1
      })
    } catch(e) {
      console.log(e)
      setIsConfirming(false)
    }
  }

  const handleClaim = async (claim) => {
    setClaimLoadingMap(claimLoadingMap => {
      return {
        ...claimLoadingMap,
        [claim.orderId]: true
      }
    })
    try {
      const token = tokenList.find(token => token.name === symbolMap[claim.toContract])
  
      const resClaim = await claimToken({
        orderId: claim.orderId,
        applicant: claim.applicant,
        receipient: claim.receipient,
        toChainId: claim.toChainId,
        toToken: claim.toContract,
        amount: claim.amount,
        deadline: claim.deadline,
        signature: claim.signature,
        tokenSymbol: token.name,
      })
  
      setClaimLoadingMap(claimLoadingMap => {
        return {
          ...claimLoadingMap,
          [claim.orderId]: false
        }
      })
      setReload(reload => {
        return reload + 1
      })
    } catch(e) {
      console.log(e)
      setClaimLoadingMap(claimLoadingMap => {
        return {
          ...claimLoadingMap,
          [claim.orderId]: false
        }
      })
    }
  }

  const handleClaimNft = async (claim) => {
    setClaimLoadingMap(claimLoadingMap => {
      return {
        ...claimLoadingMap,
        [claim.orderId]: true
      }
    })
    try {
      const resClaim = await claimNFT({
        orderId: claim.orderId,
        applicant: claim.applicant,
        receipient: claim.receipient,
        toChainId: claim.toChainId,
        toNFT: claim.toContract,
        tokenIds: claim.tokenIds,
        deadline: claim.deadline,
        signature: claim.signature,
        nftName: claim.name,
      })
  
      setClaimLoadingMap(claimLoadingMap => {
        return {
          ...claimLoadingMap,
          [claim.orderId]: false
        }
      })
      setReload(reload => {
        return reload + 1
      })
    } catch(e) {
      console.log(e)
      setClaimLoadingMap(claimLoadingMap => {
        return {
          ...claimLoadingMap,
          [claim.orderId]: false
        }
      })
    }
  }
  
  const operations =  (
    <div className="type-switch">
      <div className={classNames(["fw500", "type-switch-option", {"active": type === "token"}])} onClick={_ => setType('token')}>{t('Token')}</div>
      <div className={classNames(["fw500", "type-switch-option", {"active": type === "nft"}])} onClick={_ => setType('nft')}>{t('NFT')}</div>
    </div>
  )

  const claimColumns = [
    {
      title: t('Name'),
      key: 'name',
      render: function(text, record, index) {
        // debugger
        if (record.bridgeType === 'Token') {
          if (!symbolMap[record.toContract]) {
            return ''
          }
          const token = tokenList.find(token => token.name === symbolMap[record.toContract])
          return (
            <div className="claim-token">
              <img src={token.icon} alt="" className="token-icon" />
              <div className="fw500 token-name">{symbolMap[record.toContract]}</div>
            </div>
          )
        } else {
          return record.name
          // return 'nft'
        }
      }
    },
    {
      title: t('Amount'),
      key: 'amount',
      render: function(text, record, index) {
        if (record.bridgeType === 'Token') {
          return new BigNumber(record.amount).dividedBy(10 ** 18).toFixed(3, 1)
        } else {
          return '1'
        }
      }
    },
    {
      title: t('Type'),
      dataIndex: 'bridgeType',
      key: 'type',
    },
    {
      title: t('Time'),
      dataIndex: 'updateTime',
      key: 'time',
    },
    {
      title: t('Destination Chain'),
      key: 'destination_chain',
      render: function(text, record, index) {
        const chain = chainList.find(chain => +chain.chainId === +record.toChainId)
        return (
          <div className="destination-chain">
            <img src={chain.icon} alt="" className="chain-icon" />
            <div className="fw500 chain-name">{chain.name}</div>
          </div>
        )
      }
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: function(text, record, index) {
        return (
          record.status === 1 ?
          <Button className="fwb btn-claim" loading={claimLoadingMap[record.orderId]} onClick={_ => record.bridgeType === 'Token' ? handleClaim(record) : handleClaimNft(record)}>{t('Claim')}</Button>
          :
          <Button className="fwb btn-claimed" disabled>{t('Claimed')}</Button>
        )
      }
    },
  ]

  const handleSwitch = () => {
    if (!activeToChain) {
      return
    }
    // setActiveToChain(activeFromChain)
    // setActiveFromChain(activeToChain)
    if (activeToChain.symbol !== props.chain) {
      showConnectWallet(activeToChain.symbol)
    }
  }

  return (
    <div className="bridge-page">
      <div className="fwb bridge-title">{t('Bridge')}</div>
      <div className={classNames(["bridge-content", {'claim-tab': tab === 'claim'}])}>
        <Tabs className={classNames(['my-tab', 'bridge-tab'])} activeKey={tab} onChange={activeKey => setTab(activeKey)} tabBarExtraContent={tab === 'send' ? operations : null}>
          <TabPane tab="Send" key="send">
            <div className="asset-selector">
              <div className="asset-selector-header">
                <div className="fw500 asset-selector-label">{t('From')}</div>
                {
                  type === 'token' ?
                  <div className="asset-selector-percent">
                    <div className={classNames(["fw500", "asset-selector-percent-item", {"active": percent === .25}])} onClick={_ => setPercent(.25)}>25%</div>
                    <div className={classNames(["fw500", "asset-selector-percent-item", {"active": percent === .5}])} onClick={_ => setPercent(.5)}>50%</div>
                    <div className={classNames(["fw500", "asset-selector-percent-item", {"active": percent === .75}])} onClick={_ => setPercent(.75)}>75%</div>
                    <div className={classNames(["fw500", "asset-selector-percent-item", {"active": percent === 1}])} onClick={_ => setPercent(1)}>100%</div>
                  </div>
                  :
                  ''
                }
              </div>
              <div className={classNames(["asset-selector-content", {"has-error": !amount}])}>
                <div className="asset-selector-content-top">
                  <div className="chain-selector" onClick={_ => {
                    setIsSwitchChainVisible(true)
                    setIsFromChainActive(true)
                  }}>
                    <img src={activeFromChain.icon} alt="" className="chain-icon" />
                    <div className="fw500 chain-name">{activeFromChain.name}</div>
                    <img className="icon-arrow" src={iconArrow} alt="" />
                  </div>
                  {
                    type === 'token' ?
                    <div className="balance">
                      <div className="fw500 balance-label">{t('Balance')}:</div>
                      <div className="fw500 balance-value">{new BigNumber(fromBalance).dividedBy(10 ** 18).toFixed(3, 1)}</div>
                    </div>
                    : ''
                  }
                </div>
                {
                  type === 'token' ?
                  <div className="asset-selector-content-bottom">
                    <Input type="text" placeholder="0" className="fw500" value={amount} onChange={e => handleSetAmount(e.target.value)} />

                    <div className="token-selector" onClick={_ => setIsSwitchTokenVisible(true)}>
                      <img src={activeToken.icon} alt="" className="token-icon" />
                      <div className="fw500 token-name">{activeToken.name}</div>
                      <img className="icon-arrow" src={iconArrow} alt="" />
                    </div>
                  </div>
                  :
                  <div className="asset-selector-content-bottom">
                    {
                      activeNft ?
                      <div className="nft-from">
                        <img src={activeNft.image} alt="" className="nft-icon" />
                        <div className="fw500 nft-name">{activeNft.contractName} {activeNft.name}</div>
                      </div>
                      : ''
                    }
                    <div className="fw500 choose-nft" onClick={_ => handleShowSwitchNft()}>{t('Choose')}</div>
                  </div>
                }
              </div>
            </div>
            <div className="asset-switch" onClick={handleSwitch}><img className="icon-switch" src={iconSwitch} alt="" /></div>
            <div className="asset-selector">
              <div className="asset-selector-header">
                <div className="fw500 asset-selector-label">{t('To')}</div>
              </div>
              <div className="asset-selector-content">
                <div className="asset-selector-content-top">
                  <div className="chain-selector" onClick={_ => {
                    setIsSwitchChainVisible(true)
                    setIsFromChainActive(false)
                  }}>
                    {
                      activeToChain?
                      <>
                        <img src={activeToChain?.icon} alt="" className="chain-icon" />
                        <div className="fw500 chain-name">{activeToChain?.name}</div>
                      </>
                      :
                      <span>{t('Please select chain')}</span>
                    }
                    <img className="icon-arrow" src={iconArrow} alt="" />
                  </div>
                  {/* <div className="balance">
                    <div className="fw500 balance-label">Balance:</div>
                    <div className="fw500 balance-value"></div>
                  </div> */}
                </div>
                {
                  type === 'token' ?
                  <div className="asset-selector-content-bottom">
                    <Input type="text" readOnly className="fw500" value={amount} />

                    <div className="token-selector" style={{"cursor": "auto"}}>
                      <img src={activeToken.icon} alt="" className="token-icon" />
                      <div className="fw500 token-name">{activeToken.name}</div>
                    </div>
                  </div>
                  :
                  <div className="asset-selector-content-bottom">
                    {
                      activeNft ?
                      <div className="nft-to">
                        <img src={activeNft.image} alt="" className="nft-icon" />
                        <div className="fw500 nft-name">{activeNft.contractName} {activeNft.name}</div>
                      </div>
                      : ''
                    }
                  </div>
                }
              </div>
            </div>
            <div className="address-input">
              <div className="address-input-header">
                <div className="fw500 address-input-label">{activeToChain?.symbol} {t('address')}</div>
                <div className="address-input-tip">{t('bridge_address_warning')}</div>
              </div>
              <div className={classNames(["address-input-content", {"has-error": !receipient.trim()}])}>
                <Input type="text" placeholder={activeToChain ? activeToChain.symbol + ` ${t('address')}` : t('address')} className="fw500" value={receipient} onChange={e => setReceipient(e.target.value)} />
              </div>
            </div>
            {
              type === 'token' ?
              <div className="reminder">
                <div className="fwb">{t('Reminder')}</div>
                <div>{t('bridge_token_reminder_1')}</div>
                <div>{t('bridge_token_reminder_2')}</div>
                <div>{t('bridge_token_reminder_3')}</div>
                <div>{t('bridge_token_reminder_4')}</div>
              </div>
              :
              <div className="reminder">
                <div className="fwb">{t('Reminder')}</div>
                <div>{t('bridge_nft_reminder_1')}</div>
                <div>{t('bridge_nft_reminder_2')}</div>
              </div>
            }
            {
              props.connect ?
                type == 'token' ?
                  needApprove ?
                  <Button className="fwb m-t-30 btn-connect" loading={isApproving} onClick={_ => handleApprove()}>{t('Approve')}</Button>
                  :
                  <Button className="fwb m-t-30 btn-connect" loading={isConfirming} disabled={!amount || new BigNumber(fromBalance).dividedBy(10 ** 18).lt(amount) || !receipient.trim() || !activeToChain || activeFromChain === activeToChain} onClick={_ => handleConfirm()}>{t('Confirm')}</Button>
                :
                  needApproveNft ?
                  <Button className="fwb m-t-30 btn-connect" loading={isApproving} onClick={_ => handleApproveNft()}>{t('Approve')}</Button>
                  :
                  <Button className="fwb m-t-30 btn-connect" loading={isConfirming} disabled={!activeNft || !receipient.trim() || !activeToChain || activeFromChain === activeToChain} onClick={_ => handleConfirmNft()}>{t('Confirm')}</Button>
              :
              <Button className="fwb m-t-30 btn-connect" onClick={_ => showConnectWallet()}>{t('Connect Wallet')}</Button>
            }
          </TabPane>
          <TabPane tab="Claim" key="claim">
            <div className="claim-list">
            {
              claimList.length ?
                window.innerWidth >= 768 ?
                  <Table dataSource={claimList} columns={claimColumns} rowKey={record => record.orderId} loading={isLoadingClaimList} pagination={false} />
                  :
                  claimList.map(record => {
                    return (
                      <div className="claim-item" key={record.orderId}>
                        <div className="claim-item-header">
                          {(() => {
                            if (record.bridgeType === 'Token') {
                              if (!symbolMap[record.toContract]) {
                                return ''
                              }
                              const token = tokenList.find(token => token.name === symbolMap[record.toContract])
                              return (
                                <div className="claim-token">
                                  <img src={token.icon} alt="" className="token-icon" />
                                  <div className="fw500 token-name">{symbolMap[record.toContract]}</div>
                                </div>
                              )
                            } else {
                              return record.name
                            }
                          })()}

                          {(() => {
                            if (record.status === 1) {
                              return <Button className="fwb btn-claim" loading={claimLoadingMap[record.orderId]} onClick={_ => record.bridgeType === 'Token' ? handleClaim(record) : handleClaimNft(record)}>{t('Claim')}</Button>
                            } else {
                              return <Button className="fwb btn-claimed" disabled>{t('Claimed')}</Button>
                            }
                          })()}
                        </div>
                        <div className="claim-item-body">
                          <div className="cell-item">
                            <div className="cell-title">{t('Amount')}</div>
                            <div className="cell-value">{record.bridgeType === 'Token' ? new BigNumber(record.amount).dividedBy(10 ** 18).toFixed(3, 1) : '1'}</div>
                          </div>

                          <div className="cell-item">
                            <div className="cell-title">{t('Type')}</div>
                            <div className="cell-value">{record.bridgeType}</div>
                          </div>


                          <div className="cell-item">
                            <div className="cell-title">{t('Time')}</div>
                            <div className="cell-value">{record.updateTime}</div>
                          </div>

                          <div className="cell-item">
                            <div className="cell-title">{t('Destination Chain')}</div>
                            <div className="cell-value">
                              {(() => {
                                const chain = chainList.find(chain => +chain.chainId === +record.toChainId)
                                return (
                                  <div className="destination-chain">
                                    <img src={chain.icon} alt="" className="chain-icon" />
                                    <div className="fw500 chain-name">{chain.name}</div>
                                  </div>
                                )
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
              :
              (
                window.innerWidth >= 768 ?
                <div className="text-empty">{t('No data')}</div>
                :
                <Empty />
              )
            }
            </div>
          </TabPane>
        </Tabs>

        
      </div>

      <Modal width={window.innerWidth >= 768 ? 420 : 315} className="modal-switch-chain" isVisible={isSwitchChainVisible} title={isFromChainActive ? t('Switch from') : t('Switch to')} onClose={() =>{
        setIsSwitchChainVisible(false)} 
      }>
        <div className="chain-list">
          {
            chainList.map((chain, index) => {
              return (
                <div className={classNames(["chain-item", {"active": (isFromChainActive ? activeFromChain.symbol : activeToChain?.symbol) === chain.symbol}])} key={index} disabled={
                  (type === 'nft' && chain.symbol === 'Solana') ? true
                  :
                    isFromChainActive ?
                    activeToChain?.symbol === chain.symbol
                    :
                    activeFromChain.symbol === chain.symbol
                } onClick={_ => {
                  if (type === 'nft' && chain.symbol === 'Solana') {
                    return
                  }
                  if (isFromChainActive) {
                    if (activeToChain?.symbol === chain.symbol) {
                      return
                    }
                    if (chain.symbol !== props.chain) {
                      showConnectWallet(chain.symbol)
                    }
                  } else {
                    if (activeFromChain.symbol === chain.symbol) {
                      return
                    }
                    setActiveToChain(chain)
                  }
                  setIsSwitchChainVisible(false)
                }}>
                  <img src={chain.icon} alt="" className="chain-icon" />
                  <div className="fw500 chain-name">{chain.name}</div>
                </div>
              )
            })
          }
        </div>
      </Modal>

      <Modal width={window.innerWidth >= 768 ? 420 : 315} className="modal-switch-token" isVisible={isSwitchTokenVisible} title={t('Select a token')} onClose={() =>{
        setIsSwitchTokenVisible(false)} 
      }>
        <div className="token-list">
          {
            tokenList.map((token, index) => {
              return (
                <div className={classNames(["token-item", {"active": activeToken.name === token.name}])} key={index} onClick={_ => {
                  setActiveToken(token)
                  setIsSwitchTokenVisible(false)
                }}>
                  <img src={token.icon} alt="" className="token-icon" />
                  <div>
                    <div className="fw500 token-name">{token.name}</div>
                    <div className="token-desc">{token.desc}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </Modal>

      <Modal width={window.innerWidth >= 768 ? 420 : 315} className="modal-switch-nft" isVisible={isSwitchNftVisible} title={t('Select an NFT')} onClose={() =>{
        setIsSwitchNftVisible(false)} 
      }>
        <div className="nft-list">
          <List loading={isLoadingNftFirst}>
            <VirtualList
              data={nftList}
              height={400}
              itemHeight={80}
              itemKey="key"
              onScroll={onScrollNft}
            >
              {item => (
                <div className={classNames(["nft-item", {"active": false}])} key={item.contract + '-' + item.name} onClick={_ => {
                  setActiveNft(item)
                  setIsSwitchNftVisible(false)
                }}>
                  <img src={item.image} alt="" className="nft-icon" />
                  <div>
                    <div className="fw500 nft-name">{item.contractName}</div>
                    <div className="nft-desc">{item.name}</div>
                  </div>
                </div>
              )}
            </VirtualList>
          </List>
          {
            isLoadingNft ?
            <div className="nft-loading">
              <Spin />
            </div>
            : ''
          }
        </div>
      </Modal>
    </div>
  )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Bridge
);
