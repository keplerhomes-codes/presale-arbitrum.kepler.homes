
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

import {Connection, clusterApiUrl, Transaction, PublicKey, Keypair, SystemProgram, sendAndConfirmTransaction, BpfLoader} from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react';
const web3 = require("@solana/web3.js");
const splToken = require('@solana/spl-token');

let currentChainId = ''
const Account = (props) => {
  let { t ,i18n} = useTranslation()
  let [loading, setLoading] =  useState(false)
  const uploadData = {
    name: 'file',
    action: 'https://api.kepler.homes/api/upload',
    headers: {
      authorization: store.getState().token,
      'X-Requested-With': null,
      // 'Content-Type': 'multipart/form-data'
    },
    data:{fileType: 1,authorization: store.getState().token},
    showUploadList: false,
    beforeUpload: function(file) {
      console.log(file)
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        notification.error({
          message: t('You can only upload JPG/PNG file!')
      });
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        notification.error({
          message: t('Image must smaller than 2MB!')
      });
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: function(info) {
      console.log(info)
       if(info.file.status == 'done') {
        updateAvatar(info.file.response.data.url)
       }
       if(info.file.status == 'error') {
        notification.error({
          message: t(info.file.response)
      });
       }
    }
  }
  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
    setShowCropper(true)
  };
  const updateAvatar = function(url) {
    // urlType: 1.avatar 2.twitter 3.instagram 4.site
     post('/api/v1/account/avatar/update', {
       url
     }).then(res => {
       let userInfo = {...props.userInfo}
       userInfo.avatar = url
       store.dispatch(setUserInfo(userInfo))
       console.log(store.getState().userInfo)
        notification.success({
          message: t('Avatar updated')
        });
     })
  }
  let {publicKey} = useWallet()
  const bind =  async (chainId) =>{
    console.log(chainId)
    currentChainId = chainId
    if(!props.account) {
      notification.error({
        message: t('Please connect your wallet first')
      });
      return
    }
    if(chainId == 666 && props.chainType == 'EVM') {
      notification.error({
        message: t('Please check to Solana Chain')
      });
      return
    }
    
    if(chainId != 666 && props.chainType != 'EVM') {
      notification.error({
        message: t('Please check to EVM Chain')
      });
      return
    }
    if(props.chainType != 'EVM') {
      setShowBind(true)
      return
    }
    const chain = localStorage.getItem('kepler_chain') || 'BSC'
    const httpProviderURL = getNetworkData[`get${chain}Network`].httpProviderURL
    const provider = await createProviderController(chain).connect()
    let web3 = new Web3(provider)
    if(!web3) {
      web3 = new Web3(new Web3.providers.HttpProvider(httpProviderURL));
    }
    web3.eth.personal.sign("Bind your wallet address", props.account, "test password!").then(res=>{
      console.log(res)
      post('/api/v1/account/address/bind', {
        chainId:currentChainId,
        address: props.account
      }).then(res => {
        let userInfo = {...props.userInfo}
       userInfo[ChainIdName[currentChainId]] = props.account
       store.dispatch(setUserInfo(userInfo))
       console.log(store.getState().userInfo)
        notification.success({
          message: t('Bind Success')
        });
      })
    })
    // if(!Web3.utils.isAddress(address)){
    //   setIsAddress(false)
    //   return
    // }
    // setIsAddress(true)
    
  }
  const bindSol = function () {
    post('/api/v1/account/address/bind', {
      chainId:currentChainId,
      address: props.account
    }).then(res => {
      let userInfo = {...props.userInfo}
     userInfo[ChainIdName[currentChainId]] = props.account
     store.dispatch(setUserInfo(userInfo))
     console.log(store.getState().userInfo)
     setShowBind(false)
      notification.success({
        message: t('Bind Success')
      });
    })
  }
  const unbind = function (chainId) {
    currentChainId = chainId
    setShowUnbind(true)
  }
  const unbindConfirm = function () {
    post('/api/v1/account/address/bind', {
      chainId:currentChainId,
      address: ''
    }).then(res => {
      setShowUnbind(false)
      let userInfo = {...props.userInfo}
       userInfo[ChainIdName[currentChainId]] = ''
       store.dispatch(setUserInfo(userInfo))
       console.log(store.getState().userInfo)
        notification.success({
          message: t('Unbind Success')
        });
    })
  }
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
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setLoading(true)
      cropper.getCroppedCanvas().toBlob((blob) => {
        const isLt2M = blob.size / 1024 / 1024 < 2;
        console.log(blob.size)
      if (!isLt2M) {
          notification.error({
            message: t('Image must smaller than 2MB!')
        });
        return
      }
        let filed = new FormData()
        filed.append('authorization', store.getState().token)
        filed.append('fileType', 1)
        filed.append('file', blob, 'avatar.png')
        upload('/api/upload', filed).then(res => {
          setLoading(false)
          setShowCropper(false)
          updateAvatar(res.data.url)
        }).catch(err => {
          setLoading(false)
          notification.error({
            message: t('Something goes wrong')
        });
        })
      })
    }
  };
  // let [address, setAddress] = useState('')
  let [twitter, setTwitter] = useState('')
  let [facebook, setFacebook] = useState('')
  let [site, setSite] = useState('')
  let [ins, setIns] = useState('')
  let [isAddress, setIsAddress] = useState(true)
  let [showUnbind, setShowUnbind] = useState(false)
  let [showBind, setShowBind] = useState(false)
  let [showModify, setShowModify] = useState(false)
  let [showCropper, setShowCropper] = useState(false)
  const [cropper, setCropper] = useState();
  const [image, setImage] = useState('');
  useEffect(()=> {
    // setAddress(props.userInfo.bsc)
    setTwitter(props.userInfo.twitterUrl)
    setFacebook(props.userInfo.facebookUrl)
    setIns(props.userInfo.instagramUrl)
    setSite(props.userInfo.siteUrl)
  }, [props.userInfo])
    return (
       <div className='w100 cf account'>
            <div className="cf setting-title fwb">Account settings</div>
            <div className="flex flex-center setting-area">
                 <div className="flex setting">
                  <div className="flex flex-column">
                        <span className='c06 content-font'>UID</span>
                        <span className='cf content-font'>{props.userInfo.uid}</span>
                  </div>
                  <div className="flex flex-column email">
                        <span className='c06 content-font'>E-mail</span>
                        <span className='cf content-font'>{props.userInfo.email}</span>
                  </div>
                 </div>
                 
                 <div className='avatar-setting pointer'>
                   {/* <Upload {...uploadData}> */}
                   <input type="file" onChange={onChange} className='input-btn'/>
                    <img  src={props.userInfo.avatar ? baseUrl+props.userInfo.avatar : require('../../assets/images/nft/cover.png')} alt="" className='avatar'/>
                    <img  src={require('../../assets/images/user/xiangji.svg').default} alt="" className='setting'/>
                   {/* </Upload> */}
                    
                 </div>
            </div>
            {/* <div className="c06 content-font m-t-30">Nick name</div>
            <Input className="my-input m-t-10 content-font fwb" value="KCL"></Input> */}
            <div className="c06 content-font m-t-30">Game address binding</div>
            {/* chainItem */}
            <div className="address-input flex flex-center m-t-10">
              <div className="chainName">
                <img src={require('../../assets/images/user/chain/eth.png')} alt="" />
              </div>
              <div className="address-content m-l-14">
                <div className="fz-14 c06">Ethereum</div>

                <div className="fz-14 cf show-p">{props.userInfo.eth}</div>
                <div className="fz-14 cf show-m">{addPoint(props.userInfo.eth, 7)}</div>
              </div>
              <div className="ce pointer bind" onClick={props.userInfo.eth?()=>unbind(1):()=>bind(1)}>{props.userInfo.eth ? 'Unbind':'Bind'}</div>
            </div>
            {/* chainItem */}
            {/* chainItem */}
            <div className="address-input flex flex-center m-t-10">
              <div className="chainName">
                <img src={require('../../assets/images/user/chain/polygon.png')} alt="" />
              </div>
              <div className="address-content m-l-14">
                <div className="fz-14 c06">Polygon</div>
                <div className="fz-14 cf">{addPoint(props.userInfo.matic, 7)}</div>
              </div>
              <div className="ce pointer bind" onClick={props.userInfo.matic?()=>unbind(137):()=>bind(137)}>{props.userInfo.matic ? 'Unbind':'Bind'}</div>
            </div>
            {/* chainItem */}
            
            {/* chainItem */}
            <div className="address-input flex flex-center m-t-10">
              <div className="chainName">
                <img src={require('../../assets/images/user/chain/solana.png')} alt="" />
              </div>
              <div className="address-content m-l-14">
                <div className="fz-14 c06">Solana</div>
                <div className="fz-14 cf">{addPoint(props.userInfo.sol, 7)}</div>
              </div>
              <div className="ce pointer bind" onClick={props.userInfo.sol?()=>unbind(666):()=>bind(666)}>{props.userInfo.sol ? 'Unbind':'Bind'}</div>
            </div>
            {/* chainItem */}
            
            {/* chainItem */}
            <div className="address-input flex flex-center m-t-10">
              <div className="chainName">
                <img src={require('../../assets/images/user/chain/bnb.svg').default} alt="" />
              </div>
              <div className="address-content m-l-14">
                <div className="fz-14 c06">Binance</div>
                <div className="fz-14 cf">{addPoint(props.userInfo.bsc, 7)}</div>
              </div>
              <div className="ce pointer bind" onClick={props.userInfo.bsc?()=>unbind(97):()=>bind(97)}>{props.userInfo.bsc ? 'Unbind':'Bind'}</div>
            </div>
            {/* chainItem */}
            
            {/* chainItem */}
            <div className="address-input flex flex-center m-t-10">
              <div className="chainName">
                <img src={require('../../assets/images/user/chain/avalanche.svg').default} alt="" />
              </div>
              <div className="address-content m-l-14">
                <div className="fz-14 c06">Avalanche</div>
                <div className="fz-14 cf">{addPoint(props.userInfo.avax, 7)}</div>
              </div>
              <div className="ce pointer bind" onClick={props.userInfo.avax?()=>unbind(43114):()=>bind(43114)}>{props.userInfo.avax ? 'Unbind':'Bind'}</div>
            </div>
            {/* chainItem */}

            {
                  !isAddress ? (
                      <div className="warning flex flex-center c06 p-t-10">
                          <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                          Incorrect address
                      </div>
                  ):''
                }
            <div className="c06 content-font m-t-30">Personal presentation</div>
            <div className="social-input flex flex-center">
              <Input placeholder='Enter Twitter Account' className={"my-input opacity-input content-font  p-l-60 "+(twitter ? 'fwb':'')} value={twitter} onChange={(e) => setTwitter(e.target.value)}></Input>
              <img src={require('../../assets/images/user/tw.svg').default} alt=""  className='tw-icon'/>
            </div>
            <div className="social-input flex flex-center">
              <Input placeholder='Enter Instagram Account' className={"my-input opacity-input content-font  p-l-60 "+(ins ? 'fwb':'')} value={ins} onChange={(e) => setIns(e.target.value)}></Input>
              <img src={require('../../assets/images/user/ins.svg').default} alt=""  className='tw-icon'/>
            </div>
            <div className="social-input flex flex-center">
              <Input placeholder='Enter FaceBook Account' className={"my-input opacity-input content-font  p-l-60 "+(facebook ? 'fwb':'')} value={facebook} onChange={(e) => setFacebook(e.target.value)}></Input>
              <img src={require('../../assets/images/user/fb.svg').default} alt=""  className='tw-icon'/>
            </div>
            
            <div className="social-input flex flex-center">
              <Input placeholder='Enter Website' className={"my-input opacity-input content-font  p-l-60 "+(site ? 'fwb':'')} value={site} onChange={(e) => setSite(e.target.value)}></Input>
              <img src={require('../../assets/images/user/site.svg').default} alt=""  className='tw-icon'/>
            </div>

            <div className="flex flex-between change-margin">
                <span className="pointer content-font cf show-p">Login password</span>
                <span className='show-m'></span>
                <span className="ce pointer" onClick={()=>setShowModify(true)}>
                  <span className='show-m fz-14 flex-1'>Change Password</span>
                  <span className='show-p fz-16 '>Change</span>
                </span>
                <span className='show-m'></span>
            </div>
            <div className="flex  setting-btn">
                <Button loading={loading} className="btn color confirm-btn ta my-button color ta cf btn  w100 my-button" onClick={updateContact}>Save</Button>
            </div>
            
            <Modal title="Unbind" isVisible={showUnbind} showButton={true} onConfirm={unbindConfirm} onClose={()=>{setShowUnbind(false)}}>
                 <div className="c14 fz-20 ta fwb">
                 Confirm to unbind the game address?
                 </div>
            </Modal>
            <Modal title="Bind" isVisible={showBind} showButton={true} onConfirm={bindSol} onClose={()=>{setShowBind(false)}}>
                 <div className="c14 fz-20 ta fwb">
                 Do you want to bind the address: <u>{props.account}</u> ?
                 </div>
            </Modal>
            <Modal isVisible={showModify} title="Change Password" onClose={() => setShowModify(false)}>
              <Modify onSuccess={()=>setShowModify(false)}/>
           </Modal>
           <Modal isVisible={showCropper} title="Edit Avatar" onClose={() => setShowCropper(false)}>
           <Cropper
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              aspectRatio = {1}
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
            <Button onClick={getCropData} loading={loading} className="color ta cf btn m-t-30 w100 my-button">Confirm</Button>
           </Modal>

       </div>
    )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Account
);
