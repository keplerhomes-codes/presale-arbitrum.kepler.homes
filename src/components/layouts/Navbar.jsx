import React, { useState, useEffect, useRef } from 'react';
import {Tooltip} from 'antd'
import iconMenu from '../../assets/images/home/icon-menu.svg'
import { Menu, Dropdown } from 'antd';
import iconArrow from '../../assets/images/home/icon-arrow.svg'
// import logo from '../../assets/images/home/logo.svg'
import iconLanguage from '../../assets/images/home/icon-language.svg'
import iconDownload from '../../assets/images/home/icon-download.png'
import logo from '../../assets/images/nav/logo.svg'
import menu from '../../assets/images/nav/menu.svg'
import classnames from 'classnames'
import './Navbar.scss'
import { useTranslation} from 'react-i18next'
import ConnectWallet from '../ConnectWallet';
import Login from '../Login';

import Bus from '../../lib/eventBus'

function Header(props) {
  let { t ,i18n} = useTranslation()
  let language = i18n.language.split('-')[0]
  
  let [isFold, setFold] = useState(false)


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


  let foldfn = () => {
      Bus.emit('foldChange', !isFold);
  }
  
  useEffect(() => {
      Bus.addListener('foldChange', (isfold) => {
          setFold(isfold)
      });
  }, [])

  return (
    <div className={classnames(["second-header flex flex-between", {"has-bg": true}])}>
        
     <div className={"logo-wrap show-p flex flex-center flex-between "+(isFold?'':'logo-wrap-fold')} >
       {
         isFold ? <a href="/" className='logo'><img src={logo} alt="" /></a>:''
       }
       
        <img src={menu} alt="" onClick={foldfn}/>
      </div>
      <div className="header-right">
        <div className="icon-list">
          <Tooltip title="Coming soon" placement='bottom'>
            <div className="icon-item"><img src={iconDownload} alt="" width="30"/></div>
          </Tooltip>
          {/* <Dropdown placement="bottom"  atip overlay={
            <Menu>
              <Menu.Item key="0">
                <a>
                  <div className="menu-title">Windows</div>
                </a>
              </Menu.Item>
              <Menu.Item key="1">
                <a>
                  <div className="menu-title">MacOS</div>
                </a>
              </Menu.Item>
            </Menu>
          }> */}
          
          {/* </Dropdown> */}
          <Dropdown placement="bottom" overlayClassName="header-nav-dropdown" atip overlay={
            <Menu>
              <Menu.Item key="0">
                <div className="menu-title" onClick={
                  ()=>i18n.changeLanguage('en')
                }>English</div>
              </Menu.Item>
              <Menu.Item key="1">
                <div className="menu-title" onClick={
                  ()=>i18n.changeLanguage('zh')
                }>简体中文</div>
              </Menu.Item>
              <Menu.Item key="2">
                <div className="menu-title" onClick={
                  ()=>i18n.changeLanguage('ru')
                }>русский язык</div>
              </Menu.Item>
              <Menu.Item key="3">
                <div className="menu-title" onClick={
                  ()=>i18n.changeLanguage('ko')
                }>한국어 공부 해요.</div>
              </Menu.Item>
            </Menu>
          }>
            <div className="icon-item"><img src={iconLanguage} alt="" /></div>
          </Dropdown>
          <Login/>
        </div>
        <ConnectWallet />

      </div>
      <div className="flex-1 flex flex-middle show-m">
         <a href="/" className='logo '><img src={logo} alt="" /></a>
         <div className="mobile-menu" onClick={foldfn}>
            <img src={iconMenu} alt="" />
         </div>  
         <div className='login-mobile'>
           <Login notdispatch/>
         </div>
         <div className="lang-mobile">
         <Dropdown placement="bottom" overlayClassName="header-nav-dropdown" atip overlay={
            <Menu>
              <Menu.Item key="0">
                <div className="menu-title fz-14" onClick={
                  ()=>i18n.changeLanguage('en')
                }>English</div>
              </Menu.Item>
              <Menu.Item key="1">
                <div className="menu-title fz-14" onClick={
                  ()=>i18n.changeLanguage('zh')
                }>简体中文</div>
              </Menu.Item>
              <Menu.Item key="2">
                <div className="menu-title fz-14" onClick={
                  ()=>i18n.changeLanguage('ru')
                }>русский язык</div>
              </Menu.Item>
              <Menu.Item key="3">
                <div className="menu-title fz-14" onClick={
                  ()=>i18n.changeLanguage('ko')
                }>한국어 공부 해요.</div>
              </Menu.Item>
            </Menu>
          }>
            <div className="icon-item"><img src={iconLanguage} alt="" /></div>
          </Dropdown>
         </div>
      </div>

    </div>
  )
}

export default Header;
