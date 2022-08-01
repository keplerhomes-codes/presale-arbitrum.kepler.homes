
import { useState, useMemo } from 'react'
import { Input, Button, Menu, Dropdown, Tooltip} from 'antd';
import { useTranslation} from 'react-i18next'
import './index.scss'
import {QuestionCircleOutlined} from '@ant-design/icons'
import iconProfile from '../../assets/images/home/icon-profile.svg'
import Modal from '../Base/Modal'
import Register from './register'
import Forgot from './forgot'
import {post, get, baseUrl} from '../../http'
import store, {setToken, setUserInfo, setToLogin} from '../../store'
import {connect, useSelector} from 'react-redux'
import notification from '../notification'
import { useEffect } from 'react';
import { emailReg } from '../../lib/util';
import { Link } from 'react-router-dom';
function Login (props) {
    let { t ,i18n} = useTranslation()
    let [showLogin, setShowLogin] = useState(false)
    let [showSignUp, setShowSignUp] = useState(false)
    let [showForgot, setShowForgot] = useState(false)
    let [showSuccess, setShowSuccess] = useState(false)
    let [showLogout, setShowLogout] = useState(false)
    let [account, setAccount] = useState('')
    let [password, setPassword] = useState('')
    let [isLoading, setLoading] = useState(false)
    let [token, setMyToken] = useState(props.token)
    let [isEmail, setIsemail] = useState(true)
    let [successTitle, setSuccessTitle] = useState('')
    let [successContent, setSuccessContent] = useState('')
    let userInfo = useSelector(state => {
      return state.userInfo
     })
    let disabled = useMemo(() => {
      return !(account&&password)
    })
    let logout = () => {
      store.dispatch(setToken(''))
      store.dispatch(setUserInfo({}))
      setShowLogout(false)
      // setMyToken('')
    }
    let toLogin = () => {
      if(!emailReg.test(account)) {
        setIsemail(false)
        return
      }
      setIsemail(true)
      setLoading(true)
      post('/api/login', {
        email: account,
        password
      }).then(res => {
        props.dispatch(setToken(res.data.token))
        setMyToken(res.data.token)
        setLoading(false)
        notification.success({
            message: t('Sign in Success'),
            duration:1
        });
        setShowLogin(false)
        // window.location.href='/user'
      }).catch(err => {
        setLoading(false)
        notification.error({
          message: t('Login Fail'),
          description: t('please check your account or password')
      });
      })
    }
    useEffect(() => {
       if(!token) {
         return
       }
       get('/api/v1/account').then(res => {
         store.dispatch(setUserInfo(res.data))
       })
    }, [token])

    useEffect(()=>{
       if(props.notdispatch) {
         return
       }
       if(props.showLogin == 'register') {
         setShowSignUp(true)
       } else if(props.showLogin) {
         setShowLogin(true)
       }
    }, [props.showLogin])
    

    useEffect(()=>{
      if(props.notdispatch) {
        return
      }
       store.dispatch(setToLogin(showLogin))
   }, [showLogin])
    return (
        <div>
          {/* <div className="icon-item" onClick={() => setShowLogin(true)}><img src={iconProfile} alt="" /></div> */}
          
          {/* {
            props.token ? (
              <Dropdown placement="bottom"  atip overlay={
                <Menu>
                  <Menu.Item key="0">
                  <Link to="/user">
                      <div className="menu-title">{t('My Wallet')}</div>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="1">
                  <Link to="/user">
                      <div className="menu-title">{t('My Asset')}</div>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <span onClick={()=>setShowLogout(true)}>
                      <div className="menu-title">{t('Logout')}</div>
                    </span>
                  </Menu.Item>
                </Menu>
              }>
                <Link className="icon-item login-avatar" to="/user"><img src={userInfo.avatar ? baseUrl+props.userInfo.avatar :iconProfile} alt="" /></Link>
              </Dropdown>
            ):
            <Tooltip placement="bottom" title="User Sign in">
              <div className="icon-item" onClick={() => setShowLogin(true)}>
              <img src={iconProfile} alt="" />
              </div>
            </Tooltip>
          } */}
          {/* login */}
          <Modal isVisible={showLogin} title={t('Account Sign in')} onClose={() => setShowLogin(false)}>
              <div className='login-content'>
                <div className="c14 fz-14">{t('Email Address')}</div>
                <Input placeholder={t('Email Address')} autoComplete='off' onPressEnter={!disabled && toLogin} className='my-input fz-16 m-t-10' onChange={(e) =>setAccount(e.target.value)}/>
                {
                  !isEmail ? (
                      <div className="warning flex flex-center c14 p-t-10">
                          <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                          {t('Incorrect email')}
                      </div>
                  ):''
                }
                <div className="c14 fz-14 m-t-20">{t('Password')}</div>
                <Input.Password  autoComplete='off' onPressEnter={!disabled && toLogin} placeholder={t('Password')} className='my-input fz-16 m-t-10' onChange={(e) =>setPassword(e.target.value)}/>
                <Button disabled={disabled} loading={isLoading} onClick={toLogin} className="color ta cf btn m-t-30 w100 my-button">{t('Sign in')}</Button>
                 <div className="flex flex-between m-t-30 ">
                     <span className='ce fz-16 pointer' onClick={() => {setShowLogin(false);setShowSignUp(true)}}>{t('Sign up')}</span>
                     <span className="c05 fz-16 pointer" onClick={() => {setShowLogin(false);setShowForgot(true)}}>
                     {t('Forgot password')}
                     <Tooltip placement="bottom" title={t("Click to reset password")}>
                       <QuestionCircleOutlined className='fz-16 m-l-5' style={{color: 'rgba(0,0,0,0.4)'}}/>
                     </Tooltip>
                     
                     </span>
                 </div>
              </div>
          </Modal>
          {/* register */}
          <Modal isVisible={showSignUp} title={t("Registration")} onClose={() => setShowSignUp(false)}>
              <Register onSuccess={() => {setShowSignUp(false);setShowLogin(false);setSuccessTitle('Register');setSuccessContent('Register Success');setShowSuccess(true)}}/>
              <div className="flex flex-middle m-t-30 ">
                <span className="c14 fz-16">
                {t('Have an account')}?
                </span>
                <span className="m-l-5 ce fz-16 pointer"  onClick={() => {setShowSignUp(false);setShowLogin(true)}}>
                {t('Sign In')}
                </span>
              </div>
          </Modal>
           {/* forgot */}
           <Modal isVisible={showForgot} title={t("Reset Password")} onClose={() => setShowForgot(false)}>
              <Forgot onSuccess={() => {setShowForgot(false);setSuccessTitle('Reset Password');setSuccessContent('Password reset complete');setShowSuccess(true)}}/>
          </Modal>
          <Modal isVisible={showSuccess} title={successTitle} onClose={() => setShowSuccess(false)}>
              <div className='w100 ta flex-center flex-column flex-middle flex'>
                  <img src={require('../../assets/images/base/success.svg').default} alt="" />
                 <span className="c14 fz-16 m-t-15">{successContent}</span>
                 <Button onClick={() =>{setShowSuccess(false);setShowLogin(true)}} className="color ta cf btn m-t-30 w100 my-button">Sign In</Button>
              </div>
          </Modal>
          <Modal title={t("Logout" )}isVisible={showLogout} showButton={true} onConfirm={logout} onClose={()=>{setShowLogout(false)}}>
                 <div className="c14 fz-20 ta fwb">
                 {t('Confirm to Logout?')}
                 </div>
          </Modal>

        </div>
    )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Login
);
