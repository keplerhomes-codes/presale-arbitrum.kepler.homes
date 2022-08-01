import { useEffect, useState } from 'react'
import './Filter.scss'
import { Switch } from 'antd'
import {findNameByAddress} from '../../lib/util'
import Nftlist from '../../contract/testnet/Nftlist'
import { t } from 'i18next'

export default function ({currencys, filterChange}) {
    let [categories, setCategories] = useState([])
    let [currenies, setCurrenies] = useState([])
    let [showDialog, setShowDialog] = useState(false)
    let stopPropagation = (e) => {
        e.nativeEvent.stopImmediatePropagation();
    }
    let show = (e) =>{
        setShowDialog(!showDialog)
        e.nativeEvent.stopImmediatePropagation();
    }
    let clickCate = (tokenId) => {
        
        setCategories([tokenId])
        // let temp = [...categories]
        // if(temp.some(i=> i == tokenId)) {
        //     temp = temp.filter(i => i != tokenId)
        //     setCategories(temp)
        // } else {
        //     temp.push(tokenId)
        //     setCategories(temp)
        // }
    }
    
    let clickCurr = (curr) => {
        setCurrenies([curr])
        // multi
        // let temp = [...currenies]
        // if(temp.some(i=> i == curr)) {
        //     temp = temp.filter(i => i != curr)
        //     setCurrenies(temp)
        // } else {
        //     temp.push(curr)
        //     setCurrenies(temp)
        // }
    }
    useEffect(()=>{
        filterChange({
            categories,
            currenies
        })
    }, [currenies, categories])
    useEffect(() => {
        window.addEventListener('click', function(){
            setShowDialog(false)
        })
    }, [])
    return (
        <>
            <div className='filter pointer show-p'>
                <div className={'cf fz-16  filter-wrap p-t-10 p-b-10 p-r-32 p-l-32 ' + (showDialog ? 'active':'normal')} onClick={show}>
                    {
                        showDialog ?
                        <img src={require('../../assets/images/base/shaixuanactive.svg').default} alt="" className='m-r-10'/>
                        :
                        <img src={require('../../assets/images/base/shaixuan.svg').default} alt="" className='m-r-10'/>
                    }
                    Filter
                </div>
                {
                    showDialog ? (
                        <div className="dialog p-t-14 p-l-10 p-b-14 p-r-10" onClick={stopPropagation}>
                            <div className="filter-bar flex flex-center p-10">
                                <div className="filter-type fz-16">Category</div>
                                <div className="flex flex-wrap flex-center ">
                                    <span className={"cf fz-16 filter-item " + (categories.length == 0 ? 'active':'')} onClick={_=>{setCategories([])}}>All</span>
                                    {
                                        Nftlist.map(item => {
                                            return <span key={item.symbol} className={"cf fz-16 filter-item " + (categories.some(i => i == item.symbol) ? 'active':'')} onClick={_=> clickCate(item.symbol)}>{item.symbol}</span>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="filter-bar flex flex-center p-10">
                                <div className="filter-type fz-16">Currency</div>
                                <div className="flex flex-wrap flex-center">
                                    <div className={"cf fz-16 filter-item " + (currenies.length == 0 ? 'active':'')} onClick={_=> setCurrenies([])}>All</div>
                                    {
                                        currencys.map(item => {
                                            return (
                                            findNameByAddress(item) ?  
                                            <div key={item} className={"cf fz-16 filter-item " + (currenies.some(i => i == item) ? 'active':'')} onClick={_=> clickCurr(item)}>{findNameByAddress(item)}</div>
                                            :''
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    ):''
                }
            </div>
            <div className='show-m filter-m'>
                <div className='cf pointer fz-14 color filter-m-btn flex flex-center flex-middle' onClick={show}>
                    <img src={require('../../assets/images/base/shaixuan.svg').default} alt="" className='m-r-10'/>
                    Filter
                </div>
                {showDialog ?
                    <div className="filter-window flex flex-column" >
                    <div className="close-btn flex flex-last p-15">
                        <img src={require('../../assets/images/market/close.svg').default} alt="" />
                    </div>
                    <div className="filter-content flex-1 p-l-15 p-r-15 p-b-15" onClick={stopPropagation}>
                    <div className=''>
                        <span className='c06 fz-14 m-r-10 filter-type'>{t('My favorite')}</span>
                        <Switch size='small' className='my-switch'/>
                    </div>
                    <div className="filter-bar flex   flex-column ">
                                <div className="filter-type c06 fz-14">Category:</div>
                                <div className="flex flex-wrap  flex-column flex-ab">
                                    <div className={"cf fz-14 filter-item " + (categories.length == 0 ? 'active':'')} onClick={_=>{setCategories([])}}>All</div>
                                    {
                                        Nftlist.map(item => {
                                            return <div key={item.symbol} className={"cf fz-14 filter-item " + (categories.some(i => i == item.symbol) ? 'active':'')} onClick={_=> clickCate(item.symbol)}>{item.symbol}</div>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="filter-bar flex flex-column ">
                                <div className="filter-type fz-14 c06">Currency:</div>
                                <div className="flex flex-wrap  flex-column flex-ab">
                                    <div className={"cf fz-14 filter-item " + (currenies.length == 0 ? 'active':'')} onClick={_=> setCurrenies([])}>All</div>
                                    {
                                        currencys.map(item => {
                                            return <div key={item} className={"cf fz-14 filter-item " + (currenies.some(i => i == item) ? 'active':'')} onClick={_=> clickCurr(item)}>{findNameByAddress(item)}</div>
                                        })
                                    }
                                </div>
                            </div>


                    </div>
                </div>:''
                }
                
            </div>
        </>
        
    )
}