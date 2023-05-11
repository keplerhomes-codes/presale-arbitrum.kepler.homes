
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './index.scss'
import { useTranslation} from 'react-i18next'
import ConnectWalletModal from '../ConnectWalletModal'
import {connect} from 'react-redux'
import { Menu, Dropdown } from 'antd';
import connectWallet from '../../wallet/web3/connectWallet'
import {createProviderController} from '../../wallet/web3/createProviderController'
import store, {disconnect,setToConnectWallet, setToken, setUserInfo} from '../../store'
import notification from '../notification'
import { useWallet } from '@solana/wallet-adapter-react';
import {Link} from 'react-router-dom'
import { sign } from '../../contract/methods';
import { post,get } from '../../http';
import { ChainIdMap, showConnectWallet } from '../../lib/util';
import {useNavigate} from 'react-router-dom'
let chainIcon = {
  'eth': require('../../assets/images/ConnectWallet/ethereum.png'),
  'bsc': require('../../assets/images/ConnectWallet/binance.png'),
  'arbitrum': require('../../assets/images/ConnectWallet/arbitrum.jpg'),
  'avalanche': require('../../assets/images/ConnectWallet/avalanche.png'),
}

function ConnectWallet(props) {
  let { t ,i18n} = useTranslation()
  let nav = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [providerController, setProviderController] = useState({});
  const { disconnect: solDisconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (props.chainType === 'EVM') {
      setProviderController(createProviderController(props.chain));
      connectWallet();
    }
  }, [props.chainType]);

  const handleModalOk = () => {
    setIsModalVisible(false)
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
  }

  const copyAddress = useCallback(async () => {
    if (props.account) {
      await navigator.clipboard.writeText(props.account);
      // setCopied(true);
      setTimeout(() => setCopied(false), 400);
      notification.success({
        message: t('Copy finshed'),
      });
    }
  }, [props.account]);

  const handleDisconnect = () => {
    store.dispatch(disconnect(''))
      providerController.clearCachedProvider();
  }

  const handleConnectWallet = () => {
    showConnectWallet()
  }


  return (
    <div >
      {
        props.connect ?
        <Dropdown placement="bottom"  atip overlay={
          <Menu>
            <Menu.Item key="0" onClick={_ => {
                copyAddress()
              }}>
              <div className="menu-title fz-16 flex flex-center">
                 <img src={require('../../assets/images/ConnectWallet/copy.svg').default} alt="" className='m-r-10'/>
                {copied ? 'Copied' : 'Copy Address'}</div>
            </Menu.Item>
            <Menu.Item key="1" onClick={handleConnectWallet}>
              <div className="menu-title fz-16">
                
              <img src={require('../../assets/images/ConnectWallet/wallet.svg').default} alt="" className='m-r-10'/>
                Change Wallet</div>
            </Menu.Item>
            <Menu.Item key="4" onClick={_ => {
              handleDisconnect()
            }}>
              <div className="menu-title fz-16">
                
              <img src={require('../../assets/images/ConnectWallet/disconnect.svg').default} alt="" className='m-r-10'/>
                Disconnect</div>
            </Menu.Item>
          </Menu>
        }>
          <div className="fw500 connected-wallet p-r-10 p-l-10 flex flex-center">
            <div className="connected-chain">
              <img src={chainIcon['arbitrum']} alt="" className='bsc-iocn'/>
              </div>
            <div className="cf m-l-8 m-r-8">{props.account.substr(0, 5)+'...'+ props.account.substr(props.account.length-5,)}</div>
            <img src={require('../../assets/images/wallets/arrow1.svg').default} alt="" />
          </div>
        </Dropdown>
        :
        <div className="connect-wallet" onClick={handleConnectWallet}>{'Connect Wallet'}</div>
      }

      
    </div>
  )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  ConnectWallet
);
