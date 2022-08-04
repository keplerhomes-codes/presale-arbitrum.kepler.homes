import "./Claim.scss"
import {Button, Table} from 'antd'
import { useState } from "react"
import { useEffect } from "react"
import { connect } from 'react-redux'
import { queryBuyRecords } from "../../contract/methods/presale"
import { balanceOf } from "../../contract/methods"
import { addPoint, ChainIdMap, findAddressByName, formatTime, formatTimeShort, fromUnit } from "../../lib/util"
import { format } from "date-fns"
import { get } from "../../http"
import Pagination from "../Base/Pagination"
import { chainSymbolMap } from "../../wallet/helper/getNetworkData"
import store from "../../store"
export default connect(
    (state, props) => {
      return {...state, ...props}
    }
  )( (props)=> {
    let columns = [{
        title: "Address",
        key: "buyer",
        dataIndex: "buyer",
        render: (user, record) => (
          <span className='flex-1' title={user}>{addPoint(user)}</span>
        )
    },{
        title: "Buy amount",
        key: "amount",
        dataIndex: "amount",
        render: (amount, record) => (
          <span className='flex-1'>${Number(fromUnit(amount)).toFixed(2)}</span>
        )
    },{
        title: "Rewards amount",
        key: "reward",
        dataIndex: "reward",
        render: (amount, record) => (
          <span className='flex-1'>${Number(fromUnit(amount)).toFixed(2)}</span>
        )
    },{
        title: "Transition time",
        key: "buyTime",
        dataIndex: "buyTime",
        render: (time, record) => (
          <span className='flex-1'>{formatTime(time)}</span>
        )
    },{
        title: "Hash",
        key: "hash",
        dataIndex: "hash",
        render: (hash, record) => (
          <a className='flex' target="_blank" title={hash} href={`${chainSymbolMap[store.getState().chain]().params.blockExplorerUrls[0]}/tx/${hash}`}>{addPoint(hash)}
          <img src={require('../../assets/images/mint/share.svg').default} className="m-l-5" alt="" />
          </a>
        )
    }]
    let limit = 10
    let [loading, setLoading] = useState(false)
    let [list, setList] = useState([])
    let [page, setPage] = useState(1)
    let [total, setTotal] = useState(0)
    let getRecordData = (page) => {
        setLoading(true)
        get('/api/presale/records', {
            chainId: ChainIdMap[localStorage.getItem('kepler_chain')||'Avalanche'],
            user: props.account.toLowerCase(),
            limit,
            skip: page-1
        }).then(res => {
            setLoading(false)
            setList(res.data.list)
            setTotal(res.data.count)
        })
    }

    let pageChange = (p) => {
      setPage(p)
    }
    useEffect(async()=>{
        if(props.account) {
            getRecordData(page)
        }
        
    },[props.account, page])
    return (
        <div className="claim-wrap">
             <p className="c06 fz-14 invite-tip">Holders whose KEPL asset is over $10,000 could get a referral bonus by inviting others.</p>
            <Table loading={loading} columns={columns} dataSource={list} pagination={false} className="my-table m-t-20" />
            {
              total > 0 && <div className="flex flex-last m-t-20">
              <Pagination currentpage={page} limit={limit} total={total} pageChange={pageChange}/>
              </div>
            }
              
            
        </div>
    )
})