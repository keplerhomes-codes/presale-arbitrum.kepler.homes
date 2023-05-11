
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
import { ChainIdMap } from '../../lib/util';
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
    if (props.chainType === 'Solana') {
      store.dispatch(disconnect(''))
      solDisconnect()
    } else {
      store.dispatch(disconnect(''))
      providerController.clearCachedProvider();
    }
  }

  const handleConnectWallet = () => {
    setIsModalVisible(true)
  }
  const Login = async() => {
    try {
      if(localStorage.getItem('token')) {
        return
      }
      let signature = await sign('login')
      post('/api/account/connect', {
        chainId: ChainIdMap[localStorage.getItem('kepler_chain')||'Arbitrum'],
        user: props.account,
        signature
      }).then(res => {
        props.dispatch(setToken(res.data.token))
        // get person info
        get('/api/v1/account').then(res => {
          store.dispatch(setUserInfo(res.data))
          // nav('/profile?tab='+index)
        })
      }).catch(err => {
        handleDisconnect()
        notification.error({
          message: t('Login Fail'),
          description: t('Please sign login at first')
      });
      })
    } catch {
      handleDisconnect()
      notification.error({
        message: t('Login Fail'),
        description: t('Please sign login at first')
    });
    }
  }
  const toUser = async () => {
    if(props.token) {
      // nav('/profile?tab='+)
      return
    } else {
      Login()
    }
  }

  useEffect(()=>{
    if(props.notdispatch) {
      return
    }
    if(props.showConnectWallet) {
      setIsModalVisible(true)
    }
  }, [props.showConnectWallet])

  useEffect(()=>{
    if(props.notdispatch) {
      return
    }
    store.dispatch(setToConnectWallet(isModalVisible))
  }, [isModalVisible])

  useEffect(()=> {
    if(props.account) {
      toUser()
    }
  } ,[props.account])

  return (
    <div style={{display: 'none'}}>
      <ConnectWalletModal isVisible={isModalVisible} hideChain={props.hideChain||[]} handleOk={handleModalOk} handleCancel={handleModalCancel} />
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
