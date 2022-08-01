import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Overview.scss'
import totalBurnedImage from '../../assets/images/farm/total-burned-image.png'
import token from '../../assets/images/farm/token1.png'
import { getDashboardView, balanceOf } from '../../contract/methods'
import accounting from 'accounting'
import { format } from 'date-fns'
import BigNumber from "bignumber.js";
import { Progress, Menu, Dropdown } from 'antd'
import iconOpenLink from '../../assets/images/farm/openLink.svg'
import iconLink from '../../assets/images/farm/link.svg'
import {NavLink, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import iconSwitchChain from '../../assets/images/farm/switch-chain.svg'
import iconTangle from '../../assets/images/base/tangle.svg'

import ethereum from '../../assets/images/ConnectWallet/ethereum.png'
import binance from '../../assets/images/ConnectWallet/binance.png'
import solana from '../../assets/images/ConnectWallet/solana.png'
import avalanche from '../../assets/images/ConnectWallet/avalanche.png'
import polygon from '../../assets/images/ConnectWallet/polygon.png'
import { get, post } from '../../http';
import ReactECharts from 'echarts-for-react'
import  * as echarts from 'echarts'
import {showLine, showK} from './chart'
import { formatHour, formatTime, formatDate } from '../../lib/util'
import classNames from 'classnames';
import iconKline from '../../assets/images/farm/iconKline.svg'
import iconKlineActive from '../../assets/images/farm/iconKline-active.svg'
import iconLine from '../../assets/images/farm/iconLine.svg'
import iconLineActive from '../../assets/images/farm/iconLine-active.svg'
import { useTranslation } from 'react-i18next'

const chainList = [{
  name: "Ethereum",
  symbol: "ETH",
  chainId: "5",
  fee: "0.001",
  icon: ethereum,
}, {
  name: "Binance",
  symbol: "BSC",
  chainId: "97",
  fee: "0.01",
  icon: binance,
}, {
  name: "Solana",
  symbol: "Solana",
  fee: "0.01",
  icon: solana,
  disabled: true,
}, {
  name: "Polygon",
  symbol: "Polygon",
  chainId: "80001",
  fee: "0.1",
  icon: polygon,
  disabled: true,
}, {
  name: "Avalanche",
  symbol: "Avalanche",
  chainId: "43113",
  fee: "0.01",
  icon: avalanche,
  disabled: true,
}]

function Overview (props) {
  const {t, i18n} = useTranslation()
  const [data, setData] = useState()
  let [options, setOption] = useState({})
  let [timeType, setTimeType] = useState(1)
  let [kType, setKtype] = useState('line')
  const [activeChain, setActiveChain] = useState(chainList.find(chain => chain.symbol === props.chain))

  useEffect(()=> {
    if (!props.chain) {
      return
    }
    const chain = chainList.find(chain => chain.symbol === props.chain)
    setActiveChain(chain)
  }, [props.chain])

  useEffect(() => {
    async function run() {
      const res = await getDashboardView()
      console.log(res)
      setData(res)

      // if (props.chain && props.account) {
      //   const address = getAddress(props.chain)['KEPL']
      //   balanceOf(address, props.account, props.chain).then(balance => {
      //     setFromBalance(balance)
      //   })
      // }
    }
    run()
  }, [])

  function fixedBigNumber(num) {
    if (num < 1000000) {
      return num.toFixed(2)
    } else {
      return (num / 10000).toFixed(2) + 'M'
    }
  }

  useEffect(()=> {
    getChart(97, 'KEPL_BUSD', timeType, kType, 'dark-theme')
  }, [timeType, kType])

  const getChart = async (chainId,symbol, type, kType, theme) => {
    let startTime = ''
    let endTime = Math.floor(new Date().getTime()/1000)
    let interval = ''
    switch (type) {
      case 1:
        startTime = Math.floor(new Date(new Date().getTime() - 24*60*60*1000).getTime()/1000).toString()
        interval = '5m'
        break;
      case 2:
        startTime = Math.floor(new Date(new Date().getTime() - 7*24*60*60*1000).getTime()/1000).toString();
        interval = '5m'
        break;
      case 3:
        startTime = Math.floor(new Date(new Date().getTime() - 30*24*60*60*1000).getTime()/1000).toString()
        interval = '5m'
        break;
      case 4:
        startTime = '0'
        interval = '5m'
        break;
      case 5:
        startTime = Math.floor(new Date(new Date().getTime() - 250*60*1000).getTime()/1000).toString()
        interval = '5m'
        break;
      case 6:
        startTime = Math.floor(new Date(new Date().getTime() - 15*50*60*1000).getTime()/1000).toString()
        interval = '15m'
        break;
      case 7:
        startTime = Math.floor(new Date(new Date().getTime() - 30*50*60*1000).getTime()/1000).toString()
        interval = '30m'
        break;
      case 8:
        startTime = Math.floor(new Date(new Date().getTime() - 60*50*60*1000).getTime()/1000).toString()
        interval = '1h'
        break;
      case 9:
        startTime = Math.floor(new Date(new Date().getTime() - 240*50*60*1000).getTime()/1000).toString()
        interval = '4h'
        break;
      case 10:
        startTime = Math.floor(new Date(new Date().getTime() - 24*60*50*60*1000).getTime()/1000).toString()
        interval = '1d'
        break;
      case 11:
        startTime = Math.floor(new Date(new Date().getTime() - 7*24*60*50*60*1000).getTime()/1000).toString()
        interval = '1w'
        break;
      default:
        startTime = Math.floor(new Date(new Date().getTime() - 24*60*60*1000).getTime()/1000).toString()
        interval = '5m'
        break;
    }
    // setShowLoading(true)
    let res = (await get(`/api/kline?chainId=${chainId}&symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`))
    let xaxis = []
    let yaxis = []
    let data = res.data || [{
      close: 0,
      open: 0,
      low: 0,
      high: 0
    }]
    data.map(item => {
      xaxis.push(formatTime(item.swapTime))
      kType === 'line' ? yaxis.push(item.close.toFixed(4)): yaxis.push([item.open.toFixed(4), item.close.toFixed(4), item.low.toFixed(4), item.high.toFixed(4)])      
    })
    setOption(kType === 'k' ? showK(symbol, xaxis, yaxis, type): showLine(symbol, xaxis, yaxis, echarts, theme === 'light-theme' ?'#EEF1FC':'#1D1D22', type, type === 1 ? false : yaxis[yaxis.length -1] >= yaxis[0]))

    // setCurrentPrice(data[data.length - 1].close)
    // setupDown(Number(((data[data.length -1].close - data[0].close)*100/data[0].close).toFixed(2)))
    // setShowLoading(false)
  }

  return (
    <div className="farm-overview fw500">
      <div className="farm-overview-content">
        <div className="flex">
          <div className="flex-2">
            <div className="card card-kline">
              <div className="card-header">
                <Dropdown placement={window.innerWidth >= 768 ? "bottom" : "bottomLeft"}  atip overlay={
                  <Menu className="farm-overview-token-dropdown-menu">
                    <Menu.Item key="0" onClick={_ => {
                      }}>
                      <div className="token-option fw500 flex flex-center"><img src={token} alt="" className="token-logo" /><span>KEPL / USD</span></div>
                    </Menu.Item>
                    <Menu.Item key="0" onClick={_ => {
                      }}>
                      <div className="token-option fw500 flex flex-center"><img src={token} alt="" className="token-logo" /><span>KEME / USD</span></div>
                    </Menu.Item>
                  </Menu>
                }>
                  <div className="card-title flex flex-center"><img src={token} alt="" className="token-logo" /><span>KEPL / USD</span><img className="icon-tangle" src={iconTangle} alt="" /></div>
                </Dropdown>
                <div className="is-hidden-mobile">
                  <div className="pair-info ">
                    <div className="price">1.6521</div><div className="pair">KEPL / USD</div><div className="change">1.915 (-5.80%)</div>
                  </div>
                </div>
                <Dropdown placement={window.innerWidth >= 768 ? "bottom" : "bottomRight"}  atip overlay={
                  <Menu className="farm-overview-chain-dropdown-menu">
                  {
                    chainList.map((chain) => {
                      return (
                        <Menu.Item key={chain.symbol} disabled={chain.disabled} onClick={_ => {
                          }}>
                          <div className="chain-option fw500 flex flex-center" onClick={_ => {
                          }}>
                            <img src={chain.icon} alt="" className="chain-icon" />
                            <div className="fw500 chain-name">{chain.name}</div>
                          </div>
                        </Menu.Item>
                      )
                    })
                  }
                  </Menu>
                }>
                  <div className="switch-chain"><img className="chain-icon" src={activeChain.icon} alt="" /><span  className="fz-14 fw500">{activeChain.symbol}</span><img className="icon-tangle" src={iconTangle} alt="" /></div>
                </Dropdown>
              </div>

              <div className="card-content">
                <div className="kline-header m-t-25">
                  <div className="is-hidden-desktop">
                    <div className="pair-info">
                      <div className="price">1.6521</div><div className="pair">KEPL / USD</div><div className="change">1.915 (-5.80%)</div>
                    </div>
                  </div>
                  <div className="timestamp is-hidden-desktop">{format(new Date(), 'LLL d, yyyy, hh:mm a')}</div>
                  <div className="kline-selector">
                    <div className="ktype-group">
                      <div className={classNames(["ktype", {"active": kType === 'line'}])} onClick={_ => {setKtype('line');setTimeType(1)}}>
                        <img className="ktype-image-line" src={kType === 'line' ? iconLineActive : iconLine} alt="" />
                      </div>
                      <div className={classNames(["ktype", {"active": kType === 'k'}])} onClick={_ => {setKtype('k');setTimeType(5)}}>
                        <img className="ktype-image-k" src={kType === 'k' ? iconKlineActive : iconKline} alt="" />
                      </div>
                    </div>

                    <div className="range-group">
                      {
                        kType === 'line' ?
                        <>
                          <div className={classNames(["range-item", {"active": timeType === 1}])} onClick={ev => {setTimeType(1)}}>1D</div>
                          <div className={classNames(["range-item", {"active": timeType === 2}])} onClick={ev => {setTimeType(2)}}>1W</div>
                          <div className={classNames(["range-item", {"active": timeType === 3}])} onClick={ev => {setTimeType(3)}}>1M</div>
                          <div className={classNames(["range-item", {"active": timeType === 4}])} onClick={ev => {setTimeType(4)}}>All</div>
                        </>
                        :
                        <>
                          <div className={classNames(["range-item", {"active": timeType === 5}])} onClick={ev => {setTimeType(5)}}>5m</div>
                          <div className={classNames(["range-item", {"active": timeType === 6}])} onClick={ev => {setTimeType(6)}}>15m</div>
                          <div className={classNames(["range-item", {"active": timeType === 7}])} onClick={ev => {setTimeType(7)}}>30m</div>
                          <div className={classNames(["range-item", {"active": timeType === 8}])} onClick={ev => {setTimeType(8)}}>1H</div>
                          <div className={classNames(["range-item", {"active": timeType === 9}])} onClick={ev => {setTimeType(9)}}>4H</div>
                          <div className={classNames(["range-item", {"active": timeType === 10}])} onClick={ev => {setTimeType(10)}}>1D</div>
                          <div className={classNames(["range-item", {"active": timeType === 11}])} onClick={ev => {setTimeType(11)}}>1W</div>
                        </>
                      }
                    </div>
                  </div>
                  <div className="timestamp is-hidden-mobile">{format(new Date(), 'LLL d, yyyy, hh:mm a')}</div>
                </div>
                <div className="kline-chart">
                  <ReactECharts option={options} style={{width: '100%',height: window.innerWidth >= 768 ? '350px' : '250px'}}/>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-column flex-1">
            <div className="card card-balance">
              <div className="card-title">{t('My KEPL Balance')}</div>
              <div className="card-content">
                <div className="token-balance m-t-25">
                  <div className="balance">{accounting.formatNumber(new BigNumber(data?.keplBalance).dividedBy(10 ** 18).toString(), 2)}</div><div className="unit">KEPL</div>
                </div>
                <div className="fiat-balance">≈ {accounting.formatMoney(new BigNumber(data?.keplBalanceValue).dividedBy(10 ** 18).toString())}</div>
              </div>
            </div>
            <div className="card card-staked">
              <div className="card-title m-b-6">{t('Total Amount Staked')}</div>
              <div className="card-subtitle">{format(new Date(), 'LLL d, yyyy, hh:mm a')}</div>
              <div className="staked-value">{accounting.formatMoney(new BigNumber(data?.totalStakedValue).dividedBy(10 ** 18).toString())}</div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div className="card card-rewards">
              <div className="card-header">
                <div className="card-title">{t('Rewards')}</div>
                <NavLink to="/farm/rewards" className="rewards-link">{t('Go to Rewards')}</NavLink>
              </div>

              <div className="rewards-title">{t('Total Pending Rewards')}</div>

              <div className="token-balance m-t-15">
                <div className="balance">{accounting.formatNumber(new BigNumber(data?.totalPendingRewards).dividedBy(10 ** 18), 2)}</div><div className="unit">KEPL</div>
              </div>
              <div className="fiat-balance">≈ {accounting.formatMoney(new BigNumber(data?.totalPendingRewardsValue).dividedBy(10 ** 18).toString())}</div>

              <NavLink to="/farm/rewards" className="btn-rewards m-t-75">{t('Go to Rewards')}</NavLink>
            </div>
          </div>
          <div className="flex-1">
            <div className="card card-kepe-rewards">
              <div className="card-title m-b-6">{t('KEPL Rewards')}</div>
              <div className="card-subtitle">{t('KEPL VALUE')}: {accounting.formatMoney(new BigNumber(data?.totalDistributedValue).dividedBy(10 ** 18).toString())}</div>
              <div className="card-progress">
                <Progress
                  type="circle"
                  strokeColor={{
                    '0%': '#3B3AD0',
                    '100%': '#FC7500',
                  }}
                  trailColor="rgba(216, 216, 216, 0.1)"
                  width={window.innerWidth >= 768 ? 250 : 190}
                  percent={new BigNumber(data?.totalDistributed).dividedBy(new BigNumber('153600000').multipliedBy(10 ** 18)).multipliedBy(100).toNumber()}
                  format={percent => {
                    return (
                      <div className="flex flex-center flex-middle flex-column">
                        <div className="fw500 progress-title">{t('Total Distributed')}</div>
                        <div className="fw500 progress-value">{fixedBigNumber(new BigNumber(data?.totalDistributed).dividedBy(10 ** 18).toNumber())}</div>
                      </div>
                    )
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="card card-burned">
              <div className="card-header">
                <div className="card-title">{t('Kepler Info')}</div>
                <a className="open-link" target="_blank" href="https://docs.kepler.homes/"><img className="icon-link" src={iconLink} alt="" /><span className="fw500">{t('Docs')}</span><img className="icon-open-link" src={iconOpenLink} alt="" /></a>
              </div>
              <div className="card-content">
                <div className="info-item">
                  <div className="info-item-label">{t('Total Burned')}</div>
                  <div className="fw500 info-item-value">15,472</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">{t('Kepler Total')}</div>
                  <div className="fw500 info-item-value">21,289,288.34</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">{t('Circulation')}</div>
                  <div className="fw500 info-item-value">34,869,939.45</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">{t('Market Cap')}</div>
                  <div className="fw500 info-item-value">$112,061,377.21</div>
                </div>
              </div>
            </div>
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
)(
  Overview
);
