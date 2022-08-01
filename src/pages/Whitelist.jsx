import { Link } from 'react-router-dom'
import {useCallback, useState, useEffect} from 'react'
import Mintnav from '../components/layouts/Airnav'
import Mintfooter from '../components/layouts/Mintfooter'
import Captcha from 'react-captcha-code'
import classNames from 'classnames';
import {connect, useSelector} from 'react-redux'
import './Whitelist.scss'
import { Input, Button, Select, Checkbox, Row, Col, Form} from 'antd';
import whitelist from '../lib/whitelist'
import { ChainIdMap, showConnectWallet, showLogin, showRegister } from '../lib/util'
import { Vertify } from '@alex_xu/react-slider-vertify';
import {post,get} from '../http'
import notification from '../components/notification';
import { useTranslation} from 'react-i18next'
import {sign} from '../contract/methods/index'
import Modal from '../components/Base/Modal'
import store, { setToken, setUserInfo } from '../store'
import {useNavigate} from 'react-router-dom'



function Whitelist  (props) {
     let nav = useNavigate()
    let [isDisabled, setDisabled] = useState(true)
    let [showErr, setShowErr] = useState(false)
    let [sliderVisible, setSliderVisible] = useState(false)
    let [successVisible, setSuccessVisible] = useState(false)
    let [refresh, setRefresh] = useState(0)
    let [isApply, setIsApply] = useState(false)
    let [checkData, setCheckData] = useState({
      twitter: false,
      link: false
    })
    let { t ,i18n} = useTranslation()
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
      {
        name: ['address'],
        value: ''
      }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const Login = async(index) => {
      let signature = await sign('login')
      post('/api/account/connect', {
        chainId: ChainIdMap[localStorage.getItem('kepler_chain')||'ETH'],
        user: props.account,
        signature
      }).then(res => {
        props.dispatch(setToken(res.data.token))
        // get person info
        get('/api/v1/account').then(res => {
          store.dispatch(setUserInfo(res.data))
        })
      }).catch(err => {
        notification.error({
          message: t('Login Fail'),
          description: t('Something goes wrong')
      });
      })
    }
    const checkChange = (name, e) => {
      let data = checkData
      data[name] = e.target.checked
      setCheckData(data)
    }
    const toSign = () => {
      sign('Bind your wallet address').then(res => {
        setFields([
          {
            name: ['address'],
            value: props.account.toLowerCase()
          }
        ])
      })
    }
    const onFinish = (values) => {
      if(!props.token) {
        notification.error({
          message: 'Please approve your wallet First !'
        })
        return
      }
      if(isApply) {
        notification.error({
          message: 'You have applied!'
        })
        return
      }
      if(!checkData.link || !checkData.twitter) {
        setShowErr(true)
        return 
      } else {
        setShowErr(false)
      }
      setIsLoading(true)
      post('/api/v1/account/whitelist', {
        ...values,
        retweet : 1,
        youtube: 'youtube.com'
      }).then(res => {
        setIsLoading(false)
        setSuccessVisible(true)
        setRefresh(refresh+1)
      }).catch(err => {
        setIsLoading(false)
        let tips = 'Something goes wrong'
        switch (err.code) {
            case 2009:
                tips = 'Please bind an email';
                break;
            case 5002:
                tips = 'Apply failed';
                break;
            default:
                break;
        }
        notification.error({
            message: t(tips)
        })
      })
    }
    useEffect(()=>{
      if(props.account) {
        get('/api/account/white', {
           address: props.account
        }).then(res => {
          setIsApply(res.data.isApply)
        })
      }
    }, [refresh, props.account])
  return (
    <div className='mint-page white-bg'>
        <Mintnav/>
         <div className="inner-container">
            {/* <div className="mint-crumbs">Marketplace / Mint / <span className="cur">Nft Whitelist</span></div> */}
            <div className="big-title cf fwb m-t-0 m-b-20 ta">Kepler NFT Whitelist Acquisition</div>
           

             <div className="color top-bar"></div>
            <div className="w100 submit-item flex flex-center bg10 p-15 p-t-15 p-b-15">
               {/* <img src={require('../assets/images/white/kepler.svg').default} alt="" /> */}
               <div className='flex flex-start white-no p-t-10'>
                 <span className='fz-12 cf'>NO.</span>
                 <span className='fz-32 cf num-index m-l-8 '>1</span>
               </div>
               <div className="white-content flex cf fz-med fwb m-l-15 flex-1">
                 {
                   (props.token && props.userInfo && props.userInfo.email) ? 
                   <div className='flex flex-center white-text'>
                     <span className='fz-20'> {`Welcome ${props.userInfo.email}. `}</span>
                    <span className='c06 m-l-10'>Wishing you success in acquiring Kepler NFT Whitelist.</span>
                   </div>
                   : 
                   <div className='flex flex-center white-left  white-text'>
                     <span  className='fz-20 '>Connect your wallet</span>
                    <span  className='c06 m-l-10'>complete bind your Email Address</span>
                   </div>
                 }
                 
               {
                 !props.account && (
                  <div className="btn-area flex">
                      <div className='ce  fz-mini submit-btn pointer' type="default" 
                         onClick={showConnectWallet}>{t('Connect Wallet')}</div>
                    </div>
                 )
                }
                
               {
                 !props.token && props.account && (
                  <div className="btn-area flex">
                      <div className='ce  fz-mini submit-btn pointer' type="default" 
                         onClick={Login}>{t('Approve your wallet')}</div>
                    </div>
                 )
                }
                {
                 props.token && !props.userInfo.email && (
                  <div className="btn-area flex" >
                      <a className='ce  bde fz-mini submit-btn pointer' target="_blank" href="/profile?tab=game" type="default">{t('Bind Email')}</a>
                    </div>
                 )
                }
               </div>
               
            </div>

            <Form className={classNames(["apply-volunteer-card white"]) } 
              form={form}
              name="partner"
              fields={fields}
              layout="vertical"
              onFinish={onFinish}
              >
            {
              whitelist.map((item, index) => {
                return (
                  <div className="w100 submit-item flex flex-center bg10 p-l-10" key={item.value}>
                      <div className='flex flex-start white-no p-t-17 p-b-15'>
                        <span className='fz-12 cf'>NO.</span>
                        <span className='fz-32 cf num-index m-l-8 '>{index+2}</span>
                      </div>
                      <div className="white-content white-content-border flex-1 flex flex-center  cf fz-med fwb p-l-15 p-t-15 p-b-15 p-r-15"  >
                      <div className='flex  white-left flex-center white-text'>
                        <span  className='fz-20'>{item.name}</span>
                        <span  className='c06 m-l-10'>{item.text}</span>
                      </div>
                      
                      {
                            item.useCheck ? (
                              <>
                            <Checkbox style={{height: '40px'}} onChange={(e) =>checkChange(item.value, e)} className='my-checkbox-rect done-check fz-12 c06 m-l-20 flex flex-column flex-center flex-middle'>Done</Checkbox>
                            {
                              !checkData[item.name] && showErr ? <span style={{color: '#ff4d4f'}} className="fz-mini m-l-10">Please complete this task</span>:''
                            }
                            </>
                            ):''
                        }
                        
                        {
                          item.input ? (
                            <Form.Item validateTrigger='onBlur' name={item.value} rules={[{ required: true, pattern: new RegExp(/^[a-zA-Z0-9_@&$*^%!#]{4,45}$/) , message: item.message}]}  style={{'marginBottom': 0, 'text-align':'right'}}>
                              <Input autoComplete={false} placeholder={item.placeholder} className='cf fz-med' />
                            </Form.Item>
                            // <input style={{width: item.width+'px'}} placeholder={item.placeholder}></input>
                          ):''
                        }
                        {

                        }
                        
                      </div>
                      <div className="btn-area flex">
                          {/* <div className='ce  bde fz-mini submit-btn' type="default">Sign</div> */}
                          
                         
                      </div>
                    </div>
                )
              })
            }
            <div className="flex flex-center flex-middle m-t-30">
            <Checkbox className='my-checkbox-rect not-robot cf' onChange={(e) => setSliderVisible(e.target.checked)}>I'm not a robot</Checkbox>
            <Modal title="Slide fill puzzle right" isVisible={sliderVisible} onClose={()=>setSliderVisible(false)}>
              <Vertify
                width={320}
                height={160}
                visible={true}
                text="Slide fill puzzle right"
                onSuccess={() => {setDisabled(false);setSliderVisible(false)}}
                onFail={() => {document.getElementsByClassName('loadingContainer')[0].getElementsByTagName('span')[0].innerHTML = 'Loading'}}
                onRefresh={() => {document.getElementsByClassName('loadingContainer')[0].getElementsByTagName('span')[0].innerHTML = 'Loading'}}
              />
            </Modal>
            
            </div>
            <div className="w100 flex flex-center flex-middle">
            <Form.Item>
            <Button loading={isLoading} disabled={isDisabled} htmlType="submit"  className="submission-btn color ta cf btn m-t-30 w100 my-button">Application submission</Button>
            </Form.Item>
            </div>
            </Form>
            <div className="w100 cf fz-med note c06 p-20 m-t-0">
              Winners do not need any action from their side and the Kepler.homes team will review your whitelist application and publish it <br/>
              <span className='cf'>
              Note:  
              </span>
               All Bot and Duplicate entries will be automatically disqualified. <br/>
              The Chosen Ones will be informed via your register email. If you win the Whitelist Raffle, you can mint during the Genesis Sale or Pre-Sale.
          </div>
          <Modal title="Submitted successful" isVisible={successVisible} onClose={()=>setSuccessVisible(false)}>
               <div className="w100 flex flex-column flex-center">
                  <img src={require('../assets/images/white/success.svg').default} alt="" />
                  <div className="c14 fz-med ta w100 fwb m-t-24">
                  Thank you. 
                  </div>
                  <div className="c14 fz-med ta w100 fwb m-t-10">
                  Please wait for our Email and stay tuned to our Discord for any updates.
                  </div>
                  <div className="w100 info-area p-20 m-t-40">
                      <span className="fwb fz-mini">Mint Day Important Info:</span>
                      <div className="fz-mini c14  m-t-10">
                      You must mint using the same e-mail address you entered here.
                      </div>
                      <div className="fz-mini c14 m-t-10">
                        To find the Official Minting Website, please see the ‘Official Links’ section on Discord.
                      </div>
                  </div>
               </div>
           </Modal>
         </div>
         <Mintfooter />
    </div>
  )
}
export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Whitelist
);