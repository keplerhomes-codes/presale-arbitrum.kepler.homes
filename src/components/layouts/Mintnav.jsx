import React, { useState, useEffect, useRef, useCallback} from 'react';
import {Tooltip} from 'antd'
import iconMenu from '../../assets/images/home/icon-menu.svg'
import { Menu, Dropdown } from 'antd';
import iconArrow from '../../assets/images/home/icon-arrow.svg'
// import logo from '../../assets/images/home/logo.svg'
import iconLanguage from '../../assets/images/home/icon-language.svg'
import iconDownload from '../../assets/images/home/icon-download.svg'
import logo from '../../assets/images/nav/logo.svg'
import menu from '../../assets/images/nav/menu.svg'
import classnames from 'classnames'
import './Mintnav.scss'
import { useTranslation} from 'react-i18next'
import ConnectWallet from '../ConnectWallet';
import Login from '../Login';
import Menumint from './Menumint'
import {connect, useSelector} from 'react-redux'
import notification from '../../components/notification';

import Bus from '../../lib/eventBus'
import { NavLink } from 'react-router-dom';

function Header(props) {
  let { t ,i18n} = useTranslation()
  let language = i18n.language.split('-')[0]
  let [hasBg, setBg] = useState(false)
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false)
  
  let [isFold, setFold] = useState(false)


  const handleConnectWalletOk = () => {
    setIsConnectWalletVisible(false)
  }

  const handleConnectCancel = () => {
    setIsConnectWalletVisible(false)
  }

  const handleConnectWallet = () => {
    setIsConnectWalletVisible(true)
  }
  const copyAddress = useCallback(async () => {
    if(!props.account) {
      notification.error({
          message: t('Please connect your wallet first')
        });
        return
     }
    await navigator.clipboard.writeText('https://'+window.location.host+'/nft-mint?address='+props.account);
    notification.success({
      message: t('The invitation link has been copied. Please paste it to your friends!'),
    });
  }, [props.account]);
  useEffect(()=> {
    window.addEventListener('scroll', function() {
      if(document.documentElement.scrollTop > 0) {
        setBg(true)
      } else {
        setBg(false)
      }
    })
  }, [])

  
  let foldfn = () => {
    Bus.emit('foldChange', !isFold);
}

useEffect(() => {
    Bus.addListener('foldChange', (isfold) => {
        setFold(isfold)
    });
}, [])

  

  return (
    <div>
    <div className={classnames(["mint-header flex flex-between", {"has-bg": hasBg}])}>
     <div className="logo-wrap flex flex-center flex-middle flex-between logo-wrap-fold" >
         {/* <a href="/" className='logo'> */}
           <img src={logo} alt="" className='logo'/>
           {/* </a> */}
            <div className="nav-item cf fz-16  m-l-60">
              <NavLink className="" to="/nft-mint">
                NFT-Mint
              </NavLink>
            </div>
            <div className="nav-item cf fz-16 m-l-40">
              <NavLink className="" to="/nft-whitelist">
                  NFT-WhiteList
              </NavLink>
            </div>
            {/* <Tooltip color="#E07D26" title="Recommenders can get KEPL token reward of 5% of NFT Mint amount.">
            <div className="nav-item cf  fz-18 m-l-40 pointer" onClick={copyAddress}>
                  Invite Friends
            </div>
            </Tooltip>
            
            <a className="nav-item cf  fz-18 m-l-40" target="_blank" href="/profile?tab=rewards">
                  My Invite Rewards
                  <span className="comingsoon m-t-3"><img src={require('../../assets/images/base/soon.svg').default} alt="" /></span>
            </a> */}
            <div className="mobile-menu" onClick={foldfn}>
                <img src={iconMenu} alt="" />
            </div>

      </div>
      <div className="header-right">
        <div className="icon-list">
          <Login/>
        </div>
        <ConnectWallet isVisible={isConnectWalletVisible} handleOk={handleConnectWalletOk} handleCancel={handleConnectCancel} />

      </div>
    </div>
      <div className="show-m">
        <Menumint></Menumint>
      </div>
    </div>
  )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Header
);

