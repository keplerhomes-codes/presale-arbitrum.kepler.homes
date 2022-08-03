import './Menu.scss'

import {NavLink, Link} from 'react-router-dom'
import { useEffect, useState ,useCallback} from 'react'
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
import notification from '../notification'

const navList = [
    {
        title: 'NFT-Mint',
        // icon: bridge,
        // icon_active: bridge_active,
        link: '/nft-mint',
        disabled: false,
    },
    {
        title: 'NFT-WhiteList',
        // icon: bridge,
        // icon_active: bridge_active,
        link: '/nft-whitelist',
        disabled: false,
    }
]


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
    let clickEvent = (index) => {
        if(index ==1 ) {
            copyAddress()
        }
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
                        {
                            item.clickIndex ? 
                             <div className="flex flex-center nav-items w100 pointer" onClick={()=>clickEvent(item.clickIndex)}>
                                 <div className={"p-13 "+ (isFold ? '': ' flex flex-center w100 flex-middle')}></div>
                                 <span className="cf link-text">{t(item.title)}</span>
                            </div>
                            :
                            <NavLink to={item.link || '/'}  exact="true" className="flex flex-center nav-items w100 pointer" activeclassname='active' disabled={item.disabled}>
                               <div className={"p-13 "+ (isFold ? '': ' flex flex-center w100 flex-middle')}>
                                {/* <img src={item.icon} alt="" className="inner-icon normal"/> */}
                                {/* <img src={item.icon_active} alt="" className="inner-icon  active"/> */}
                                    </div>
                                    {
                                        isFold ? <span className="cf link-text">{t(item.title)}</span>:''
                                    }
                                    {
                                            item.disabled && <img src={require('../../assets/images/base/soon.svg').default} alt="" />
                                    }
                            </NavLink>
                        }
                       </div>
                    )
                  )
              })
          }
          <div className="show-m cf flex flex-middle">
                <ConnectWallet notdispatch={true}/>
          </div>
          </div>
          
        <div className="menumask" onClick={foldfn}></div>

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
  