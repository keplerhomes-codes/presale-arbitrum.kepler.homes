import React, { useState, useEffect, useRef } from 'react';
// import Tooltip from 'rc-tooltip'
// import 'rc-tooltip/assets/bootstrap.css'
import iconMenu from '../../assets/images/home/icon-menu.svg'
import { Menu, Dropdown, Tooltip } from 'antd';
import iconArrow from '../../assets/images/home/icon-arrow.svg'
import logo from '../../assets/images/home/logo.svg'
import iconProfile from '../../assets/images/home/icon-profile.svg'
import iconLanguage from '../../assets/images/home/icon-language.svg'
import iconDownload from '../../assets/images/home/icon-download.png'
import arrow from '../../assets/images/header/arrow.svg'
import classnames from 'classnames'
import './Header.scss'
import { useTranslation} from 'react-i18next'
import {connect, useSelector} from 'react-redux'
import ConnectWallet from '../ConnectWallet';
import Login from '../Login';
import {NavLink, Link} from 'react-router-dom'
import MobileMenu from './Menu'
import Bus from '../../lib/eventBus'
import { showLogin } from '../../lib/util'

function Header(props) {
  let { t ,i18n} = useTranslation()
  let language = i18n.language.split('-')[0]
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  let marketlinks = [
    {
      title: 'NFT Mint',
      link: '/nft-mint',
      isoutlink: false,
      desc: 'Get your first Kepler metaverse NFT',
      disabled: false,
      icon: require('../../assets/images/header/origin.svg').default
    },
    {
      title: 'MarketPlace',
      link: '/market',
      desc: 'Kepler planet’s trade market',
      disabled: false,
      icon: require('../../assets/images/header/marketplace.svg').default
    },
    {
      title: 'Lands',
      link: '/lands',
      desc: 'Mint your land on planet Kepler',
      disabled: true,
      icon: require('../../assets/images/header/lands.svg').default
    },
    {
      title: 'My NFT',
      link: '/mynft',
      desc: 'Manage your NFTs',
      disabled: false,
      icon: require('../../assets/images/header/mynft.svg').default
    }
  ]
  let exchangeLinks = [
    {
      title: 'Uniswap',
      link: 'https://app.uniswap.org/#/swap',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/uniswap.svg').default
    },
    {
      title: 'Pancake',
      link: 'https://pancakeswap.finance/',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/pancake.svg').default
    },
    {
      title: 'Serum',
      link: 'https://portal.projectserum.com',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/serum.svg').default
    },
    {
      title: 'TraderJoe',
      link: 'https://www.traderjoexyz.com/',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/traderjoe.png')
    },
    {
      title: 'Paraswap',
      link: 'https://paraswap.io/#/?network=polygon',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/paraswap.svg').default
    }
  ]
  
  let farmlinks = [
    {
      title: 'Overview',
      link: '/farm/overview',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/dashboard.svg').default
    },{
      title: 'Farm',
      link: '/farm/pools',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/farm.svg').default
    },{
      title: 'Rewards',
      link: '/farm/claim',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/rewards.svg').default
    }
  ]
  let communitylinks = [
    {
      title: 'Blog',
      link: 'https://medium.com/@KeplerHomes',
      isoutlink: true,
      icon: require('../../assets/images/header/blog.svg').default
    },
    {
      title: 'Discord',
      link: 'https://discord.gg/keplerhomes',
      isoutlink: true,
      icon: require('../../assets/images/header/discord.svg').default
    },{
      title: 'Telegram',
      link: 'https://t.me/KeplerHomes',
      isoutlink: true,
      icon: require('../../assets/images/header/telegram.svg').default
    },{
      title: 'Twitter',
      link: 'https://twitter.com/KeplerHomes',
      isoutlink: true,
      icon: require('../../assets/images/header/twitter.svg').default
    },{
      title: 'YouTube',
      link: 'https://www.youtube.com/channel/UClN9tsN8atf0QHbRtUlX5aw',
      isoutlink: true,
      icon: require('../../assets/images/header/youtube.svg').default
    },{
      title: 'Apply For Volunteer',
      link: '/apply-volunteer',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/volunteer.svg').default
    },{
      title: 'Apply For Partner',
      link: '/apply-partner',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/partner.svg').default
    },
  ]
  let morelinks = [
    {
      title: 'FAQ',
      link: '/faq',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/faq.svg').default
    },{
      title: 'Docs',
      isoutlink: true,
      link: 'https://docs.kepler.homes/',
      icon: require('../../assets/images/header/docs.svg').default
    },{
      title: 'News',
      link: '/news',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/news.svg').default
    },
    // {
    //   title: 'Claim',
    //   link: '/',
    //   desc: 'Coming soon',
    //   disabled: true,
    //   icon: require('../../assets/images/header/claim.svg').default
    // },
    {
      title: 'Tokenomics',
      link: '/tokenomics',
      desc: 'Coming soon',
      disabled: false,
      icon: require('../../assets/images/header/tokenomics.svg').default
    }
  ]

  // const [hasBg, setHasBg] = useState(false)

  // useEffect(() => {
  //   function scroll() {
  //     const scrollHeight = Math.floor(document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset)
  //   }
  //   window.addEventListener('scroll', scroll)
  //   return () => {
  //     window.removeEventListener('scroll', scroll)
  //   }
  // }, [])

  useEffect(() => {
    window.addEventListener('click', function() {
      setShowMobileMenu(false)
    })
    Bus.addListener('foldChange', (isfold) => {
      setShowMobileMenu(isfold)
  });
  }, [])
   
  let [isFold, setFold] = useState(true)




  let foldfn = () => {
      Bus.emit('foldChange', !isFold);
  }
  
  useEffect(() => {
      Bus.addListener('foldChange', (isfold) => {
          setFold(isfold)
      });
  }, [])

  return (
    <>
    <div className={classnames(["global-header", {"has-bg": props.hasBg}])}>
      <a className="logo" href="/">
        <img src={logo} alt="" />
      </a>
      <div className="nav-list">
        <div className="nav-item active">
          <Dropdown placement="bottom" overlayClassName="header-nav-dropdown" atip overlay={
            <Menu>
              {
                marketlinks.map((item, index) => {
                  return (<Menu.Item key={index} disabled={item.disabled}>
                    {
                      item.isoutlink ? 
                        <a href={item.link} target="_blank">
                          <img src={item.icon}  alt={item.title} />
                          <div className="menu-wrapper m-r-50">
                            <div className="menu-title">{item.title}</div>
                            <div className="menu-title-sub">{item.desc}</div>
                          </div>
                          <div className="arrow">
                            <img src={arrow} alt="" />
                          </div>
                        </a>:
                        <NavLink to={item.link}>
                      <img src={item.icon} alt={item.title} />
                      <div className="menu-wrapper m-r-50">
                        <div className="menu-title" style={{"width": "220px"}}>{item.title}
                        {
                          item.disabled ?<span className="comingsoon"><img src={require('../../assets/images/base/soon.svg').default} alt="" /></span>:''
                        }
                        </div>
                        <div className="menu-title-sub">{item.desc}</div>
                      </div>
                      <div className="arrow">
                        <img src={arrow} alt="" />
                      </div>
                    </NavLink>
                    }
                    
                  </Menu.Item>)
                })
              }
            </Menu>
          }>
            <a className="" onClick={e => e.preventDefault()}>
              Market <img className="icon-arrow" src={iconArrow} alt="" />
            </a>
          </Dropdown>
        </div>
        <div className="nav-item">
        <Dropdown placement="bottom" overlayClassName="header-nav-dropdown" atip overlay={
            <Menu>
              {
                exchangeLinks.map((item, index) => {
                  return (<Menu.Item key={index} disabled={item.disabled}>
                    <a href={item.link}>
                      <img src={item.icon} alt={item.title} style={{width: '32px'}}/>
                      <div className="menu-wrapper m-r-50 flex flex-center">
                        <div className="menu-title">{item.title}
                        {
                          item.disabled ?<span className="comingsoon"><img src={require('../../assets/images/base/soon.svg').default} alt="" /></span>:''
                        }
                        </div>
                        {/* <div className="menu-title-sub">{item.desc}</div> */}
                      </div>
                      <div className="arrow">
                        <img  src={arrow} alt="" />
                      </div>
                    </a>
                  </Menu.Item>)
                })
              }
            </Menu>
          }>
            <a className="" onClick={e => e.preventDefault()}>
              Exchange <img className="icon-arrow" src={iconArrow} alt="" />
            </a>
          </Dropdown>
        </div>
        <div className="nav-item">
        <Dropdown placement="bottom" overlayClassName="header-nav-dropdown" atip overlay={
            <Menu>
              {
                farmlinks.map((item, index) => {
                  return (<Menu.Item key={index} disabled={item.disabled}>
                    <NavLink to={item.link}>
                      <img src={item.icon}  alt={item.title} />
                      <div className="menu-wrapper m-r-50">
                        <div className="menu-title">{item.title}
                        {
                          item.disabled ?
                        <span className="comingsoon"><img src={require('../../assets/images/base/soon.svg').default} alt="" /></span>:''
                        }
                        </div>
                        {/* <div className="menu-title-sub">{item.desc}</div> */}
                      </div>
                      <div className="arrow">
                        <img src={arrow} alt="" />
                      </div>
                    </NavLink>
                  </Menu.Item>)
                })
              }
            </Menu>
          }>
            <a className="" onClick={e => e.preventDefault()}>
              Farm <img className="icon-arrow" src={iconArrow} alt="" />
            </a>
          </Dropdown>
        </div>
        <div className="nav-item">
          <NavLink to={'/bridge'}>Bridge</NavLink>
        </div>
        {/* <div className="nav-item">
          <Tooltip placement="bottom" title="Coming soon">
            <a>PGC</a>
          </Tooltip>
        </div> */}
        <div className="nav-item">
          <Tooltip placement="bottom" title="Coming soon">
            <a>DAO</a>
          </Tooltip>
        </div>
        <div className="nav-item">
            <NavLink to={'/claim'}>Claim</NavLink>
        </div>
        <div className="nav-item">
          <Dropdown placement="bottom" overlayClassName="header-nav-dropdown" atip overlay={
            <Menu>
              {
                communitylinks.map((item, index) => {
                  return (<Menu.Item key={index} disabled={item.disabled}>
                    {
                      item.needLogin && !props.token ? (
                            <a onClick={showLogin} href="javascript:;">
                            <img src={item.icon}  alt={item.title} />
                            <div className="menu-wrapper m-r-50">
                              <div className="menu-title">{item.title}</div>
                              <div className="menu-title-sub">{item.desc}</div>
                            </div>
                            <div className="arrow">
                              <img src={arrow} alt="" />
                            </div>
                          </a>
                      ):(
                        item.isoutlink ? (
                          <a href={item.link} target="_blank">
                            <img src={item.icon}  alt={item.title} />
                            <div className="menu-wrapper m-r-50">
                              <div className="menu-title">{item.title}
                              {
                                item.disabled ?
                                <span className="comingsoon"><img src={require('../../assets/images/base/soon.svg').default} alt="" /></span>
                                :''
                              }
                              
                              </div>
                              {/* <div className="menu-title-sub">{item.desc}</div> */}
                            </div>
                            <div className="arrow">
                              <img src={arrow} alt="" />
                            </div>
                          </a>
                        ):(
                          <NavLink to={item.link}>
                            <img src={item.icon}  alt={item.title} />
                            <div className="menu-wrapper m-r-50">
                              <div className="menu-title">{item.title}
                              {
                                item.disabled ?
                                <span className="comingsoon"><img src={require('../../assets/images/base/soon.svg').default} alt="" /></span>
                                :''
                              }
                              </div>
                              {/* <div className="menu-title-sub">{item.desc}</div> */}
                            </div>
                            <div className="arrow">
                              <img src={arrow} alt="" />
                            </div>
                          </NavLink>
                        )
                      )
                      
                    }
                    
                  </Menu.Item>)
                })
              }
            </Menu>
          }>
            <a className="" onClick={e => e.preventDefault()}>
              Community <img className="icon-arrow" src={iconArrow} alt="" />
            </a>
          </Dropdown>
        </div>
        <div className="nav-item">
          <Dropdown placement="bottom" overlayClassName="header-nav-dropdown" atip overlay={
            <Menu>
              {
                morelinks.map((item, index) => {
                  return (<Menu.Item key={index} disabled={item.disabled}>
                    {
                      item.isoutlink ? (
                        <a href={item.link} target="_blank">
                          <img src={item.icon}  alt={item.title} />
                          <div className="menu-wrapper m-r-50">
                            <div className="menu-title">{item.title}
                            {
                                item.disabled ?
                                <span className="comingsoon"><img src={require('../../assets/images/base/soon.svg').default} alt="" /></span>
                                :''
                              }
                            </div>
                            {/* <div className="menu-title-sub">{item.desc}</div> */}
                          </div>
                          <div className="arrow">
                            <img src={arrow} alt="" />
                          </div>
                        </a>
                      ):(
                        <NavLink to={item.link}>
                          <img src={item.icon}  alt={item.title} />
                          <div className="menu-wrapper m-r-50">
                            <div className="menu-title">{item.title}
                            {
                                item.disabled ?
                                <span className="comingsoon"><img src={require('../../assets/images/base/soon.svg').default} alt="" /></span>
                                :''
                              }
                            </div>
                            {/* <div className="menu-title-sub">{item.desc}</div> */}
                          </div>
                          <div className="arrow">
                            <img src={arrow} alt="" />
                          </div>
                        </NavLink>
                      )
                    }
                  </Menu.Item>)
                })
              }
            </Menu>
          }>
            <a className="" onClick={e => e.preventDefault()}>
              More <img className="icon-arrow" src={iconArrow} alt="" />
            </a>
          </Dropdown>
        </div>
      </div>
      <div className="header-right">
        <div className="icon-list">
          {/* <Dropdown placement="bottom"  atip overlay={
            <Menu>
              <Menu.Item key="0">
              <NavLink to="/download">
                <div>
                  <div className="menu-title">Windows</div>
                  <div className="menu-title-sub">Coming soon</div>
                </div>
              </NavLink>
              </Menu.Item>
              <Menu.Item key="1">
              <NavLink to="/download">
                <div>
                  <div className="menu-title">MacOS</div>
                  <div className="menu-title-sub">Coming soon</div>
                </div>
              </NavLink>

              </Menu.Item>
            </Menu>
          }> */}
           <Tooltip title="Coming soon">
           <div className="icon-item"><img src={iconDownload} alt="" width="30"/></div>
           </Tooltip>
          {/* </Dropdown> */}
          <Login/>
        </div>
        <ConnectWallet />
      </div>
      <div className="login-mobile show-m">
         <Login notdispatch={true}/>
      </div>
      <div className="mobile-menu" onClick={foldfn}>
        <img src={iconMenu} alt="" />
      </div>
    </div>
    
    <div className='show-m'>
      <MobileMenu />
    </div>
    </>
  )
}

// export default ;
export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Header
);

