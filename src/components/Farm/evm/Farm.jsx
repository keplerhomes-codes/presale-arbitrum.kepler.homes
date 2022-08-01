import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../Farm.scss'
import banner from '../../../assets/images/farm/farm-banner.png'
import Search from "../../../components/Base/Search"
import Select from "../../../components/Base/Select"
import tokenLogo0 from '../../../assets/images/farm/token0.png'
import tokenLogo1 from '../../../assets/images/farm/token1.png'
import busdLogo from '../../../assets/images/farm/BUSD.svg'
import link from '../../../assets/images/farm/link.png'
import Modal from '../../../components/Base/Modal'
import { Input, Button, Slider, Spin, Table } from 'antd';
import { getDepositPoolViews, getTokenSymbol, allowance, approve, stake, unstake, balanceOf, getMyDepositView } from '../../../contract/methods'
import {connect} from 'react-redux'
import accounting from 'accounting'
import BigNumber from "bignumber.js";
import notification from '../../../components/notification';
import classNames from 'classnames';
import { MaxUint256 } from '@ethersproject/constants'
import { showConnectWallet } from '../../../lib/util'
import Empty from '../Empty'
import { chainSymbolMap } from '../../../wallet/helper/getNetworkData'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from "react-router-dom"

const UNIT = 1e18;

let selectOptions = [
  {
    label: 'APY high-low',
    value: 0
  },
  {
    label: 'TVL high-low',
    value: 1
  },
  {
    label: 'Weight high-low',
    value: 2
  },
]

function FarmEVM (props) {
  const {t, i18n} = useTranslation()
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showUnstakeModal, setShowUnstakeModal] = useState(false)
  const [poolList, setPoolList] = useState([])
  const [originPoolList, setOriginPoolList] = useState([])
  const [stakingList, setStakingList] = useState([])
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
  const [weight, setWeight] = useState(1+1/52)
  const [lockUnits, setLockUnits] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [unstakeLoadingMap, setUnstakeLoadingMap] = useState({})
  const [approvingMap, setApprovingMap] = useState({})
  const [reload, setReload] = useState(0)
  const [sort, setSort] = useState(0)
  const [search, setSearch] = useState('')
  const [blockExplorerUrl, setBlockExplorerUrl] = useState('')
  const [price, setPrice] = useState()
  const nav = useNavigate()
  const location = useLocation();
  const [farmTabIndex, setFarmTabIndex] = useState(location.pathname === '/farm/pools' ? 0 : 1)

  useEffect(() => {
    if (location.pathname === '/farm/pools') {
      setFarmTabIndex(0)
    } else {
      setFarmTabIndex(1)
    }
  }, [location]);

  useEffect(() => {
    if (!props.chain || props.chain === 'Solana') {
      return
    }

    const chain = chainSymbolMap[props.chain]()
    const blockExplorerUrl = chain.params.blockExplorerUrls[0]
    setBlockExplorerUrl(blockExplorerUrl)
  }, [props.chain])

  useEffect(() => {
    let pools = originPoolList.concat()
    if (sort === 0) {
      pools.sort((a, b) => {
        return new BigNumber(b.apy).gt(a.apy) ? 1 : -1
      })
    }
    if (sort === 1) {
      pools.sort((a, b) => {
        return new BigNumber(b.tvl).gt(a.tvl) ? 1 : -1
      })
    }
    if (sort === 2) {
      pools.sort((a, b) => {
        return new BigNumber(b.weight).gt(a.weight) ? 1 : -1
      })
    }
    pools = pools.filter(pool => {
      if (!symbolMap[pool.depositToken]) {
        return true
      }
      if (symbolMap[pool.depositToken].toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        return true
      }
      return false
    })
    setPoolList(pools)
  }, [sort, search, symbolMap, originPoolList])

  useEffect(() => {
    if (props.chain === 'Solana') {
      return
    }
    async function run() {
      setIsLoading(true)
      if (farmTabIndex === 0) {
        const res = await getDepositPoolViews(props.account || '0x0000000000000000000000000000000000000000')
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
          if (props.account) {
            allowance(item.depositToken, item.pool).call().then(allow => {
              setAllowanceMap(allowanceMap => {
                return {
                  ...allowanceMap,
                  [item.pool]: allow
                }
              })
            })
          } else {
            setAllowanceMap(allowanceMap => {
              return {
                ...allowanceMap,
                [item.pool]: 0
              }
            })
          }
        })
        setOriginPoolList(res)
      } else if (farmTabIndex === 1) {
        if (!props.account) {
          setIsLoading(false)
          setStakingList([])
          return
        }
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
        setStakingList(res)
      }
      setIsLoading(false)
    }
    run()
  }, [props.account, props.chain, farmTabIndex, reload])

  let toApprove = (currencyAddress, contractAddress) => {
    setApprovingMap(approvingMap => {
      return {
        ...approvingMap,
        [currencyAddress]: true
      }
    })
    approve(currencyAddress, contractAddress).then(res => {
      setAllowanceMap(allowanceMap => {
        return {
          ...allowanceMap,
          [contractAddress]: MaxUint256.toString()
        }
      })
      setApprovingMap(approvingMap => {
        return {
          ...approvingMap,
          [currencyAddress]: false
        }
      })
    }).catch(err => {
      setApprovingMap(approvingMap => {
        return {
          ...approvingMap,
          [currencyAddress]: false
        }
      })
    })
  }

  let toStake = () => {
    if(!props.account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description: t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setIsStaking(true)
    // setShowConfirm(true)
    stake(amount, stakeType === 0 ? 0 : lockUnits, activePool.pool).then(res => {
      // setShowConfirm(false)
      // setShowSuccess(true)
      setReload(reload => reload + 1)
      setShowStakeModal(false)
      setIsStaking(false)
    }).catch(err => {
      // setShowConfirm(false)
      setIsStaking(false)
    })
  }

  let toUnstake = (item) => {
    if(!props.account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description: t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setUnstakeLoadingMap(unstakeLoadingMap => {
      return {
        ...unstakeLoadingMap,
        [`${item.depositPool}-${item.depositId}`]: true
      }
    })
    unstake(item.depositId, item.depositPool).then(res => {
      setReload(reload => reload + 1)
      setUnstakeLoadingMap(unstakeLoadingMap => {
        return {
          ...unstakeLoadingMap,
          [`${item.depositPool}-${item.depositId}`]: false
        }
      })
    }).catch(err => {
      setUnstakeLoadingMap(unstakeLoadingMap => {
        return {
          ...unstakeLoadingMap,
          [`${item.depositPool}-${item.depositId}`]: false
        }
      })
    })
  }

  let showStake = async (item) => {
    setBalance(0)
    balanceOf(item.depositToken, props.account).then(balance => {
      setBalance(balance)
    })
    setActivePool(item)
    setShowStakeModal(true)
    const price = await queryPrice(item.depositToken)
    setPrice(price)
  }

  let showSolStake = (item) => {
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

  const handleSetAmount = (value) => {
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

  async function queryPrice(token) {
    //模拟数据, 因为当前无法得到token数据
    return UNIT;
  }

  function estApy() {
    if (!activePool) {
      return '--'
    }
    const amountValue = new BigNumber((amount ?? 0) * UNIT * (stakeType === 0 ? 1 : weight)).multipliedBy(price)
    let apy = amountValue
      .dividedBy(
        new BigNumber(activePool.tvl).plus(amountValue)).plus(1).multipliedBy(activePool.apy).dividedBy(UNIT)
    return apy.toFixed(2,1)
  }

  const poolColumns = [
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
      key: 'tvl',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">TVL</div>
            <div className="cell-value highlight">{accounting.formatMoney(new BigNumber(record.tvl).dividedBy(10 ** 18).toFixed(2, 1))}</div>
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
      key: 'weight',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Weight')}</div>
            <div className="cell-value">{new BigNumber(record.weight).dividedBy(10 ** 18).toFixed(2, 1)}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'rewards',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Rewards')}</div>
            <div className="cell-value">{new BigNumber(record.pendingRewards).dividedBy(10 ** 18).toFixed(2, 1)} <img src={tokenLogo0} alt="" className="token-logo" /></div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'liquidity',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('My Liquidity')}</div>
            <div className="cell-value">{new BigNumber(record.myDepoistAmount).dividedBy(10 ** 18).toFixed(2, 1)} <img src={busdLogo} alt="" className="token-logo" /></div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'op',
      align: 'right',
      render: (text, record) => {
        if (!props.connect) {
          return <Button className="btn-connect" style={{height: '40px'}} onClick={_ => showConnectWallet()}>{t('Connect Wallet')}</Button>
        }

        if (+allowanceMap[record.pool] > 0) {
          return <Button className="btn-stake" style={{height: '40px'}} onClick={_ => showStake(record)}>{t('Stake')}</Button>
        } else {
          return <Button className="btn-approve" style={{height: '40px'}} loading={approvingMap[record.depositToken]} onClick={_ => toApprove(record.depositToken, record.pool)}>{t('Approve')}</Button>
        }
      },
    },
  ]

  const stakingColumns = [
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
      key: 'unlocks',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Unlocks in')}</div>
            <div className="cell-value">{record.lockUnits === '0' ? 'UNLOCKED' : `${record.lockUnits} WEEKS`}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'liquidity',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('My Liquidity')}</div>
            <div className="cell-value">{new BigNumber(record.stakingAmount).dividedBy(10 ** 18).toFixed(2, 1)} <img src={busdLogo} alt="" className="token-logo" /></div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'op',
      align: 'right',
      render: (text, record) => {
        if (!props.connect) {
          return <Button className="btn-connect" onClick={_ => showConnectWallet()}>{t('Connect Wallet')}</Button>
        }

        if (record.lockUnits === '0') {
          return <Button className="btn-unstake" onClick={_ => toUnstake(record)} loading={unstakeLoadingMap[`${record.depositPool}-${record.depositId}`]}>{t('Unstake')}</Button>
        } else {
          return <Button className="btn-locked" disabled>{t('Locked')}</Button>
        }
      },
    },
  ]

  return (
    <div className="farm-farm fw500">
      <div className="farm-banner">
        {/* <img src={banner} alt="" className="banner-image" /> */}
        <div className="banner-content">
          <div className="banner-title">{t('You can')} <a>{t('stake in different pools')}</a> {t('and unstake from your staking')}</div>
          <div className="banner-subtitle">{t('All pools offer variable locking for 12 months')}</div>
        </div>
      </div>

      <div className="farm-content">
        <div className="farm-header">
          <div className="tab-list">
            <div className={classNames(["tab-item", {"active": farmTabIndex === 0}])} onClick={_ => nav('/farm/pools')}>{t('Pools')}</div>
            <div className={classNames(["tab-item", {"active": farmTabIndex === 1}])} onClick={_ => nav('/farm/mystaking')}>{t('My Staking')}</div>
          </div>
          {
            farmTabIndex === 0 ?
            <div className="filter-group ">
              <Search onChange={e => setSearch(e.target.value)}/>
              {/* <Select /> */}
              <Select onChange={value => setSort(value)} options={selectOptions}/>
            </div>
            : ''
          }
        </div>

        {
          farmTabIndex === 0 ?
          <div className="filter-group filter-group-mobile">
            <Search onChange={e => setSearch(e.target.value)}/>
            {/* <Select /> */}
            <Select onChange={value => setSort(value)} options={selectOptions} width="100%" />
          </div>
          : ''
        }
        
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
                  poolList.length ?
                    window.innerWidth >= 768 ?
                    <Table columns={poolColumns} dataSource={poolList} showHeader={false} pagination={false} rowKey={(record) => record.pool}/>
                    :
                    poolList.map(record => {
                      return (
                        <div className="farm-item" key={record.pool}>
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
                              if (!props.connect) {
                                return <Button className="btn-connect" onClick={_ => showConnectWallet()}>{t('Connect Wallet')}</Button>
                              }
  
                              if (+allowanceMap[record.pool] > 0) {
                                return <Button className="btn-stake" onClick={_ => showStake(record)}>{t('Stake')}</Button>
                              } else {
                                return <Button className="btn-approve" loading={approvingMap[record.depositToken]} onClick={_ => toApprove(record.depositToken, record.pool)}>{t('Approve')}</Button>
                              }
                            })()}
                          </div>
                          <div className="farm-item-body">
                            <div className="cell-item">
                              <div className="cell-title">TVL</div>
                              <div className="cell-value highlight">{accounting.formatMoney(new BigNumber(record.tvl).dividedBy(10 ** 18).toFixed(2, 1))}</div>
                            </div>

                            <div className="cell-item">
                              <div className="cell-title">APY</div>
                              <div className="cell-value highlight">{new BigNumber(record.apy).dividedBy(10 ** 18).toFixed(2, 1)}%</div>
                            </div>

                            <div className="cell-item">
                              <div className="cell-title">{t('Weight')}</div>
                              <div className="cell-value">{new BigNumber(record.weight).dividedBy(10 ** 18).toFixed(2, 1)}</div>
                            </div>

                            <div className="cell-item">
                              <div className="cell-title">{t('Rewards')}</div>
                              <div className="cell-value">{new BigNumber(record.pendingRewards).dividedBy(10 ** 18).toFixed(2, 1)} <img src={tokenLogo0} alt="" className="token-logo" /></div>
                            </div>

                            <div className="cell-item">
                              <div className="cell-title">{t('My Liquidity')}</div>
                              <div className="cell-value">{new BigNumber(record.myDepoistAmount).dividedBy(10 ** 18).toFixed(2, 1)} <img src={busdLogo} alt="" className="token-logo" /></div>
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
                  stakingList.length ?
                    window.innerWidth >= 768 ?
                      <Table columns={stakingColumns} dataSource={stakingList} showHeader={false} pagination={{pageSize: 20}} rowKey={(record) => record.depositPool+record.depositId}/>
                      :
                      stakingList.map(record => {
                        return (
                          <div className="farm-item" key={record.depositPool+record.depositId}>
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
                                if (!props.connect) {
                                  return <Button className="btn-connect" onClick={_ => showConnectWallet()}>{t('Connect Wallet')}</Button>
                                }

                                if (record.lockUnits === '0') {
                                  return <Button className="btn-unstake" onClick={_ => toUnstake(record)} loading={unstakeLoadingMap[`${record.depositPool}-${record.depositId}`]}>{t('Unstake')}</Button>
                                } else {
                                  return <Button className="btn-locked" disabled>{t('Locked')}</Button>
                                }
                              })()}
                            </div>
                            <div className="farm-item-body">
                              <div className="cell-item">
                                <div className="cell-title">APY</div>
                                <div className="cell-value highlight">{new BigNumber(record.apy).dividedBy(10 ** 18).toFixed(2, 1)}%</div>
                              </div>

                              <div className="cell-item">
                                <div className="cell-title">{t('Unlocks in')}</div>
                                <div className="cell-value">{record.lockUnits === '0' ? 'UNLOCKED' : `${record.lockUnits} WEEKS`}</div>
                              </div>

                              <div className="cell-item">
                                <div className="cell-title">{t('My Liquidity')}</div>
                                <div className="cell-value">{new BigNumber(record.stakingAmount).dividedBy(10 ** 18).toFixed(2, 1)} <img src={busdLogo} alt="" className="token-logo" /></div>
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

      <Modal width={window.innerWidth >= 768 ? 420 : 315} className="stake-modal" isVisible={showStakeModal} title={
        <div className="modal-title">
          <img src={tokenLogo0} alt="" className="token-logo" />
          {
            activePool ?
              symbolMap[activePool.depositToken] === 'KEPL-BUSD' ?
              <img src={busdLogo} alt="" className="token-logo2" />
              : ''
            : ''
          }
          <span className="token-name">
            {activePool ? symbolMap[activePool.depositToken] : ''}
          </span>
        </div>
      } onClose={() => setShowStakeModal(false)}>
        <div className="tab-list">
          <div className={classNames(["tab-item", {"active": stakeType === 0}])} onClick={_ => setStakeType(0)}>{t('Flexible')}</div>
          <div className={classNames(["tab-item", {"active": stakeType === 1}])} onClick={_ => setStakeType(1)}>{t('Locked')}</div>
        </div>
        {
          stakeType === 1 ?
          <div className="lock-units-slider">
            <div className="slider-label-wrapper">
              <div className="label">{t('Lock for')}: <span className="fw500 lock-units">{lockUnits} {t('WEEKS')}</span></div>
              <div className="m-l-auto flex"><div className="label">{t('Weight')}:</div><div className="fw500 value">{weight.toFixed(2)}</div></div>
            </div>
            <Slider max={52} min={1} value={lockUnits} onChange={(e) => {
              setLockUnits(e)
              setWeight(1+e/52)
            }} />
            <div className="range">
              <div className="min">1</div>
              <div className="max">52</div>
            </div>
          </div>
          : ''
        }
        <div className="label-wrapper">
          <div className="label">{t('Amount')}</div>
          <div className="m-l-auto flex"><div className="label">{t('Balance')}:</div><div className="fw500 value">{new BigNumber(balance).dividedBy(10 ** 18).toFixed(2, 1)}</div></div>
        </div>
        <Input type="text" placeholder="" className='my-input fz-16 m-t-10' suffix={
          <Button className="fw500 btn-max" onClick={_ => setAmount(new BigNumber(balance).dividedBy(10 ** 18).toFixed(2, 1))}>{t('Max')}</Button>
        } value={amount} onChange={(e) => handleSetAmount(e.target.value)} />
        {
          new BigNumber(amount).gt(new BigNumber(balance).dividedBy(10 ** 18)) ? (
              <div className="warning flex flex-center c14 p-t-10">
                <img src={require('../../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                  {t('Incorrect amount')}
              </div>
          ):''
        }
        <div className="fw500 m-t-20 apy-block">
          {t('Est APY')}: {estApy()}%
        </div>
        {
          stakeType === 1 ?
          <div className="warning flex flex-center c14 m-t-20 m-b-30">
            <img src={require('../../../assets/images/tips/tip.svg').default} alt="" className='m-r-10'/>
            {t('Locking your stake increases your pool weight by up to 2x')}
          </div>
          : ''
        }
        <Button loading={isStaking} className="m-t-30 fwb btn-stake" onClick={_ => toStake()} disabled={!+amount || new BigNumber(amount).gt(new BigNumber(balance).dividedBy(10 ** 18))}>{t('Stake')}</Button>
      </Modal>

      <Modal width={window.innerWidth >= 768 ? 420 : 315} className="unstake-modal" isVisible={showUnstakeModal} title={<div className="modal-title"><img src={tokenLogo0} alt="" className="token-logo" />KEPL</div>} onClose={() => setShowUnstakeModal(false)}>
        <div className='modal-content'>
          {/* <div className="fz-14 flex">
            <div className="label">Amount</div>
            <div className="m-l-auto flex"><div className="label">Unlocked:</div><div className="fw500 value">{new BigNumber(activeStaking?.stakingAmount).dividedBy(10 ** 18).toFixed(2, 1)}</div></div>
          </div>
          <Input placeholder="" className='my-input fz-16 m-t-10' suffix={
            <Button className="fw500 btn-max" onClick={_ => setUnstakeAmount(new BigNumber(activeStaking?.stakingAmount).dividedBy(10 ** 18).toFixed(2, 1))}>Max</Button>
          } value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} /> */}
          {/* {
            !isEmail ? (
                <div className="warning flex flex-center c14 p-t-10">
                    <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                    Incorrect email
                </div>
            ):''
          } */}
          <Button loading={isUnstaking} className="fwb btn-next" onClick={_ => toUnstake()}>{t('Unstake')}</Button>
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
  FarmEVM
);
