
import React, { useState, useMemo, useCallback, useEffect} from 'react'
import { useTranslation} from 'react-i18next'
import { Input, Button, Checkbox } from 'antd';
import './index.scss'
import {post} from '../../http'
import Captcha from 'react-captcha-code'
import { emailReg } from '../../lib/util';
import { Vertify } from '@alex_xu/react-slider-vertify';
import notification from '../notification'
import Modal from '../../components/Base/Modal'
import { useRef } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
let counts = 0
let allseconds = 60
export default function (props) {
    
    let { t ,i18n} = useTranslation()
    let [email, setEmail] = useState('')
    let [code, setCode] = useState('')
    let [password, setPassword] = useState('')
    let [cpassword, setCpassword] = useState('')
    let [isEmail, setIsEmail] = useState(true)
    let [isSend, setSend] = useState(false)
    let [isSending, setSending] = useState(false)
    let [isLoading, setLoading] = useState(false)
    let [letters, setLetters] = useState('')
    let [cap, setCap] = useState('')
    let [isCap, setIscap] = useState(true)
    let [isEight, setIsEight] = useState(false)
    let [isCapital, setIscapital] = useState(false)
    let [isOnenum, setIsonenumm] = useState(false)
    let [second, setSecond] = useState(0)
    let [isDisabled, setDisabled] = useState(true)
    let [sliderVisible, setSliderVisible] = useState(false)
    let [passVisible, setPassVisible] = useState(false)
    let timer = useRef()
    let sendCode = () => {
        if(!emailReg.test(email)) {
            setIsEmail(false)
            return
        } else {
            setSending(true)
            setIsEmail(true)
            post('/api/sendCode', {
                email,
                emailType: 1
            }).then(res => {
                setSend(true)
                setSending(false)
                timer.current = setInterval(() => {
                    if(counts < allseconds) {
                        counts++
                        setSecond(counts)
                    } else {
                        setSecond(0)
                        counts = 0
                        setSend(false)
                        clearInterval(timer.current)
                    }
                }, 1000)
                notification.success({
                    message: t('Send code Success'),
                    description: t('Please check your email')
                });
            }).catch(err => {
                setSending(false)
                setSend(false)
                let tips = 'Something goes wrong'
                switch (err.code) {
                    case 3002:
                        tips = 'Account already exists';
                        break;
                    case 3001:
                        tips = 'Account not exists';
                        break;
                    case 2002:
                        tips = 'Send too fast';
                        break;
                    default:
                        break;
                }
                notification.error({
                    message: t(tips)
                })
            })
        }
    }
    let toRegister = () => {
        setLoading(true)
        post('/api/signup', {
            // nickName: nickname,
            email,
            code,
            password,
            password2: cpassword
        }).then(res => {
            setLoading(false)
            // notification.success({
            //     message: t('Register Success'),
            // });
            props.onSuccess()
        }).catch(err => {
            // 【1001】 参数错误 【1002】 参数错误 【2001】验证码错误 【2003】验证码已过期 【2004】验证码已使用【3002】邮箱存在
            let tips = 'Something goes wrong'
            switch (err.code) {
                case 2001:
                    tips = 'Verfication Code is not correct';
                    break;
                case 2003:
                    tips = 'Verification code has expired';
                    break;
                case 3002:
                    tips = 'Account already exists';
                    break;
                case 2004:
                    tips = 'Verification code used';
                    break;
                default:
                    break;
            }
            setLoading(false)
            notification.error({
                message: t(tips)
            })
        })
    }
    let disabled = useMemo(() => {
        return !(!isDisabled&&email&&code&&password&&cpassword && (password==cpassword) && isEight && isCapital && isOnenum)
    }, 
    [email, code, password, cpassword, isDisabled])
useEffect(()=>{
        setIsEight(password.length >=8)
        setIscapital(/[A-Z]/.test(password))
        setIsonenumm(/[0-9]/.test(password))
}, [password])
    return (
        <div className='login-content'>
            <div className="hide" style={{height: '0px', overflow: 'hidden'}}>
               <Input />
               <Input.Password />
            </div>
        {/* <div className="c14 fz-14">{t("E-mail")}</div> */}
        <div className="email  m-t-10">
          <Input placeholder={t("E-mail")} autoComplete='off' className='my-input fz-16' onChange={(e) =>{setEmail(e.target.value); setIsEmail(true)}}/>
          
          
          
        </div>
        {
            !isEmail ? (
                <div className="warning flex flex-center c14 p-t-10">
                    <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                    {t("Incorrect email")}
                </div>
            ):''
        }
        {
            isSend ? (
                <div className="warning flex flex-center c14 p-t-10">
                    <img src={require('../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>
                    {t("Please check your email")}
                </div>
            ):''
        }
        {/* <div className="c14 fz-14 m-t-20">{t("Verification code")}</div> */}
        <div className="email  m-t-10">
        <Input autoComplete='off' placeholder={t("Verification code")} className='my-input fz-16' onChange={(e) =>setCode(e.target.value)}/>
        {
              isSend ? (
                <div className="send-btn c56">{allseconds-second}s </div>
              ):(
                <div className="send-btn ce pointer" onClick={sendCode} > {t(`Send${isSending?'ing':''}`)} </div>
              )
          }
          </div>
        {/* <div className="c14 fz-14 m-t-20">{t("Set password")}</div> */}
        <Input.Password autoComplete='off' placeholder={t("Set password")} className='my-input fz-16 m-t-10' onChange={(e) =>setPassword(e.target.value)} 
        iconRender={(visible) => {
            setPassVisible(visible)
            return visible ?<EyeOutlined/> : <EyeInvisibleOutlined/>
        }}
        />
        <div className="warning flex flex-center c14 p-t-10">
            {
                isEight ? <img src={require('../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>:
                <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
            }
            {t("Minimum eight characters")}
        </div>
        <div className="warning flex flex-center c14 p-t-3">
           {
                isCapital ? <img src={require('../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>:
                <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
            }
            {t("At least one capital letter")}
        </div>
        <div className="warning flex flex-center c14 p-t-3">
           {
                isOnenum ? <img src={require('../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>:
                <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
            }
            {t("At least one number")}
        </div>
        
        {/* <div className="c14 fz-14 m-t-20">{t("Confirm password")}</div> */}
        <Input type={passVisible ? "text":"password"} autoComplete='off' placeholder={t("Confirm password")} className='my-input fz-16 m-t-10'  onChange={(e) =>setCpassword(e.target.value)}/>
        {
            cpassword && (cpassword !== password) ? (
                <div className="warning flex flex-center c14 p-t-10">
                    <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                    {t("Your passwords don’t match")}
                </div>
            ):''
        }
        <div className="flex flex-center flex-middle m-t-20">
        <Checkbox className='my-checkbox-rect c14' onChange={(e) => setSliderVisible(e.target.checked)}>{t("I'm not a robot")}</Checkbox>
        </div>
          <Modal title={t("Slide fill puzzle right")} isVisible={sliderVisible} onClose={()=>setSliderVisible(false)}>
              <Vertify
                width={320}
                height={160}
                visible={true}
                text={t("Slide fill puzzle right")}
                onSuccess={() => {setDisabled(false);setSliderVisible(false)}}
                onFail={() => {document.getElementsByClassName('loadingContainer')[0].getElementsByTagName('span')[0].innerHTML = t('Loading')}}
                onRefresh={() => {document.getElementsByClassName('loadingContainer')[0].getElementsByTagName('span')[0].innerHTML = t('Loading')}}
              />
            </Modal>
        <Button disabled={disabled} loading={isLoading} onClick={toRegister} className="color ta cf btn m-t-20 w100 my-button">{t('Register')}</Button>
         
      </div>
    )
}