import './Share.scss'
import { post } from '../../http';
import { useState, useCallback } from 'react';
import store from '../../store';
import { showLogin } from '../../lib/util';
import notification from '../notification';
import { useTranslation} from 'react-i18next'
export default function ({info, showFav=true}) {
    let{t} = useTranslation()
    let [nftInfo, setNftInfo] = useState(info)
    let [innerFavoirte, setInnerFavorite] = useState(0)
    console.log(info)
    
  const copyAddress = useCallback(async () => {
    
    await navigator.clipboard.writeText('https://'+window.location.host+'/NFT/'+info.orderId);
    notification.success({
      message: t('Copy finished'),
    });
  }, [info.orderId]);
let toFav = useCallback((e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if(! store.getState().token) {
        showLogin()
        return
    }
    post('/api/v1/token/favorite', {
        chainId: 97,
        tokenId: info.tokenId
    }).then(res => {
        console.log(res.data)
        setNftInfo({...nftInfo, isFavorite: res.data.favorite, favorite: res.data.count})
        setInnerFavorite(res.data.count)
    })
}, [info])
    return (
        <div className='cf flex flex-center'>
            <img src={require('../../assets/images/base/fenxiang.svg').default} alt="" onClick={copyAddress} className='pointer'/>
            
            { 
                showFav ?(nftInfo.isFavorite ? 
                <img  onClick={toFav} src={require('../../assets/images/base/xin_active.svg').default} alt="" className='m-l-16'/>
                :
                <img onClick={toFav} src={require('../../assets/images/base/xin.svg').default} alt="" className='m-l-16'/>
                ):''}
             {showFav ?<span className="cf fz-14 m-l-4">{innerFavoirte || info.favorite||'0'}</span>:''}
        </div>
    )
}