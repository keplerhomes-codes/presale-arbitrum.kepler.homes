import './Nft.scss'
import {NavLink} from 'react-router-dom'
import Share from '../../components/Market/Share'
import { post } from '../../http'
import { useEffect, useState} from 'react'
import { findNameByAddress, findNameByTokenId} from '../../lib/util'
export default function ({info}) {
    let [detail, setDetail] = useState({})
    // useEffect(()=> {
    //     try {
    //         post('/api/token/metadata', {
    //             chainId: 97,
    //             tokenIds: 100000000
    //         }).then(res => {
    //             setDetail(res.data[100000000])
    //         })
    //     }catch(err) {

    //     }
    // }, [])

    return (
        <div className='nft m-t-40 pointer tangle-border'>
            <div className="cover">
                <NavLink to={"/NFTDETAIL/"+info.orderId}>
                <img src={info.image || require('../../assets/images/nft/cover.png')} className='cover-img' alt="" />
                </NavLink>
                <div className="time pad cf fz-14">24:45:30</div>
                <div className="share-desc pad cf fz-14"><Share info={info} favorite={info.favorite}/></div>
                <div className="price-desc pad cf fz-14">Bidding</div>
            </div>
            <div className="name cf fz-18 fw500 m-t-30">{findNameByTokenId(info.tokenId)}-{info.name}</div>
            <div className="price-area flex  flex-between flex-center m-t-20">
                <span className="fz-14 c56">Price</span>
                <span className="flex flex-center">
                    <img src={require('../../assets/images/token/USDT.svg').default} alt="" />
                    <span className='fz-18 fw500 cf  m-l-5'>{info.tradeUsd} {findNameByAddress(info.currency||'')}</span>
                </span>
            </div>
            {/* <div className="flex  flex-between flex-last m-t-4">
                <span className="fz-14 c56">≈ ${info.tradeUsd}</span>
            </div> */}
            <div className="price-area flex  flex-between flex-center m-t-5">
                <span className="fz-14 c56">Token ID</span>
                <span className="flex flex-center">
                    <span className='fz-18 fw500 cf  m-l-5'>{info.tokenId}</span>
                </span>
            </div>

            <div className="str top"></div>
            <div className="str right"></div>
            <div className="str left"></div>
            <div className="str bottom"></div>
        </div>
    )
}