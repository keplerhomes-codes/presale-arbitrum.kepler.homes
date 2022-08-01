import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../Rewards.scss'
import banner from '../../../assets/images/farm/farm-banner.png'
import Search from "../../../components/Base/Search"
import Select from "../../../components/Base/Select"
import tokenLogo0 from '../../../assets/images/farm/token0.png'
import tokenLogo1 from '../../../assets/images/farm/token1.png'
import tokenLogo2 from '../../../assets/images/farm/token2.png'
import busdLogo from '../../../assets/images/farm/BUSD.svg'

import link from '../../../assets/images/farm/link.png'
import Modal from '../../../components/Base/Modal'
import { Input, Button, Slider, Spin, Table } from 'antd';
import { getDepositPoolViews, getTokenSymbol, allowance, approve, stake, unstake, balanceOf, getMyDepositView, getLockedRewardView, claim, withdraw } from '../../../contract/methods'
import {connect} from 'react-redux'
import accounting from 'accounting'
import BigNumber from "bignumber.js";
import ADDRESS from '../../../contract/testnet/address';
import notification from '../../../components/notification';
import classNames from 'classnames';
import { format } from 'date-fns'
import Empty from '../Empty'
import { chainSymbolMap } from '../../../wallet/helper/getNetworkData'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from "react-router-dom"

function Rewards (props) {
  const {t, i18n} = useTranslation()
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showUnstakeModal, setShowUnstakeModal] = useState(false)
  const [claimList, setClaimList] = useState([])
  const [lockedList, setLockedList] = useState([])
  const [symbolMap, setSymbolMap] = useState({})
  const [allowanceMap, setAllowanceMap] = useState({})
  let [isApproving, setIsApproving] = useState(false)
  let [isStaking, setIsStaking] = useState(false)
  let [isUnstaking, setIsUnstaking] = useState(false)
  let [needApprove, setNeedApprove] = useState(false)
  const [activePool, setActivePool] = useState()
  const [activeStaking, setActiveStaking] = useState()
  const [amount, setAmount] = useState()
  const [unstakeAmount, setUnstakeAmount] = useState()
  const [balance, setBalance] = useState()
  const [stakeType, setStakeType] = useState(0)
  const [weight, setWeight] = useState(1)
  const [lockUnits, setLockUnits] = useState(0)
  const [claimLoadingMap, setClaimLoadingMap] = useState({})
  const [withdrawLoadingMap, setWithdrawLoadingMap] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [blockExplorerUrl, setBlockExplorerUrl] = useState('')
  const nav = useNavigate()
  const location = useLocation();
  const [farmTabIndex, setFarmTabIndex] = useState(location.pathname === '/farm/claim' ? 0 : 1)

  useEffect(() => {
    if (location.pathname === '/farm/claim') {
      setFarmTabIndex(0)
    } else {
      setFarmTabIndex(1)
    }
  }, [location]);

  useEffect(() => {
    if (!props.chain) {
      return
    }

    const chain = chainSymbolMap[props.chain]()
    const blockExplorerUrl = chain.params.blockExplorerUrls[0]
    setBlockExplorerUrl(blockExplorerUrl)
  }, [props.chain])

  useEffect(() => {
    
    async function run() {
      setIsLoading(true)
      if (farmTabIndex === 0) {
        if (!props.account) {
          setClaimList([])
        } else {
          const res = await getMyDepositView(props.account)
          console.log(res)
          res.forEach(item => {
            getTokenSymbol(item.depositToken).then(symbol => {
              setSymbolMap(symbolMap => {
                return {
                  ...symbolMap,
                  [item.depositToken]: symbol
                }
              })
            })
          })
          setClaimList(res)
        }
      } else if (farmTabIndex === 1) {
        if (!props.account) {
          setLockedList([])
        } else {
          const res = await getLockedRewardView(props.account)
          console.log(res)
          res.forEach(item => {
            getTokenSymbol(item.depositToken).then(symbol => {
              setSymbolMap(symbolMap => {
                return {
                  ...symbolMap,
                  [item.depositToken]: symbol
                }
              })
            })
          })
          console.log(res)
          setLockedList(res)
        }
      }
      setIsLoading(false)
    }
    run()
  }, [props.account, props.chain, farmTabIndex, reload])

  let toApprove = (currencyAddress, contractAddress) => {
    setIsApproving(true)
    approve(currencyAddress, contractAddress).then(res => {
      setNeedApprove(false)
      setIsApproving(false)
    }).catch(err => {
      setIsApproving(false)
    })
  }

  let toClaim = (item) => {
    console.log(item)
    if(!props.account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description: t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setClaimLoadingMap(claimLoadingMap => {
      return {
        ...claimLoadingMap,
        [`${item.depositPool}-${item.depositId}`]: true
      }
    })
    claim(item.depositId, item.depositPool).then(res => {
      setReload(reload => reload + 1)
      setClaimLoadingMap(claimLoadingMap => {
        return {
          ...claimLoadingMap,
          [`${item.depositPool}-${item.depositId}`]: false
        }
      })
    }).catch(err => {
      console.log(err)
      setClaimLoadingMap(claimLoadingMap => {
        return {
          ...claimLoadingMap,
          [`${item.depositPool}-${item.depositId}`]: false
        }
      })
    })
  }

  let toWithdraw = (item, index) => {
    if(!props.account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description: t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setWithdrawLoadingMap(withdrawLoadingMap => {
      return {
        ...withdrawLoadingMap,
        [`${item.depositPool}-${index}`]: true
      }
    })
    withdraw(item.lockedRewardId).then(res => {
      setReload(reload => reload + 1)
      setWithdrawLoadingMap(withdrawLoadingMap => {
        return {
          ...withdrawLoadingMap,
          [`${item.depositPool}-${index}`]: false
        }
      })
    }).catch(err => {
      setWithdrawLoadingMap(withdrawLoadingMap => {
        return {
          ...withdrawLoadingMap,
          [`${item.depositPool}-${index}`]: false
        }
      })
    })
  }
  
  let showStake = (item) => {
    setBalance(0)
    balanceOf(item.depositToken, props.account).then(balance => {
      setBalance(balance)
    })
    setActivePool(item)
    setShowStakeModal(true)
  }

  let showUnstake = (item) => {
    setActiveStaking(item)
    setShowUnstakeModal(true)
  }

  const claimColumns = [
    {
      title: '',
      key: 'pair',
      render: (text, record) => {
        return (
          <div className="pair-info">
            <img src={tokenLogo1} alt="" className="token-logo1" />
            {
              symbolMap[record.depositToken] === 'KEPL-BUSD' ?
              <img src={busdLogo} alt="" className="token-logo2" />
              : ''
            }
            <div className="pair-name">{symbolMap[record.depositToken]}</div>
            <a target="_blank" href={`${blockExplorerUrl}/address/${record.depositToken}`}><img src={link} alt="" className="link" /></a>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'pendingRewards',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Available Amount')}</div>
            <div className="cell-value">{new BigNumber(record.pendingRewards).dividedBy(10 ** 18).toFixed(2, 1)} <img src={tokenLogo0} alt="" className="token-logo" /></div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'op',
      align: 'right',
      render: (text, record) => {
        return (
          <Button className="btn-claim" disabled={+record.pendingRewards === 0} onClick={_ => toClaim(record)} loading={claimLoadingMap[`${record.depositPool}-${record.depositId}`]}>{t('Claim')}</Button>
        )
      },
    },
  ]

  const lockedColumns = [
    {
      title: '',
      key: 'pair',
      render: (text, record) => {
        return (
          <div className="pair-info">
            <img src={tokenLogo1} alt="" className="token-logo1" />
            {
              symbolMap[record.depositToken] === 'KEPL-BUSD' ?
              <img src={busdLogo} alt="" className="token-logo2" />
              : ''
            }
            <div className="pair-name">{symbolMap[record.depositToken]}</div>
            <a target="_blank" href={`${blockExplorerUrl}/address/${record.depositToken}`}><img src={link} alt="" className="link" /></a>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'rewardsClaimed',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Rewards Claimed')}</div>
            <div className="cell-value">{new BigNumber(record.lockedAmount).minus(record.pendingRewards).dividedBy(10 ** 18).toFixed(2, 1)}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'pendingRewards',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Pending Rewards')}</div>
            <div className="cell-value">{new BigNumber(record.pendingRewards).dividedBy(10 ** 18).toFixed(2, 1)}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'apy',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">APY</div>
            <div className="cell-value highlight">{new BigNumber(record.apy).dividedBy(10 ** 18).toFixed(2, 1)}%</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'nextUnlockTime',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Next Unlock Time')}</div>
            <div className="cell-value">{format(new Date(+record.nextUnlockTime*1000), 'yyyy-MM-dd HH:mm:ss')}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'withdrawableAmount',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Rewards Available')}</div>
            <div className="cell-value">{new BigNumber(record.withdrawableAmount).dividedBy(10 ** 18).toFixed(2, 1)}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'op',
      align: 'right',
      render: (text, record, index) => {
        if (+record.withdrawableAmount <= 0) {
          return <Button className="btn-locked" disabled>{t('Locked')}</Button>
        } else {
          return <Button className="btn-withdraw" onClick={_ => toWithdraw(record, index)} loading={withdrawLoadingMap[`${record.depositPool}-${index}`]}>{t('Withdraw')}</Button>
        }
      },
    },
  ]

  return (
    <div className="farm-rewards fw500">
      <div className="farm-banner">
        {/* <img src={banner} alt="" className="banner-image" /> */}
        <div className="banner-content">
          <div className="banner-title">{t('KEPL claimed rewards are subject to a 12 month Locked period and 1/12 of the total locked amount will be unlocked every month.')}</div>
          <div className="banner-subtitle">{t('While they are locked they compound your rewards.')}</div>
        </div>
      </div>

      <div className="farm-content">
        <div className="farm-header">
          <div className="tab-list">
            <div className={classNames(["tab-item", {"active": farmTabIndex === 0}])} onClick={_ => nav('/farm/claim')}>{t('Claim')}</div>
            <div className={classNames(["tab-item", {"active": farmTabIndex === 1}])} onClick={_ => nav('/farm/withdraw')}>{t('Withdraw')}</div>
          </div>
          <div className="filter-group">
            {/* <Search />
            <Select /> */}
          </div>
        </div>
        {
          isLoading ?
            (
              <div className="w100 flex flex-center flex-middle p-100">
                <Spin size="large"></Spin>
              </div>
            ) 
          :
            farmTabIndex === 0 ?
              <div className="farm-list">
                {
                  claimList.length ?
                    window.innerWidth >= 768 ?
                      <Table columns={claimColumns} dataSource={claimList} showHeader={false} pagination={{pageSize: 20}} rowKey={(record) => 'claim_'+record.depositPool+record.depositId}/>
                    :
                    claimList.map((record, index) => {
                      return (
                        <div className="farm-item" key={'claim_'+record.depositPool+record.depositId}>
                          <div className="farm-item-header">
                            <div className="pair-info">
                              <img src={tokenLogo1} alt="" className="token-logo1" />
                              {
                                symbolMap[record.depositToken] === 'KEPL-BUSD' ?
                                <img src={busdLogo} alt="" className="token-logo2" />
                                : ''
                              }
                              <div className="pair-name">{symbolMap[record.depositToken]}</div>
                              <a target="_blank" href={`${blockExplorerUrl}/address/${record.depositToken}`}><img src={link} alt="" className="link" /></a>
                            </div>

                            <Button className="btn-claim" disabled={+record.pendingRewards === 0} onClick={_ => toClaim(record)} loading={claimLoadingMap[`${record.depositPool}-${record.depositId}`]}>{t('Claim')}</Button>
                          </div>
                          <div className="farm-item-body">
                            <div className="cell-item">
                              <div className="cell-title">{t('Available Amount')}</div>
                              <div className="cell-value">{new BigNumber(record.pendingRewards).dividedBy(10 ** 18).toFixed(2, 1)} <img src={tokenLogo0} alt="" className="token-logo" /></div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  :
                  <Empty />
                }
              </div>
            :
              <div className="farm-list">
                {
                  lockedList.length ?
                    window.innerWidth >= 768 ?
                      <Table columns={lockedColumns} dataSource={lockedList} showHeader={false} pagination={{pageSize: 20}} rowKey={(record) => 'locked'+record.depositPool+record.lockedRewardId}/>
                    :
                    lockedList.map((record, index) => {
                      console.log(record)
                      return (
                        <div className="farm-item" key={'locked'+record.depositPool+record.lockedRewardId}>
                          <div className="farm-item-header">
                            <div className="pair-info">
                              <img src={tokenLogo1} alt="" className="token-logo1" />
                              {
                                symbolMap[record.depositToken] === 'KEPL-BUSD' ?
                                <img src={busdLogo} alt="" className="token-logo2" />
                                : ''
                              }
                              <div className="pair-name">{symbolMap[record.depositToken]}</div>
                              <a target="_blank" href={`${blockExplorerUrl}/address/${record.depositToken}`}><img src={link} alt="" className="link" /></a>
                            </div>

                            {(() => {
                              if (+record.withdrawableAmount <= 0) {
                                return <Button className="btn-locked" disabled>{t('Locked')}</Button>
                              } else {
                                return <Button className="btn-withdraw" onClick={_ => toWithdraw(record, index)} loading={withdrawLoadingMap[`${record.depositPool}-${index}`]}>{t('Withdraw')}</Button>
                              }
                            })()}
                          </div>
                          <div className="farm-item-body">
                            <div className="cell-item">
                              <div className="cell-title">{t('Rewards Claimed')}</div>
                              <div className="cell-value">{new BigNumber(record.lockedAmount).minus(record.pendingRewards).dividedBy(10 ** 18).toFixed(2, 1)}</div>
                            </div>
                            <div className="cell-item">
                              <div className="cell-title">{t('Pending Rewards')}</div>
                              <div className="cell-value">{new BigNumber(record.pendingRewards).dividedBy(10 ** 18).toFixed(2, 1)}</div>
                            </div>
                            <div className="cell-item">
                              <div className="cell-title">APY</div>
                              <div className="cell-value highlight">{new BigNumber(record.apy).dividedBy(10 ** 18).toFixed(2, 1)}%</div>
                            </div>
                            <div className="cell-item">
                              <div className="cell-title">{t('Next Unlock Time')}</div>
                              <div className="cell-value">{format(new Date(+record.nextUnlockTime*1000), 'yyyy-MM-dd HH:mm:ss')}</div>
                            </div>
                            <div className="cell-item">
                              <div className="cell-title">{t('Rewards Available')}</div>
                              <div className="cell-value">{new BigNumber(record.withdrawableAmount).dividedBy(10 ** 18).toFixed(2, 1)}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  :
                  <Empty />
                }
              </div>
        }
      </div>

    </div>
  )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Rewards
);
