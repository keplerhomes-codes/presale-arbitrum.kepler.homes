
import {Button, Input, Upload} from 'antd'
import { useEffect, useState} from 'react'
import {post, baseUrl, upload} from '../../http'
import store, {setUserInfo} from '../../store'
import notification from '../notification'
import { useTranslation} from 'react-i18next'
import Web3 from 'web3'
import Modal from '../Base/Modal'
import { ZERO_ADDRESS, showLogin } from '../../lib/util'
import Modify from './Modify'
import {connect, useSelector} from 'react-redux'
import getNetworkData from '../../wallet/helper/getNetworkData';
import { createProviderController } from '../../wallet/web3/createProviderController'
import Cropper from 'react-cropper'
import "cropperjs/dist/cropper.css";
import { ChainIdName, addPoint } from '../../lib/util'
import { useWallet } from '@solana/wallet-adapter-react';
import {  Row, Col , Tabs } from 'antd'


const { TabPane } = Tabs;
const Account = (props) => {
  let { t ,i18n} = useTranslation()
  let [loading, setLoading] =  useState(false)
  let {publicKey} = useWallet()
  const updateContact = function () {
    setLoading(true)
    post('/api/v1/account/social/update', {
      twitterUrl: twitter,
      instagramUrl:ins,
      facebookUrl:facebook,
      siteUrl: site
    }).then(res => {
      setLoading(false)
        notification.success({
          message: t('Update Success')
      });
    }).catch(err => {
      setLoading(false)
        let tips = 'Something goes wrong'
        // switch (err.code) {
        //     case 3002:
        //         tips = 'Account already exists';
        //         break;
        //     case 3001:
        //         tips = 'Account not exists';
        //         break;
        //     case 2002:
        //         tips = 'Send too fast';
        //         break;
        //     default:
        //         break;
        // }
        notification.error({
            message: t(tips)
        })
    })
  }
  // let [address, setAddress] = useState('')
  let [twitter, setTwitter] = useState('')
  let [facebook, setFacebook] = useState('')
  let [site, setSite] = useState('')
  let [ins, setIns] = useState('')
  useEffect(()=> {
    // setAddress(props.userInfo.bsc)
    setTwitter(props.userInfo.twitterUrl)
    setFacebook(props.userInfo.facebookUrl)
    setIns(props.userInfo.instagramUrl)
    setSite(props.userInfo.siteUrl)
  }, [props.userInfo])
    return (
      <Tabs className='my-tab'>
                    <TabPane tab={t('Social Conn')} key={0}>
                     <div className='w100 cf account'>
                       <div className="social-input flex flex-center">
                          <Input placeholder='Enter Twitter Account' className={"my-input opacity-input content-font  p-l-60 "+(twitter ? 'fwb':'')} value={twitter} onChange={(e) => setTwitter(e.target.value)}></Input>
                          <img src={require('../../assets/images/user/tw.svg').default} alt=""  className='tw-icon'/>
                        </div>
                        <div className="social-input m-t-10 flex flex-center">
                          <Input placeholder='Enter Instagram Account' className={"my-input opacity-input content-font  p-l-60 "+(ins ? 'fwb':'')} value={ins} onChange={(e) => setIns(e.target.value)}></Input>
                          <img src={require('../../assets/images/user/ins.svg').default} alt=""  className='tw-icon'/>
                        </div>
                        <div className="social-input m-t-10 flex flex-center">
                          <Input placeholder='Enter FaceBook Account' className={"my-input opacity-input content-font  p-l-60 "+(facebook ? 'fwb':'')} value={facebook} onChange={(e) => setFacebook(e.target.value)}></Input>
                          <img src={require('../../assets/images/user/fb.svg').default} alt=""  className='tw-icon'/>
                        </div>
                        
                        <div className="social-input m-t-10 flex flex-center">
                          <Input placeholder='Enter Website' className={"my-input opacity-input content-font  p-l-60 "+(site ? 'fwb':'')} value={site} onChange={(e) => setSite(e.target.value)}></Input>
                          <img src={require('../../assets/images/user/site.svg').default} alt=""  className='tw-icon'/>
                        </div>
                     </div>
                     
                     <div className="flex  setting-btn">
                            <Button loading={loading} className="btn color confirm-btn ta my-button color ta cf btn  w100 my-button" onClick={updateContact}>Save</Button>
                      </div>
                    </TabPane>
                    <TabPane tab={t('NFT')} key={1}>
                    <div className='w100 cf account asset-area flex flex-wrap'>
                       <img src={require('../../assets/images/nft/cover.png')} alt="" />
                       <img src={require('../../assets/images/nft/kepler.png')} alt="" />
                       <img src={require('../../assets/images/nft/nft.png')} alt="" />
                       <img src={require('../../assets/images/nft/cover.png')} alt="" />
                       <img src={require('../../assets/images/nft/cover.png')} alt="" />
                    </div>
                    </TabPane>
                    <TabPane tab={t('Game Asset')} key={2}>
                    <div className='w100 cf account asset-area flex flex-wrap'>
                       <img src={require('../../assets/images/nft/cover.png')} alt="" />
                       <img src={require('../../assets/images/nft/cover.png')} alt="" />
                       <img src={require('../../assets/images/nft/nft.png')} alt="" />
                       <img src={require('../../assets/images/nft/cover.png')} alt="" />
                       <img src={require('../../assets/images/nft/kepler.png')} alt="" />
                    </div>
                    </TabPane>
                </Tabs>
       
    )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Account
);
