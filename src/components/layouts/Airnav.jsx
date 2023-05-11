import React, { useState, useEffect, useCallback} from 'react';
import {Drawer, Tooltip} from 'antd'
// import logo from '../../assets/images/home/logo.svg'
import lines from '../../assets/images/nav/lines.svg'
import logo from '../../assets/images/nav/logo.svg'
import classnames from 'classnames'
import './Airnav.scss'
import { useTranslation} from 'react-i18next'
import ConnectWallet from '../ConnectWalletUi';
import {connect} from 'react-redux'
import notification from '../notification'

import Bus from '../../lib/eventBus'
import { NavLink } from 'react-router-dom';
import { sign } from '../../contract/methods/mint';
import { post,get} from '../../http';
import { ChainIdMap } from '../../lib/util';
import store, { setToken, setUserInfo} from '../../store';
import {Button} from 'antd'

let communityList = [{
    name: 'twitter',
    icon: require('../../assets/images/airdrop/twitter.svg').default,
    activeIcon: require('../../assets/images/airdrop/twitter_active.svg').default,
    link: 'https://twitter.com/KeplerHomes'
  },
  {
    name: 'telegram',
    icon: require('../../assets/images/airdrop/telegram.svg').default,
    activeIcon: require('../../assets/images/airdrop/telegram_active.svg').default,
    link: 'https://t.me/KeplerHomes'
  },
  {
    name: 'discord',
    icon: require('../../assets/images/airdrop/discord.svg').default,
    activeIcon: require('../../assets/images/airdrop/discord_active.svg').default,
    link: 'https://discord.gg/keplerhomes'
  },
  {
    name: 'medium',
    icon: require('../../assets/images/airdrop/medium.svg').default,
    activeIcon: require('../../assets/images/airdrop/medium_active.svg').default,
    link: 'https://medium.com/@KeplerHomes'
  }

]

function Header(props) {
  let { t ,i18n} = useTranslation()
  let language = i18n.language.split('-')[0]
  let [hasBg, setBg] = useState(false)
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false)
  
  let [open, setOpen] = useState(false)
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
    await navigator.clipboard.writeText('https://'+window.location.host+'?code='+props.account);
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

const Login = async() => {
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
// useEffect(() => {
//   console.log(props)
//    if(props.account && !props.token && props.isFirst) {
//     store.dispatch(setFirst(false))
//     Login()
//    }

// }, [props.account, props.token, props.isFirst])

  

  return (
    <div>
    <div className={classnames(["airdrop-header flex flex-between", {"has-bg": hasBg}])}>
     <div className="logo-wrap flex flex-center flex-middle flex-between logo-wrap-fold" >
         {/* <a href="/" className='logo'> */}
           <img src={logo} alt="" className='logo'/>
            <a className="nav-item cf  fz-16 m-l-40 islink" target="_blank" href="https://kepler.homes">
                    Home
              </a>
              <NavLink className="nav-item cf  fz-16 m-l-40 islink" to="/">
                 Presale
              </NavLink>
              <a className="nav-item cf  fz-16 m-l-40 islink" href="https://passport-arbitrum.kepler.homes" target="_blank">
                    {/* <img src={require('../../assets/images/token/Aptos.png')} alt="" style={{width: 20}} className="m-r-5"/> */}
                   Whitelist
              </a>

               {/*<a className="nav-item cf  fz-16 m-l-40 islink" href="https://presale-bsc.kepler.homes" target="_blank">
                    <img src={require('../../assets/images/ConnectWallet/binance.png')} alt="" style={{width: 20}} className="m-r-5"/>
                   BSC Presale
              </a> */}
      </div>
      <div className="header-right">
        {/* <a href="https://nft-mint.kepler.homes" target="_blank">
          <Button className='mint-btn cf fz-16'>NFT-Mint</Button>
        </a> */}
        <span className="flex flex-center ">
        <Button className='invite-btn m-l-12 cf fz-16' onClick={copyAddress}>Invite friends</Button>
        <Tooltip title="Holders whose KEPL asset is over $500 could get a referral bonus by inviting others.">
                                        <span>
                                        <img className='m-l-3' src={require('../../assets/images/passport/question.svg').default} alt="" />
                                        </span>
                                </Tooltip>
        </span>

      <div className='connect'>
        <ConnectWallet hideChain={['ETH','Avalanche', 'Polygon', 'Solana' ,'BSC']} isVisible={isConnectWalletVisible} handleOk={handleConnectWalletOk} handleCancel={handleConnectCancel} />
      </div>
      </div>
      <div className="m-r-20" onClick={() => setOpen(true)}>
        <img src={lines} alt="" className='show-m'/>
      </div>
    </div>
    <Drawer closable={false} title={<img src={logo} alt="" className='logo' />} placement="right" onClose={() => { setOpen(false) }} visible={open}>
    <a className="nav-item cf fwb  fz-16 m-l-20 m-b-20 islink"  target="_blank" href="https://kepler.homes">
                      Home
                    </a>
                    <NavLink className="nav-item cf fwb  fz-16 m-l-20 m-b-20 islink" to={'/'} >
                    Presale
                    </NavLink>
                    <a className="nav-item cf fwb  fz-16 m-l-20 m-b-20 islink"  target="_blank" href="https://passport-arbitrum.kepler.homes">
                    Whitelist
                    </a>
    <div className='m-t-60'>
            <div className='connect'>
            <ConnectWallet hideChain={['BSC', 'Avalanche', 'Polygon', 'Solana']} isVisible={isConnectWalletVisible} handleOk={handleConnectWalletOk} handleCancel={handleConnectCancel} />
            </div>
          </div>
    </Drawer>

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

