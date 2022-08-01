import { useState, useRef, useMemo, useEffect } from "react"
import { Button, Input, Checkbox } from "antd"
import { emailReg } from '../../../lib/util';

import { connect, useSelector } from 'react-redux'
import { post } from '../../../http'
import notification from '../../notification'
import Modal from '../../../components/Base/Modal'
import { t } from "i18next"
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import store, { setUserInfo } from "../../../store";

import Tip from './Tip'
import Warn from './Warn'

let counts = 0
let allseconds = 6000
const Unbind = (props) => {

    let timer = useRef()

    let [email, setEmail] = useState(props.userInfo.email)
    let [isEmail, setIsEmail] = useState(true)
    let [isSend, setSend] = useState(false)
    let [isSending, setSending] = useState(false)
    let [second, setSecond] = useState(0)
    let [loading, setLoading] = useState(false)
    let [password, setPassword] = useState('')
    let [passVisible, setPassVisible] = useState(false)
    let [cpassword, setCpassword] = useState('')
    let [code, setCode] = useState('')
    let [isEight, setIsEight] = useState(false)
    let [isCapital, setIscapital] = useState(false)
    let [isOnenum, setIsonenumm] = useState(false)
    let [showUnbind, setShowUnbind] = useState(false)
    let unbindFn = () => {
        setLoading(true)
        post('/api/v1/account/email/unbind', {
            code
        }).then(res => {
            setLoading(false)
            notification.success({
                message: t('Unbind Success'),
            });
            let userInfo = {...props.userInfo}
            userInfo.email = ''
            store.dispatch(setUserInfo(userInfo))
            props.changeFn(0)
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
    let updateFn = () => {
        setLoading(true)
        post('/api/v1/account/password/update', {
            code,
            password,
            password2: cpassword
        }).then(res => {
            setLoading(false)
            notification.success({
                message: t('Update Success'),
            });
            setPassword('')
            setCpassword('')
            setCode('')
            setSend(false)
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
    let sendCode = () => {
        setSending(true)
        post('/api/sendCode', {
            email: props.userInfo.email,
            emailType: props.status == 1 ?2:3 // change pass
        }).then(res => {
            setSend(true)
            setSending(false)
            timer.current = setInterval(() => {
                if (counts < allseconds) {
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

    let disabled = useMemo(() => {
        return !(code && (password && cpassword && (password == cpassword) && isEight && isCapital && isOnenum || props.status == 3))
    },
        [code, password, cpassword])
    useEffect(() => {
        setIsEight(password.length >= 8)
        setIscapital(/[A-Z]/.test(password))
        setIsonenumm(/[0-9]/.test(password))
    }, [password])
    return (
        <div className="game">
            <div className="game-inner">
                {/* {
                    <div className="cf fz-18 flex flex-center flex-between">
                        <span>
                            E-mail verification code({props.userInfo.email})
                        </span>
                        <span>
                            <span className="pointer game-btn fz-16" onClick={() => props.changeFn(3)}>Unbind</span>
                            <span className="pointer game-btn fz-16" onClick={() => props.changeFn(2)}>Change Email</span>
                        </span>
                    </div>
                } */}

                <div className="w100">
                    <div className="hide" style={{ height: '0px', overflow: 'hidden' }}>
                        <Input />
                        <Input.Password />
                    </div>
                    {/* <div className="c06 fz-14">{t("E-mail")}</div> */}
                    <div className="social-input m-t-10 m-b-10 flex flex-center">
                        <Input placeholder={t('Please enter your email address')}
                            className="my-input opacity-input content-font"
                            value={email}
                            disabled={[1,3].includes(props.status)}
                            onChange={(e) => { setEmail(e.target.value); setIsEmail(true) }}
                        ></Input>
                        {
                            [1].includes(props.status) && (
                                <div className="change-btn ce fz-14 flex flex-center">
                                    <div onClick={() => props.changeFn(3)}>Unbind</div>
                                    <span className="line"></span>
                                    <div onClick={() => props.changeFn(2)}>Change Email</div>
                                </div>
                            )
                        }
                        
                        

                    </div>
                    {
                        !isEmail ? (
                            <div className="warning flex flex-center cf">
                                <img src={require('../../../assets/images/user/info.svg').default} alt="" className='m-r-5'/>
                                {t("Incorrect email")}
                            </div>
                        ):''
                    }
                    {
                        isSend ? (
                            <div className="warning flex flex-center cf">
                                <img src={require('../../../assets/images/tips/success.svg').default} alt="" className='m-r-5'/>
                                {t("Please check your email")}
                            </div>
                        ):''
                    }
                    {/* <div className="c06 fz-14 m-t-20">{t("Verification code")}</div> */}

                    <div className="social-input m-t-10 m-b-10 flex flex-center">
                        <Input placeholder={t("Verification code")} value={code} className="my-input opacity-input content-font " onChange={(e) => setCode(e.target.value)}></Input>
                        {
                            isSend ? (
                                <div className="send c56">{allseconds - second}s </div>
                            ) : (
                                <div className="send pointer" onClick={sendCode} > {t(`Send${isSending ? 'ing' : ''}`)} </div>
                            )
                        }
                    </div>
                    {
                        props.status == 1 && (
                            <>
                    {/* <div className="c06 fz-14 m-t-20">{t("Set password")}</div> */}

                                <div className="social-input m-t-10 m-b-10 flex flex-center">
                                    <Input type="password" value={password} placeholder={t("Set password")} className="my-input opacity-input content-font " onChange={(e) => setPassword(e.target.value)} iconRender={(visible) => {
                                        setPassVisible(visible)
                                        return visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                                    }} />

                                </div>
                                <div className="warning flex flex-center cf">
                                    {
                                        isEight ? <img src={require('../../../assets/images/user/success.svg').default} alt="" className='m-r-5'/>:
                                        <img src={require('../../../assets/images/user/info.svg').default} alt="" className='m-r-5'/>
                                    }
                                    {t("Minimum eight characters")}
                                </div>
                                <div className="warning flex flex-center cf p-t-3">
                                {
                                        isCapital ? <img src={require('../../../assets/images/user/success.svg').default} alt="" className='m-r-5'/>:
                                        <img src={require('../../../assets/images/user/info.svg').default} alt="" className='m-r-5'/>
                                    }
                                    {t("At least one capital letter")}
                                </div>
                                <div className="warning flex flex-center cf p-t-3 p-b-10">
                                {
                                        isOnenum ? <img src={require('../../../assets/images/user/success.svg').default} alt="" className='m-r-5'/>:
                                        <img src={require('../../../assets/images/user/info.svg').default} alt="" className='m-r-5'/>
                                    }
                                    {t("At least one number")}
                                </div>
                                {/* <div className="c06 fz-14 m-t-20">{t("Confirm password")}</div> */}

                                <div className="social-input m-t-10 m-b-10 flex flex-center">
                                    <Input type="password" value={cpassword} placeholder={t("Confirm password")} className="my-input opacity-input content-font " onChange={(e) => setCpassword(e.target.value)} />
                                </div>
                                {
                                    cpassword && (cpassword !== password) ? (
                                        <div className="warning flex flex-center cf">
                                            <img src={require('../../../assets/images/user/info.svg').default} alt="" className='m-r-5'/>
                                            {t("Your passwords don’t match")}
                                        </div>
                                    ):''
                                }
                            </>
                        )
                    }


                </div>
                {/* binded */}






            </div>
            {
                <div className="flex  setting-btn">

                    <Button disabled={disabled} loading={loading} className="btn color confirm-btn ta my-button color ta cf btn  w100 my-button" onClick={props.status == 1 ? updateFn : unbindFn}>{props.status == 1 ? 'Update Account' : 'Unbind'}</Button>
                </div>
            }



        </div>
    )
}



export default connect(
    (state, props) => {
        return { ...state, ...props }
    }
)(
    Unbind
);
