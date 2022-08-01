import { useState, useRef, useMemo, useEffect } from "react"
import { Button, Input, Checkbox } from "antd"
import { emailReg } from '../../../lib/util';

import { connect, useSelector } from 'react-redux'
import { post } from '../../../http'
import notification from '../../notification'
import { t } from "i18next"
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import store, { setUserInfo } from "../../../store";

import Tip from './Tip'
import Warn from './Warn'
let counts = 0
let allseconds = 60

let Bind = (props) => {
    let timer = useRef()

    let [isAgree, setAgree] = useState(false)
    let [email, setEmail] = useState('')
    let [isEmail, setIsEmail] = useState(true)
    let [isSend, setSend] = useState(false)
    let [isSending, setSending] = useState(false)
    let [second, setSecond] = useState(0)
    let [loading, setLoading] = useState(false)
    let [code, setCode] = useState('')
    let [password, setPassword] = useState('')
    let [passVisible, setPassVisible] = useState(false)
    let [cpassword, setCpassword] = useState('')
    let [isEight, setIsEight] = useState(false)
    let [isCapital, setIscapital] = useState(false)
    let [isOnenum, setIsonenumm] = useState(false)
    let changeAgree = (e) => {
        setAgree(e.target.checked)
    }
    let bindFn = () => {
        setLoading(true)
        post('/api/v1/account/email/update', {
            // nickName: nickname,
            email,
            code,
            password,
            password2: cpassword
        }).then(res => {
            setLoading(false)
            notification.success({
                message: t('Bind Success'),
            });
            let userInfo = {...props.userInfo}
            userInfo.email = email
            store.dispatch(setUserInfo(userInfo))
            props.changeFn(1)
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
        return !(email&&code&&password&&cpassword && (password==cpassword) && isEight && isCapital && isOnenum)
    }, 
    [email, code, password, cpassword])
    let sendCode = () => {
        if (!emailReg.test(email)) {
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
                    case 2007:
                        tips = 'The Email has been bound';
                        break;
                    case 2006:
                        tips = 'The Email is not exist';
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
    useEffect(() => {
        setIsEight(password.length >= 8)
        setIscapital(/[A-Z]/.test(password))
        setIsonenumm(/[0-9]/.test(password))
    }, [password])
    return (
        <div className="game">
            <div className="game-inner">
                {
                    props.status == 2 &&
                    <div className={"game-tip flex w100 flex-center cf fz-14 flex-column flex-center " + (isAgree ? 'agree' : '')}>
                        Changing your email address will change the attribution of your in-game NFTs, which may
                        cause you to forget your in-game assets. Please make sure you have extracted your
                        in-game NFT assets, and operate this step carefully.
                        <span className="m-t-10 m-b-10">
                            <Checkbox className="my-checkbox-rect m-r-10" onChange={changeAgree}></Checkbox>
                            The consequences of changing your email address are known.
                        </span>
                    </div>
                }
                 <div className="hide" style={{ height: '0px', overflow: 'hidden' }}>
                        <Input />
                        <Input.Password />
                    </div>
                    {
                        props.status != 2 &&<Tip title="Tips:Before playing Kepler.Homes, you must bind your email."/>
                    }
                
                <div className={"w100 " + (props.status == 2 && !isAgree ? 'disabled' : '')}>
                    {/* <div className="c06 fz-14">{t("E-mail")}</div> */}
                    <div className="social-input m-t-10 m-b-10 flex flex-center">
                        <Input placeholder={props.status == 2?t('Please enter your new email address'):t('Please enter your email address')}
                            className="my-input opacity-input content-font"
                            disabled={props.status == 2 && !isAgree}
                            onChange={(e) => { setEmail(e.target.value); setIsEmail(true) }}
                        ></Input>
                        

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
                    <div className="social-input m-t-10 flex flex-center">
                        <Input
                            disabled={props.status == 2 && !isAgree}
                            placeholder={t("Verification code")} className="my-input opacity-input content-font " onChange={(e) => setCode(e.target.value)}></Input>
                        {
                            isSend ? (
                                <div className="send c56">{allseconds - second}s </div>
                            ) : (
                                <div className="send pointer" onClick={(props.status == 2 && !isAgree) ? null : sendCode} > {t(`Send${isSending ? 'ing' : ''}`)} </div>
                            )
                        }
                    </div>
                    {/* <div className="c06 fz-14 m-t-20">{t("Set password")}</div> */}
                    <div className="social-input m-t-10 m-b-10 flex flex-center">
                        <Input type="password" placeholder={t("Set password")} className="my-input opacity-input content-font " onChange={(e) => setPassword(e.target.value)} iconRender={(visible) => {
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
                        <Input type="password" placeholder={t("Confirm password")} className="my-input opacity-input content-font " onChange={(e) => setCpassword(e.target.value)} />
                    </div>
                    {
                        cpassword && (cpassword !== password) ? (
                            <div className="warning flex flex-center cf p-t-10">
                                <img src={require('../../../assets/images/user/info.svg').default} alt="" className='m-r-5'/>
                                {t("Your passwords don’t match")}
                            </div>
                        ):''
                    }
                </div>
            </div>
            <div className="flex  setting-btn">
                <Button disabled={disabled} loading={loading} className="btn color confirm-btn ta my-button color ta cf btn  w100 my-button" onClick={bindFn}>{props.status == 2 ? 'Update' : 'Bind'} Email</Button>
            </div>
        </div>

    )

}




export default connect(
    (state, props) => {
        return { ...state, ...props }
    }
)(
    Bind
);
