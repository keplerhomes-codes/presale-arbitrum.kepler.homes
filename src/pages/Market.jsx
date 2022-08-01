import './Market.scss'
import Filter from "../components/Base/Filter"
import Banner from "../components/Market/Banner"
import Search from "../components/Base/Search"
import Select from "../components/Base/Select"
import Pagination from "../components/Base/Pagination"
import Nft from "../components/Market/Nft"
import {Spin, Switch} from 'antd'
import { get } from '../http'
import { useEffect, useState } from 'react'
import { getSupportedCurrencies} from '../contract/methods'
import store from '../store'
import { findAddressByName, ChainIdMap} from '../lib/util'
import { useTranslation} from 'react-i18next'
import { PropertySafetyFilled } from '@ant-design/icons'
import {connect, useSelector} from 'react-redux'
import { setToken, setUserInfo } from '../store';
const Offset = () => {
  return (
    <div className="nft"></div>
  )
}
export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)((props)=> {
  let limit = 10
  let { t ,i18n} = useTranslation()
  let [loading, setLoading] = useState(true)
  let [list, setList] = useState([])
  let [page, setPage] = useState(1)
  let [total, setTotal] = useState(0)
  let [currencys, setCurrencys] = useState([])
  let [favorite, setFavorite] = useState(false)
  let [sort, setSort] = useState(0)
  let [itemName, setItemName] = useState('')
  let [filter, setFilter] = useState({
    categories: [],
    currenies: []
  })
  
let selectOptions = [
  {
    label: t('Recently listed'),
    value: 0
  },
  {
    label: t('Price low-high'),
    value: 1
  },
  {
    label: t('Price high-low'),
    value: 2
  },
  {
    label: t('Most favorited'),
    value: 3
  } 
]
  let pageChange = (p) => {
    setPage(p)
  }
  let filterChange = (flt) => {
    setFilter(flt)
  }
  useEffect(async () => {
    let currency = await getSupportedCurrencies()
    console.log(currency)
    setCurrencys(currency)
  }, [])
  useEffect(()=>{
    setLoading(true)
    console.log(filter)
    get(`/api/marketplace/order`, {
      chainId:ChainIdMap[props.chain],
      user:store.getState().account,
      limit,
      skip:page-1,
      prefix:filter.categories.length ? findAddressByName(filter.categories[0]):'999',
      currency :filter.currenies.length ? filter.currenies[0]:'',
      favorite,
      tokenId: itemName,
      sort
    }).then(res => {
      setLoading(false)
      setList(res.data.orders)
      setTotal(res.data.count)
    })
  }, [page,sort,filter,favorite, itemName])
  return (
    <div className="market ">
      {/* <Header hasBg={true}/> */}
      <Banner/>
       <div className='w100 market-content'>
          <div className="flex flex-between">
            <Filter currencys={currencys} filterChange={filterChange} />
            <div className="flex flex-center">
              <div className='m-r-20 show-p'>
                <span className='cf fz-16 m-r-10'>{t('My favorite')}</span>
                <Switch size='small' className='my-switch' onChange={setFavorite}/>
              </div>
              <Search onChange={e=>setItemName(e.target.value)}/>
              <Select onChange={setSort} options={selectOptions}/>
              <Pagination currentpage={page} limit={limit} total={total} pageChange={pageChange}/>
            </div>
          </div>
          {
            loading ? (
              <div className="w100 flex flex-center flex-middle p-100">
                <Spin size="large"></Spin>
              </div>
            ):
            <div className="flex flex-wrap w100 flex-around">
            {
              list.map(item => {
                return <Nft info={item} key={item.orderId}/>
              })
            }
            <Offset />
            <Offset />
            <Offset />
            <Offset />
          </div>
          }
         

        
       </div>
       
      {/* <Footer /> */}
    </div>
  )
})