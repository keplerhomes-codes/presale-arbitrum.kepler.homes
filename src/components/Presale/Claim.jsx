import "./Claim.scss"
import {Button, Table} from 'antd'
import { useState } from "react"
import { useEffect } from "react"
import { connect } from 'react-redux'
import { queryBuyRecords } from "../../contract/methods/presale"
import { balanceOf } from "../../contract/methods"
import { findAddressByName, formatTimeShort, fromUnit, numFormat, toFixed } from "../../lib/util"
import { format } from "date-fns"
export default connect(
    (state, props) => {
      return {...state, ...props}
    }
  )( (props)=> {
    let columns = [{
        title: "Date",
        key: "date"
    },{
        title: "Claim Amount",
        key: "amount"
    }]
    let list = []
    let [loading, setLoading] = useState(false)
    let [balance, setBalance] = useState(0)
    let [total, setTotal] = useState(0)
    let [endDate, setEndDate] = useState(0)

    useEffect(async()=>{
        if(props.account) {
            let records = await queryBuyRecords(props.account)
            let vBal = await balanceOf(findAddressByName('veKEPL'), props.account)
            console.log(records)
            let tl = 0
            let enddate = 0
            records.map(item => {
                tl += Number(fromUnit(item.vTokenAmount))
                let buyDate = new Date(item.buyTime*1000)
                let until = new Date(buyDate.getFullYear(), buyDate.getMonth()*1+1+Number(item.lockPeriods), buyDate.getDate()).getTime()
                if(until > enddate) {
                    enddate = until
                }
            })
            console.log(enddate)
            setEndDate(enddate)
            setTotal(tl)
            setBalance(vBal)
        }
        
    },[props.account, props.refresh])
    return (
        <div className="claim-wrap">
            <div className="claim-info flex flex-wrap flex-between">
                {/* one-item */}
                <div className="claim-item m-t-10 flex flex-column flex-center flex-middle">
                    <span className="cblue fz-20 fwb">{numFormat(toFixed(total, 2))}</span>
                    <span className="fz-14 c06">Total KEPL</span>
                </div>
                 {/* one-item */}
                <div className="claim-item m-t-10 flex flex-column flex-center flex-middle">
                    <span className="cblue fz-20 fwb">0</span>
                    <span className="fz-14 c06">Claimed</span>
                </div>
                 {/* one-item */}
                <div className="claim-item m-t-10 flex flex-column flex-center flex-middle">
                    <span className="cblue fz-20 fwb">{numFormat(toFixed(total, 2))}</span>
                    <span className="fz-14 c06">Uncliam</span>
                </div>
                 {/* one-item */}
                <div className="claim-item m-t-10 flex flex-column flex-center flex-middle">
                    <span className="cblue fz-20 fwb">{numFormat(toFixed(fromUnit(balance), 2))}</span>
                    <span className="fz-14 c06">veKEPL Balance</span>
                </div>
                 {/* one-item */}
                <div className="claim-item m-t-10 flex flex-column flex-center flex-middle">
                    <span className="cblue fz-20 fwb">0</span>
                    <span className="fz-14 c06">veKEPL Burned</span>
                </div>
                 {/* one-item */}
                <div className="claim-item m-t-10 flex flex-column flex-center flex-middle">
                    {/* <span className="cblue fz-20 fwb">{endDate ? formatTimeShort(endDate):'--'}</span> */}
                    <span className="cblue fz-20 fwb">To be announced</span>
                    <span className="fz-14 c06">Release complete until</span>
                </div>
                <div className="claim-item-offset m-t-10"></div>
                <div className="claim-item-offset m-t-10"></div>
                
            </div> 
            <div className="flex flex-between p-t-24 p-b-24 claim-area">
                <div className="flex flex-start flex-column">
                    <span className="cf fz-24 fwb">0 KEPL</span>
                    <span className="c06">Avaiable</span>
                </div>
                <Button className="claim-btn cf fz-16 fwb" disabled>
                   Not yet started to Claim
                </Button>
            </div>
            <div className="cf fz-16 p-t-24 p-b-24">
                Claim Histroy
            </div>
            <Table loading={loading} columns={columns} dataSource={list} pagination={false} className="my-table" />

             
        </div>
    )
})