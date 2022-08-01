import './Market.scss'
import Filter from "../components/Base/Filter"
import Banner from "../components/Market/Banner"
import Search from "../components/Base/Search"
import Select from "../components/Base/Select"
import Pagination from "../components/Base/Pagination"
import Nft from "../components/Market/MyNft"
import Header from '../components/layouts/Header'
import Footer from '../components/layouts/Footer'
import {Tabs} from 'antd'
import {Link} from 'react-router-dom'
import {itemsOfOwner} from '../contract/methods/mint'
import {connect, useSelector} from 'react-redux'
import { useEffect, useState} from 'react'
import NftList from '../contract/testnet/Nftlist'
import { get, post} from '../http'
import { tokensOfOwner } from '../contract/methods'
import { findAddressByName, findNftIdByAddress, findNameByAddress } from '../lib/util'
import { ConsoleSqlOutlined } from '@ant-design/icons'
import Empty from '../components/Farm/Empty'
let {TabPane} = Tabs
const Offset = () => {
  return (
    <div className="nft"></div>
  )
}

const NftItem = ({nft,nftTokenId}) => {
  const [detail, setDetail] = useState({})
  console.log(nft,nftTokenId)
  useEffect(async ()=>{
    if(nft && nftTokenId) {
      let result =  await get(`/api/token/${nft}/${nftTokenId}`)
      console.log(result)
      setDetail(result)
    }

  }, [nft, nftTokenId])

 return (
  <Link to="/NFT" state={{nftId: nft, tokenId: nftTokenId}}>
     <div className='nft m-t-40 pointer tangle-border'>
          <img src={detail.image} alt="" />
       <div className='fz-14 cf m-t-10'>
         {NftList[nft-1].symbol} #{nftTokenId}
       </div>
       
            <div className="str top"></div>
            <div className="str right"></div>
            <div className="str left"></div>
            <div className="str bottom"></div>
     </div>
    </Link>
 )
}


export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)( (props)=> {
  let [list, setList] = useState([])
  let [nftList, setNftList] = useState([])
  useEffect( async ()=>{
    if(props.account) {
      let listdata = await itemsOfOwner(props.account)
      console.log(listdata)
      listdata && setList(listdata)
      let p = []
      NftList.map(async item => {
        console.log(item)
        p.push(tokensOfOwner(findAddressByName(item.symbol), props.account))
      })
      Promise.all(p).then(res => {
        let nfts = []
        res.map((item, index) => {
            item.map(inner => {
              nfts.push({
                nftId: index+1,
                tokenId: inner
              })
            })
        })
        setNftList(nfts)
      })
    }
  }, [props.account])
  
  return (
    <div className="market ">
      {/* <Header hasBg={true}/> */}
       <div className='w100 market-my-content p-l-40 p-r-40 p-b-60'>
       <Tabs defaultActiveKey="0" className='my-tab m-t-20'>
                <TabPane tab="My NFT" key="0">
                  {
                    nftList.length ? 
                    <div className="flex flex-wrap w100 flex-around">
                    {
                      nftList.map((item, index) => {
                        return (<NftItem nft={item.nftId} nftTokenId={item.tokenId} key={index}/>)
                      })
                    }
                    {/* <Nft/>
                    <Nft/>
                    <Nft/>
                    <Nft/> */}
                    
                    <Offset/>
                    <Offset/>
                    <Offset/>
                    <Offset/>
                  </div>:
                  <div className="flex flex-wrap w100 flex-around">
                    <Empty/>
                   </div>
                  }
                  
                </TabPane>
                <TabPane tab="Open Mystery Box" key="1">
                  {
                    list.length ?
                    <div className="flex flex-wrap w100 flex-around">
                    {list.map((item, index) => {
                      return <Nft tokenId={item}/>
                    })
                    }
                    <Offset/>
                    <Offset/>
                    <Offset/>
                    <Offset/>
                  </div>:
                  <div className="flex flex-wrap w100 flex-around">
                   <Empty/>
                  </div>
                  }
                  
                </TabPane>
        </Tabs>
         

        
       </div>
       
      {/* <Footer /> */}
    </div>
  )
}
);