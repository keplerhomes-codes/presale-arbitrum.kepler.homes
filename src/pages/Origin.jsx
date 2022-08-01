import './Market.scss'
import Filter from "../components/Base/Filter"
import Banner from "../components/Market/Banner"
import Search from "../components/Base/Search"
import Select from "../components/Base/Select"
import Pagination from "../components/Base/Pagination"
import Nft from "../components/Market/Nft"
import {Switch} from 'antd'
import { get } from '../http'
import { useEffect, useState } from 'react'
import Nftlist from '../contract/testnet/Nftlist'
import { getToken, getItem,approve, tokensOfOwner, close, buy, listNft,listest, setApprovalForAll} from '../contract/methods'
import {connect, useSelector} from 'react-redux'
import store from '../store'
import {findAddressByName, showLogin} from '../lib/util'
import Nftmarket from '../contract/testnet/Nftmarket'
import ADDRESS from '../contract/testnet/address'

export default function () {
  let account = useSelector(state => {
    return state.account
   })
  useEffect(async ()=>{
    console.log(account)
    if(!account) {
      return
    }
    console.log(findAddressByName('Helmet'))
    let tokenIds = await tokensOfOwner(findAddressByName('Helmet'), account)
    console.log(tokenIds)
    // approve(findAddressByName('KEPL'), ADDRESS.NFTMarket)
    // return
    // buy('202202200024327228030001')
    // close('202202181051094520150001')
    // setApprovalForAll(findAddressByName('Helmet'))
    // return
    listNft(
      tokenIds[0],
      findAddressByName('Helmet'),
      findAddressByName('KEME'),
      '200'
    ).then(res => {
      console.log(res)
    })
  }, [account])
  return (
    <div className="market ">
      {/* <Header hasBg={true}/> */}
      <Banner/>
       <div className='w100 p-t-60 p-l-40 p-r-40 p-b-60'>
          {/* <div className="flex flex-between">
            <Filter/>
            <div className="flex flex-center">
              <div className='m-r-20'>
                <span className='cf fz-16 m-r-10'>My favorite</span>
                <Switch size='small' className='my-switch'/>
              </div>
              <Search/>
              <Select/>
              <Pagination/>
            </div>
          </div> */}
          <div className="flex flex-wrap w100 flex-around">
            {
              // Nftlist.map((item,index)=> {
              //   return <Nft info={item} key={index}/>
              // })
            }
          </div>

        
       </div>
       
      {/* <Footer /> */}
    </div>
  )
}