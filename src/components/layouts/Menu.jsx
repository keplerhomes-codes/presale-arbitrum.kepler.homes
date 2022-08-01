import './Menu.scss'

import {NavLink, Link} from 'react-router-dom'
import { useEffect, useState } from 'react'
import tangle from '../../assets/images/nav/tangle.svg'
import List from '../../assets/images/nav/exchange.svg'
import exchange_active from '../../assets/images/nav/exchange_active.svg'
import market from '../../assets/images/nav/market.svg'
import staking from '../../assets/images/nav/staking.svg'
import pgc from '../../assets/images/nav/pgc.svg'
import bridge from '../../assets/images/nav/bridge.svg'
import bridge_active from '../../assets/images/nav/bridge_active.svg'
import dao from '../../assets/images/nav/dao.svg'
import dao_active from '../../assets/images/nav/dao_active.svg'
import pgc_active from '../../assets/images/nav/pgc_active.svg'
import gov from '../../assets/images/nav/gov.svg'
import docs from '../../assets/images/nav/docs.svg'
import community from '../../assets/images/nav/community.svg'
import faq from '../../assets/images/nav/faq.svg'
import arrow from '../../assets/images/header/arrow.svg'
import more from '../../assets/images/nav/more.svg'

import Bus from '../../lib/eventBus'
import ConnectWallet from '../ConnectWallet';
import { findAddressByName, showLogin } from '../../lib/util'
import Modal from '../Base/Modal'
import { useTranslation} from 'react-i18next'
import {connect, useSelector} from 'react-redux'
import {Tooltip} from 'antd'

const navList = [
    {
        title: 'Market',
        icon: market,
        // link: '/market',
        status: 'fold',
        children: [
            {
                title: 'NFT Mint',
                link: '/nft-mint',
                disabled: false,
                isoutlink: false,
                icon: require('../../assets/images/nav/inner/origin.svg').default,
                icon_active: require('../../assets/images/nav/inner/origin_active.svg').default
            },
            {
                title: 'MarketPlace',
                link: '/market',
                disabled: false,
                icon: require('../../assets/images/nav/inner/marketplace.svg').default,
                icon_active: require('../../assets/images/nav/inner/marketplace_active.svg').default
            },
            {
                title: 'Lands',
                link: '/lands',
                disabled: true,
                icon: require('../../assets/images/nav/inner/lands.svg').default,
                icon_active: require('../../assets/images/nav/inner/lands_active.svg').default
            },
            {
                title: 'My NFT',
                link: '/mynft',
                disabled: false,
                icon: require('../../assets/images/nav/inner/mynft.svg').default,
                icon_active: require('../../assets/images/nav/inner/mynft_active.svg').default
            }
        ]
    },
    {
        title: 'Farm',
        icon: staking,
        link: '/farm',
        status: 'fold',
        children: [
            {
                title: 'Overview',
                link: '/farm/overview',
                disabled: false,
                icon: require('../../assets/images/nav/inner/dashboard.svg').default,
                icon_active: require('../../assets/images/nav/inner/dashboard_active.svg').default
                
            },
            {
                title: 'Farm',
                link: '/farm/pools',
                disabled: false,
                icon: require('../../assets/images/nav/inner/farm.svg').default,
                icon_active: require('../../assets/images/nav/inner/farm_active.svg').default
                
            },
            {
                title: 'Rewards',
                link: '/farm/claim',
                disabled: false,
                icon: require('../../assets/images/nav/inner/rewards.svg').default,
                icon_active: require('../../assets/images/nav/inner/rewards_active.svg').default
                
            }
        ]
    },
    {
        title: 'Bridge',
        icon: bridge,
        icon_active: bridge_active,
        link: '/bridge',
        disabled: false,
    },
    // {
    //     title: 'PGC',
    //     icon: pgc,
    //     icon_active: pgc_active,
    //     link: '/pgc',
    //     disabled: false,
    // },
    
    {
        title: 'Claim',
        link: '/Claim',
        // isoutlink: true,
        disabled: false,
        icon: require('../../assets/images/nav/inner/claim.svg').default,
        icon_active: require('../../assets/images/nav/inner/claim_active.svg').default 
    },
    {
        title: 'Community',
        icon: community,
        link: '/community',
        status: 'fold',
        children: [
            {
                title: 'Apply For Volunteer',
                link: '/apply-volunteer',
                // isoutlink: true,
                disabled: false,
                icon: require('../../assets/images/nav/inner/applyforvolunteer.svg').default,
                icon_active: require('../../assets/images/nav/inner/applyforvolunteer_active.svg').default 
            },
            {
                title: 'Apply For Partner',
                link: '/apply-partner',
                // isoutlink: true,
                disabled: false,
                icon: require('../../assets/images/nav/inner/applyforpartner.svg').default,
                icon_active: require('../../assets/images/nav/inner/applyforpartner_active.svg').default 
            },
            {
                title: 'DAO',
                icon: dao,
                icon_active: dao_active,
                link: '/dao',
                disabled: true,
            },
        ]
    },
    {
        title: 'More',
        icon: more,
        link: '/more',
        status: 'fold',
        children: [
            {
                title: 'FAQ',
                link: '/faq',
                // isoutlink: true,
                disabled: false,
                icon: require('../../assets/images/nav/inner/faq.svg').default,
                icon_active: require('../../assets/images/nav/inner/faq_active.svg').default 
            },
            {
                title: 'Docs',
                link: 'https://docs.kepler.homes/',
                // isoutlink: true,
                isoutlink: true,
                icon: require('../../assets/images/nav/inner/docs.svg').default,
                icon_active: require('../../assets/images/nav/inner/docs_active.svg').default 
            },
            {
                title: 'News',
                // isoutlink: true,
                link: '/news',
                disabled: false,
                icon: require('../../assets/images/nav/inner/news.svg').default,
                icon_active: require('../../assets/images/nav/inner/news_active.svg').default 
            },
            {
                title: 'Tokenomics',
                // isoutlink: true,
                link: '/tokenomics',
                disabled: false,
                icon: require('../../assets/images/nav/inner/tokenomics.svg').default,
                icon_active: require('../../assets/images/nav/inner/tokenomics_active.svg').default 
            }
        ]
    }
]
const exchangeList = 
[
    {
        title: 'Uniswap',
        link: 'https://app.uniswap.org/#/swap',
        disabled: false,
        isoutlink: true,
        icon: require('../../assets/images/header/uniswap.svg').default,
        // icon_active: require('../../assets/images/header/uniswap_active.svg').default
    },
    {
        title: 'Serum',
        link: 'https://portal.projectserum.com',
        disabled: false,
        isoutlink: true,
        icon: require('../../assets/images/header/serum.svg').default,
        // icon_active: require('../../assets/images/header/serum_active.svg').default
    },
    {
        title: 'TraderJoe',
        link: 'https://www.traderjoexyz.com/',
        disabled: false,
        isoutlink: true,
        icon: require('../../assets/images/header/traderjoe.png'),
        // icon_active: require('../../assets/images/header/traderjoe_active.svg').default
    },
    {
        title: 'Paraswap',
        link: 'https://paraswap.io/#/?network=polygon',
        disabled: false,
        isoutlink: true,
        icon: require('../../assets/images/header/paraswap.svg').default,
        // icon_active: require('../../assets/images/header/paraswap_active.svg').default
    },
    {
        title: 'Pancake',
        link: 'https://pancakeswap.finance/',
        disabled: false,
        isoutlink: true,
        icon: require('../../assets/images/header/pancake.svg').default,
        // icon_active: require('../../assets/images/header/pancake_active.svg').default
    }
]
const communityList = [
            {
                title: 'Blog',
                link: 'https://medium.com/@KeplerHomes',
                isoutlink: true,
                icon: require('../../assets/images/nav/community/blog.svg').default,
                icon_active: require('../../assets/images/nav/community/blog_active.svg').default
            },
            {
                title: 'Discord',
                link: 'https://discord.gg/keplerhomes',
                isoutlink: true,
                icon: require('../../assets/images/nav/community/discord.svg').default,
                icon_active: require('../../assets/images/nav/community/discord_active.svg').default
            },
            {
                title: 'Telegram',
                link: 'https://t.me/KeplerHomes',
                isoutlink: true,
                icon: require('../../assets/images/nav/community/telegram.svg').default,
                icon_active: require('../../assets/images/nav/community/telegram_active.svg').default 
            },
            {
                title: 'Twitter',
                link: 'https://twitter.com/KeplerHomes',
                isoutlink: true,
                icon: require('../../assets/images/nav/community/twitter.svg').default,
                icon_active: require('../../assets/images/nav/community/twitter_active.svg').default 
            },
            {
                title: 'YouTube',
                link: 'https://www.youtube.com/channel/UClN9tsN8atf0QHbRtUlX5aw',
                isoutlink: true,
                icon: require('../../assets/images/nav/community/youtube.svg').default,
                icon_active: require('../../assets/images/nav/community/youtube_active.svg').default 
            }
]
const content = () => {
    return (
        <div className="exchange-content flex flex-wrap">
           {
             exchangeList.map(item => {
                return (
                    <a href={item.link} target="_blank" className="flex w50 flex-middle">
                        <div className="exchange-item  flex flex-center flex-column p-20">
                            <img src={item.icon} alt={item.title} style={{width: '40px'}}/>
                            <div className="menu-title fz-16 cf">{item.title}</div>
                        </div>
                    </a>
                )
            })
            }
        </div>
    )
}
const Menu =  function (props) {
    let { t ,i18n} = useTranslation()
    let [menuList, setMenuList] = useState(navList)
    let [ismobile, setg] = useState(false)
    let [isFold, setFold] = useState(false)
    let [showExchange, setShowExchange] = useState(false)
    let changeStatus = (index) => {
        let menus = [...menuList]
        menus.map((item, idx) => {
            if(idx != index) {
                item.status = 'fold'
            }
            return item
        })
        menus[index].status = menus[index].status ==  'fold' ? 'unfold':'fold'
        setMenuList(menus)
        Bus.emit('foldChange', true);
    }
    let foldfn = () => {
        Bus.emit('foldChange', !isFold);
    }
    const addMetamask = () =>{
        if (window.ethereum) {
            window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: findAddressByName('KEPL'), // The address that the token is at.
                    symbol: 'KEPL', // A ticker symbol or shorthand, up to 5 chars.
                    decimals: 18 // The number of decimals in the token
                    // image: outputToken.logo, // A string url of the token logo
                },
            }})
            window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: findAddressByName('KEME'), // The address that the token is at.
                        symbol: 'KEME', // A ticker symbol or shorthand, up to 5 chars.
                        decimals: 18 // The number of decimals in the token
                        // image: outputToken.logo, // A string url of the token logo
                    },
                }})
        } else {

        }
    }
    
    useEffect(() => {
        Bus.addListener('foldChange', (isfold) => {
            setFold(isfold)
            if(!isfold) {
                let menus = [...menuList]
                menus.map(item => {
                    item.status = 'fold'
                    return item
                })
                setMenuList(menus)
            }
        });
    }, [])
    return (
     <div>
      <div className={"menu flex flex-column "+ (isFold ? 'menu-open': 'menu-close')}>
         
        <div className="flex-1 menu-items">
          {
              menuList.map((item, index) => {
                  return (
                    item.children ? (
                        <div className="flex flex-center flex-column  w100 pointer"  key={item.title}>
                            <div className="flex flex-center nav-items w100 pointer  p-l-10 p-r-10" onClick={ev=>changeStatus(index)}>
                                    <div className={"p-13 "+ (isFold ? '': ' flex flex-center w100 flex-middle')}>
                                        <img src={item.icon} alt="" className="inner-icon"/>
                                    </div>
                                    {
                                        isFold ? (
                                            <>
                                             <span className="cf link-text">{t(item.title)}</span>
                                            <img src={tangle} alt=""  className={"tangle " + item.status}/> 
                                            </>
                                            ) :''
                                    }
                            </div>
                            <div className={"inner w100  p-l-10 p-r-10 " + item.status} style={{height: item.children.length * 53 + 22 +'px'}}>
                                    {
                                        item.children.map(inner => {
                                            return (
                                                (inner.needLogin && !props.token) ? (
                                                    <span  key={inner.title} onClick={showLogin} className="flex flex-center nav-items w100 pointer p-l-20" activeclassname='active'>
                                                        <div className="p-13">
                                                            <img src={inner.icon} alt="" className="inner-icon normal"/>
                                                            <img src={inner.icon_active} alt="" className="inner-icon active"/>
                                                        </div>
                                                        <span className="cf link-text">{t(inner.title)}</span>  
                                                     </span>
                                                )
                                                :
                                                (
                                                    
                                                inner.isoutlink ?
                                                <a  key={inner.title} href={inner.link || '/'} target="_blank" className="flex flex-center nav-items w100 pointer p-l-20" activeclassname='active'>
                                                        <div className="p-13">
                                                            <img src={inner.icon} alt="" className="inner-icon normal"/>
                                                            <img src={inner.icon_active} alt="" className="inner-icon active"/>
                                                        </div>
                                                        <span className="cf link-text">{t(inner.title)}</span>  
                                                </a>
                                                :
                                                <NavLink key={inner.title} to={inner.link || '/'} exact="true" className="flex flex-center nav-items w100 pointer p-l-20" activeclassname='active' disabled={inner.disabled}>
                                                        <div className="p-13">
                                                            <img src={inner.icon} alt="" className="inner-icon normal"/>
                                                            <img src={inner.icon_active} alt="" className="inner-icon active"/>
                                                        </div>
                                                        <span className="cf link-text">{t(inner.title)}</span>  
                                                </NavLink>

                                                )
                                            )
                                        })
                                    }

                            </div>
                        </div>
                    ):( <div className='p-l-10 p-r-10' key={item.title}>
                        <NavLink to={item.link || '/'}  exact="true" className="flex flex-center nav-items w100 pointer" activeclassname='active' disabled={item.disabled}>
                            <div className={"p-13 "+ (isFold ? '': ' flex flex-center w100 flex-middle')}>
                                <img src={item.icon} alt="" className="inner-icon normal"/>
                                <img src={item.icon_active} alt="" className="inner-icon  active"/>
                            </div>
                            {
                                isFold ? <span className="cf link-text">{t(item.title)}</span>:''
                            }
                       </NavLink>
                       </div>
                    )
                  )
              })
          }
          <div className="show-m cf flex flex-middle m-t-10">
                <ConnectWallet notdispatch={true}/>
          </div>
          </div>
          

        <div className={"flex flex-center flex-between w100 cf  price-area p-t-20 p-b-20 "+(isFold ? 'price-padding':'p-l-10 p-r-10')}>
            {
                 isFold ? (
                     <div className="w100 bordertop">
                         <div className="w100 flex flex-center flex-between m-t-20 m-b-20 pointer show-p" >

                         {
                              communityList.map(item => {
                                  return (
                                    <Tooltip title={t(item.title)} className="my-pop" placement="top">
                                      <a className="community-icon" href={item.link} target="_blank">
                                                    <img className='normal'  src={item.icon} alt="" />
                                                    <img  className='active'  src={item.icon_active} alt="" />
                                      </a>
                                      </Tooltip>
                                    
                                  )
                              })
                         }
                          <Tooltip title={t('Add to MetaMask')} className="my-pop" placement="top">
                            <div onClick={addMetamask} className="add-metamask">
                                <img className='metamask-icon' src={require('../../assets/images/nav/metamask.svg').default} alt="" />
                            </div>
                         </Tooltip>
                         </div>
                         <div className="w100 flex flex-column flex-center flex-middle m-t-20 m-b-20 pointer show-m" >
                          <div className="flex flex-middle w100">
                          {
                              communityList.map((item, index) => {
                                  return (
                                      index <=2 ?
                                    <Tooltip title={t(item.title)} className="my-pop" placement="top">
                                      <a className="community-icon m-l-15 m-r-15" href={item.link} target="_blank">
                                                    <img className='normal'  src={item.icon} alt="" />
                                                    <img  className='active'  src={item.icon_active} alt="" />
                                      </a>
                                      </Tooltip>:''
                                    
                                  )
                              })
                         }
                          </div>
                          <div className="flex flex-middle w100 m-t-10">
                          {
                               communityList.map((item, index) => {
                                return (
                                    index >2 ?
                                  <Tooltip title={t(item.title)} className="my-pop" placement="top">
                                    <a className={"community-icon m-l-15 m-r-15 "+(index == 3 ?'m-l-18':'')} href={item.link} target="_blank">
                                                  <img className='normal'  src={item.icon} alt="" />
                                                  <img  className='active'  src={item.icon_active} alt="" />
                                    </a>
                                    </Tooltip>:''
                                  
                                )
                            })
                         }
                         <Tooltip title={t('Add to MetaMask')} className="my-pop" placement="top">
                            <div onClick={addMetamask} className="add-metamask">
                                <img className='metamask-icon' src={require('../../assets/images/nav/metamask.svg').default} alt="" />
                            </div>
                         </Tooltip>
                          </div>
                         
                          
                         </div>
                        <div className="buy-wrapper flex w100 p-10 flex-center flex-between">
                            <div>
                                <div className='fz-14 c06'>Kepler {t('Price')}</div>
                                <div className='fz-16'>$ 0.92</div>
                            </div>
                            <Tooltip title={content} className="my-pop" placement="leftTop">
                            <div className="buy fwb fz-16 ce bgf ta flex-center pointer show-m">
                                {t('BUY')}
                            </div>
                            </Tooltip>
                            <Tooltip title={content} className="my-pop">
                            <div className="buy fwb fz-16 ce bgf ta flex-center pointer show-p">
                                {t('BUY')}
                            </div>
                            </Tooltip>
                            
                        </div>
                     </div>
                    
                 ):(
                    <Tooltip className="my-pop" title={content}>
                    <div className="buy fz-16 color ta flex-center pointer" >
                    {t('BUY')}
                </div>
                </Tooltip>
                 )
            }
           
           
  
        </div>
        <div className="menumask" onClick={foldfn}></div>
        <Modal isVisible={showExchange} margin={0} title="Exchange" onClose={() =>{setShowExchange(false)} }>
               <div className="exchange">
                {
                    exchangeList.map(item => {
                        return (
                        <a key={item.link} href={item.link} className="flex w100">
                                <div className="exchange-item w100 flex flex-center p-20">
                                    <img src={item.icon} alt={item.title} style={{width: '40px'}}/>
                                    <div className="menu-wrapper m-r-50 flex-1 m-l-20">
                                        <div className="menu-title fz-16">{item.title}</div>
                                        <div className="menu-title-sub cd2 fz-14">Coming soon</div>
                                    </div>
                                    <div className="arrow">
                                        <img  src={arrow} alt="" />
                                    </div>
                                </div>
                            </a>

                        )
                    })
                }
                   
                </div>
        </Modal>

      </div>
      </div>

    )
}
export default connect(
    (state, props) => {
      return {...state, ...props}
    }
  )(
    Menu
  );
  