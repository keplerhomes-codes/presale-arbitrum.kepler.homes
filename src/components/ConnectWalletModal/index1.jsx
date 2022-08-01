import React, { useState, useEffect, useRef, useMemo } from 'react';
import './index.scss'
import { Modal } from 'antd';
import classnames from 'classnames'
import { CloseOutlined } from '@ant-design/icons';
import ethereum from '../../assets/images/ConnectWallet/ethereum.png'
import binance from '../../assets/images/ConnectWallet/binance.png'
import solana from '../../assets/images/ConnectWallet/solana.png'
import avalanche from '../../assets/images/ConnectWallet/avalanche.png'
import polygon from '../../assets/images/ConnectWallet/polygon.png'
import metamask from '../../assets/images/wallets/metamask.png'
import walletconnect from '../../assets/images/wallets/walletconnect.png'
import binanceChain from '../../assets/images/wallets/binance-chain.png'
import math from '../../assets/images/wallets/math.png'
import onto from '../../assets/images/wallets/onto.png'
import coin98 from '../../assets/images/wallets/coin98.png'
import ledger from '../../assets/images/wallets/ledger.png'
import solflare from '../../assets/images/wallets/solflare.png'
import sollet from '../../assets/images/wallets/sollet.png'
import {createProviderController} from '../../wallet/web3/createProviderController'
import connectWallet from '../../wallet/web3/connectWallet'
import checkboxUncheck from '../../assets/images/ConnectWallet/checkbox-uncheck.svg'
import checkboxChecked from '../../assets/images/ConnectWallet/checkbox-checked.svg'
import {connect as reducxConnect} from 'react-redux'
import {setChain,setconnect, connect, disconnect} from '../../store'
import { useWallet } from '@solana/wallet-adapter-react';

function ConnectWalletModal(props) {
  const [selectChain, setSelectChain] = useState(props.chain)
  const [isCheck, setIsCheck] = useState(true)
  const { wallets: solWallets, select: solSelect, connect: solConnect, disconnect: solDisconnect, publicKey: solPublicKey, wallet: solWallet } = useWallet();
  const [solConnecting, setSolConnecting] = useState(false)

  const handleConnect = async (id) => {
    if (props.connect && props.chain === 'Solana') {
      props.dispatch(disconnect(''))
      solDisconnect()
    }

    console.log(selectChain)
    const provider = await createProviderController(selectChain).connectTo(id)
    localStorage.setItem('kepler_chain', selectChain)
    props.dispatch(setChain(selectChain))
    connectWallet(provider)
    props.handleOk()
  }

  const handleSolanaConnect = async (walletName) => {
    if (props.connect && props.chain !== 'Solana') {
      props.dispatch(disconnect(''))
      createProviderController(props.chain).clearCachedProvider();
    }

    setSolConnecting(true)
    solSelect(walletName);
  }

  useEffect(async () => {
    if (selectChain === 'Solana' && solWallet && solConnecting) {
      props.dispatch(setconnect('1'))
      props.handleOk()
      try {
        await solConnect()
        props.dispatch(setChain(selectChain))
        localStorage.setItem('kepler_chain', selectChain)
      } catch(e) {
        console.log(e)
      } finally {
        setSolConnecting(false)
      }
    }
  }, [selectChain, solWallet, solConnecting])

  useEffect(() => {
    if (props.chain === 'Solana' && solPublicKey) {
      const address = solPublicKey?.toBase58()
      props.dispatch(connect(address))
      props.dispatch(setconnect(''))
    }
  }, [props.chain, solPublicKey])

  useEffect(() => {
    setSelectChain(props.connectWalletChain)
  }, [props.connectWalletChain])

  return (
    <Modal visible={props.isVisible} onOk={props.handleOk} onCancel={props.handleCancel} closable={false} footer={false} className="connect-wallet-modal">
      <div className="connect-wallet-modal-header">
        <div className="modal-title">
          <h2 className="fw500">Connect to a wallet</h2>
          <div className="modal-close" onClick={props.handleCancel}><CloseOutlined /></div>
        </div>
        {/* <div className="fw500 thermofservice-checkbox"><img className="checkbox" src={isCheck ? checkboxChecked : checkboxUncheck} alt=""  onClick={_ => setIsCheck(!isCheck)} /><div>I have read, understand, and agree to the <a className="highlight">Terms of Service</a>.</div></div> */}
      </div>
      <div className={classnames(["wallet-choose", {"disabled": !isCheck}])}>
        <h3 className="fw500 wallet-choose-title">Step1: Choose Network</h3>
        <div className="chain-list">
          <div className={classnames(["chain-item", {"active": selectChain === 'ETH'}])} onClick={_ => {
            setSelectChain('ETH')
          }}>
            <div className="chain-image">
              <img src={ethereum} alt="ethereum" />
            </div>
            <div className="chain-name">Ethereum</div>
          </div>
          <div className={classnames(["chain-item", {"active": selectChain === 'BSC'}])} onClick={_ => {
            setSelectChain('BSC')
          }}>
            <div className="chain-image">
              <img src={binance} alt="ethereum" />
            </div>
            <div className="chain-name">Binance</div>
          </div>
          <div className={classnames(["chain-item", {"active": selectChain === 'Solana'}])} onClick={_ => {
            setSelectChain('Solana')
          }}>
            <div className="chain-image">
              <img src={solana} alt="ethereum" />
            </div>
            <div className="chain-name">Solana</div>
          </div>
          <div className={classnames(["chain-item", {"active": selectChain === 'Avalanche'}])} onClick={_ => {
            setSelectChain('Avalanche')
          }}>
            <div className="chain-image">
              <img src={avalanche} alt="ethereum" />
            </div>
            <div className="chain-name">Avalanche</div>
          </div>
          <div className={classnames(["chain-item", {"active": selectChain === 'Polygon'}])} onClick={_ => {
            setSelectChain('Polygon')
          }}>
            <div className="chain-image">
              <img src={polygon} alt="ethereum" />
            </div>
            <div className="chain-name">Polygon</div>
          </div>
        </div>
        <h3 className="fw500 wallet-choose-title">Step2: Choose Wallet</h3>
        <div className="wallet-list">
          {
            selectChain !== 'Solana' ?
            <>
              <div className="wallet-item" onClick={async _ => {
                handleConnect('injected')
              }}>
                <img src={metamask} alt="metamask" className="wallet-image" />
                <div className="wallet-name">MetaMask</div>
              </div>
              <div className="wallet-item" onClick={async _ => {
                handleConnect('walletconnect')
              }}>
                <img src={walletconnect} alt="walletconnect" className="wallet-image" />
                <div className="wallet-name">WalletConnect</div>
              </div>
              <div className="wallet-item" onClick={async _ => {
                handleConnect('custom-binance')
              }}>
                <img src={binanceChain} alt="binanceChain" className="wallet-image" />
                <div className="wallet-name">Binance Chain</div>
              </div>
              <div className="wallet-item" onClick={async _ => {
                handleConnect('custom-math')
              }}>
                <img src={math} alt="math" className="wallet-image" />
                <div className="wallet-name">Math</div>
              </div>
              <div className="wallet-item" onClick={async _ => {
                handleConnect('custom-onto')
              }}>
                <img src={onto} alt="onto" className="wallet-image" />
                <div className="wallet-name">ONTO</div>
              </div>
              <div className="wallet-item" onClick={async _ => {
                handleConnect('custom-coin')
              }}>
                <img src={coin98} alt="coin98" className="wallet-image" />
                <div className="wallet-name">Coin98</div>
              </div>
            </>
            :
            selectChain === 'Solana' ?
            <>
              {solWallets.map(wallet => {
                return (
                  <div className="wallet-item sol-wallet-item" key={wallet.adapter.name} onClick={async _ => {
                    handleSolanaConnect(wallet.adapter.name)
                  }}>
                    <div className="wallet-image-wrapper">
                      <img src={
                        wallet.adapter.name === 'Ledger' ?
                        ledger
                        :
                        wallet.adapter.name === 'Sollet' ?
                        sollet
                        :
                        wallet.adapter.name === 'Solflare' ?
                        solflare
                        :
                        wallet.adapter.icon
                      } alt={`${wallet.adapter.name} icon`} className="wallet-image" />
                    </div>
                    <div className="wallet-name">{wallet.adapter.name}</div>
                  </div>
                )
              })}
            </>
            : ''
          }
          
        </div>
      </div>
    </Modal>
  )
}

export default reducxConnect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  ConnectWalletModal
);