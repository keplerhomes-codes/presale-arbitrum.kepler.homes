
import React, { useState, useMemo, useCallback} from 'react'
import { useTranslation} from 'react-i18next'
import { Input, Button } from 'antd';
import './index.scss'
import {post} from '../../http'
import notification from '../notification'
import store from '../../store';
import { useEffect } from 'react';
import { useRef } from 'react';
import { emailReg } from '../../lib/util';
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
    let [isLoading, setLoading] = useState(false)
    let [sending, setSending] = useState(false)
    let [isEight, setIsEight] = useState(false)
    let [isCapital, setIscapital] = useState(false)
    let [isOnenum, setIsonenumm] = useState(false)
    let [second, setSecond] = useState(0)
    let [passVisible, setPassVisible] = useState(false)
    let timer = useRef()
    let sendCode = () => {
        if(!emailReg.test(email)) {
            setIsEmail(false)
            return
        }
        setIsEmail(true)
        setSending(true)
        post('/api/sendCode', {
            email,
            emailType: 2
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
                description: t('Please check in your email')
            });
        }).catch(err => {
            setSending(false)
            setSend(false)
            let tips = t('Something goes wrong')
            switch (err.code) {
                case 3002:
                    tips = t('Account already exists');
                    break;
                case 3001:
                    tips = t('Account not exists');
                    break;
                case 2002:
                    tips = t('Send too fast');
                    break;
                default:
                    break;
            }
            notification.error({
                message: t(tips)
            })
        })
    }
    let toModify = () => {
        setLoading(true)
        post('/api/forgot', {
            email,
            code,
            password,
            password2: cpassword
        }).then(res => {
            setLoading(false)
            props.onSuccess()
            notification.success({
                message: t('Change Password Success'),
            });
        }).catch(err => {
            // 【1001】 参数错误 【1002】 参数错误 【2001】验证码错误 【2003】验证码已过期 【2004】验证码已使用【3002】邮箱存在
            let tips = 'Something goes wrong'
            switch (err.code) {
                case 2001:
                    tips = t('Verfication Code is not correct');
                    break;
                case 2003:
                    tips = t('Verification code has expired');
                    break;
                case 3001:
                    tips = t('Account not exists');
                    break;
                case 2004:
                    tips = t('Verification code used');
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
        return !(code&& password && (password==cpassword) && isEight && isCapital && isOnenum)
    }, 
    [code, password, cpassword])

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
        <div className="c14 fz-14">{t('E-mail')}</div>
        <div className="email  m-t-10">
          <Input autoComplete='off' placeholder={t('E-mail')} className='my-input fz-16' onChange={(e) =>setEmail(e.target.value)}/>
          
        </div>
        {
            isSend ? (
                <div className="warning flex flex-center c14 p-t-10">
                    <img src={require('../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>
                    {t('Please check your email')}
                </div>
            ):''
        }
        {
            !isEmail ? (
                <div className="warning flex flex-center c14 p-t-10">
                    <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                    {t('Incorrect email')}
                </div>
            ):''
        }
        <div className="c14 fz-14 m-t-20">{t('E-mail verification code')}</div>
        <div className="email  m-t-10">
          <Input autoComplete='off' placeholder={t('E-mail verification code')} className='my-input fz-16' onChange={(e) =>setCode(e.target.value)}/>
          {
              isSend ? (
                <div className="send-btn c56">{allseconds-second}s </div>
              ):(
                <div className="send-btn ce pointer" onClick={sendCode} > {t(`Send${sending ? 'ing':''}`)} </div>
              )
          }
        </div>
        <div className="c14 fz-14 m-t-20">{t('Set password')}</div>
        <Input.Password autoComplete='off' placeholder={t('Set password')} className='my-input fz-16 m-t-10' onChange={(e) =>setPassword(e.target.value)}
        iconRender={(visible) => {
            setPassVisible(visible)
            return visible ?<EyeOutlined/> : <EyeInvisibleOutlined/>
        }}/>
        <div className="warning flex flex-center c14 p-t-10">
            {
                isEight ? <img src={require('../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>:
                <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
            }
            
            {t('Minimum eight characters')}
        </div>
        <div className="warning flex flex-center c14 p-t-3">
           {
                isCapital ? <img src={require('../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>:
                <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
            }
            {t('At least one capital letter')}
        </div>
        <div className="warning flex flex-center c14 p-t-3">
           {
                isOnenum ? <img src={require('../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>:
                <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
            }
            {t('At least one number')}
        </div>
        <div className="c14 fz-14 m-t-20">{t('Confirm password')}</div>
        <Input autoComplete='off' type={passVisible?"text":"password"} placeholder={t('Confirm password')} className='my-input fz-16 m-t-10'  onChange={(e) =>setCpassword(e.target.value)}/>
        {
            cpassword && (cpassword !== password) ? (
                <div className="warning flex flex-center c14 p-t-10">
                    <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                    {t('Your passwords don’t match')}
                </div>
            ):''
        }
        <Button disabled={disabled} loading={isLoading} onClick={toModify} className="color ta cf btn m-t-30 disabled w100 my-button">{t('Confirm')}</Button>
         
      </div>
    )
}