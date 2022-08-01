
import './User.scss'
import Account from '../components/User/Account'
import NFT from '../components/User/NFT'
import { useEffect, useState} from 'react'

import {baseUrl} from '../http'
import { useLocation } from 'react-router-dom';

import {setToken} from '../store'
import { useTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {  Row, Col , Tabs } from 'antd'
import { t } from 'i18next'
import Profile from '../components/User/Profile'
import Game from '../components/User/Game'
import Reward from '../components/User/Reward'


const { TabPane } = Tabs;


const Nav = (props) => {
    let { t ,i18n} = useTranslation()

    return (
        <div className='cf nav-box flex flex-column flex-center'>
            <img src={props.userInfo.avatar ? baseUrl+props.userInfo.avatar : require('../assets/images/user/avatar.png')} alt="" className='avatar'/>
            <div className="user-name cf fz-18 m-t-20 pointer" onClick={()=> props.changeIndex('game')}>
            {
            props.userInfo.email ? 
            <span className='fwb'>{props.userInfo.email}</span>
            : (
                <span className='ce fz-14 flex flex-center'>
                    <img src={require('../assets/images/user/bind.svg').default} alt="" className='m-r-5'/>
                     Email Bind
                </span>
            )
            }
            </div>
            
            {/* <div className="cf fz-16">Kepler@kepler.homes</div> */}
            {/* pc */}
            <div className={"nav-item m-t-30  flex w100 flex-center p-r-30 "+(props.activeIndex == 'profile' ?'active':'')} onClick={()=> props.changeIndex('profile')}>
                {
                    props.activeIndex == 'profile' ?
                    <img src={require('../assets/images/user/member_active.svg').default} alt="" className='nav-icon'/>:
                    <img src={require('../assets/images/user/member.svg').default} alt="" className='nav-icon'/>
                }
                 <span className='nav-text flex-1'>{t('My Profile')}
                 </span>
                 {/* <img src={require('../assets/images/base/tangle.svg').default} alt="" /> */}
            </div>
            <div className={"nav-item m-t-30  flex w100 flex-center p-r-30 "+(props.activeIndex == 'game' ?'active':'')} onClick={()=> props.changeIndex('game')}>
            {
                    props.activeIndex == 'game' ?
                    <img src={require('../assets/images/user/game_active.svg').default} alt="" className='nav-icon'/>:
                    <img src={require('../assets/images/user/game.svg').default} alt="" className='nav-icon'/>
                }
                 <span className='nav-text'>{t('Game Account')}</span>
            </div>
            <div className={"nav-item m-t-30  flex w100 flex-center p-r-30 "+(props.activeIndex == 'rewards' ?'active':'')} onClick={()=> props.changeIndex('rewards')}>
            {
                    props.activeIndex == 'rewards' ?
                    <img src={require('../assets/images/user/rewards_active.svg').default} alt="" className='nav-icon'/>:
                    <img src={require('../assets/images/user/rewards.svg').default} alt="" className='nav-icon'/>
                }
                 <span className='nav-text flex-1 flex flex-center'>{t('My Rewards')}
                 </span>
                 {/* <img src={require('../assets/images/base/tangle.svg').default} alt="" /> */}
            </div>
             {/* pc */}
             {/* mobile */}

             {/* mobile */}


        </div>
    )
}

const User = function (props) {
    let params = useLocation()
    console.log(params)
    let [activeIndex, setActiveIndex] = useState(params.search ?params.search.replace('?','').split('=')[1]?.toLowerCase():'profile' )
    let changeIndex = (index) => {
        if(index == activeIndex) {
            return
        }
        setActiveIndex(index)
    }
    useEffect(() => {
       if(!props.token) {
           window.location.href="/"
       }
    }, [props.token])
    return (
        <>
        <div className='user user-pc'>
            <img src={require('../assets/images/user/bkg.png')} className='user-bkg' alt="" />
            <div className={"user-content "+activeIndex}>
                <Nav userInfo={props.userInfo} changeIndex={changeIndex} activeIndex={activeIndex}/>
                {
                    activeIndex == 'profile' && (<><Profile/><Account/></>)
                }
                {
                    activeIndex == 'game' && <Game/>
                }
                {
                    activeIndex == 'rewards' && (<Reward/>)
                }
                
            </div>
        </div>
        <div className='user user-mobile'>
            <img src={require('../assets/images/user/bkg.png')} className='user-bkg' alt="" />
            <Nav userInfo={props.userInfo} changeIndex={changeIndex} activeIndex={activeIndex}/>
            <Tabs className='my-tab p-l-15 p-r-15' activeKey={activeIndex} onChange={(key)=>changeIndex(key)} >
                <TabPane tab={t('My profile')} key="profile">
                    <div className="user-content">
                        <Profile/>
                        <Account userInfo={props.userInfo}/>
                    </div>
                </TabPane>
                <TabPane tab={t('Game Account')} key="game">
                   <Game/>
                </TabPane>
                <TabPane tab={t('My Rewards')} disabled key="rewards">
                   <Reward/>
                </TabPane>
            </Tabs>
             
        </div>
    </>
    )
}





export default connect(
    (state, props) => {
      return {...state, ...props}
    }
  )(
    User
  );