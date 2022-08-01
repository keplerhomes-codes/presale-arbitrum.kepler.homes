import Airnav from "../components/layouts/Airnav"
import Mintfooter from "../components/layouts/Mintfooter"
import './Private.scss'
import { Button, Carousel, Tooltip} from "antd"
import { Collapse, Space } from 'antd';
import { Link } from "react-router-dom"
import arrow1 from '../assets/images/passport/arrow1.svg'
import { tokenList } from "../lib/airdrop"
import {queryVariables, queryClaimers} from '../contract/methods/airdrop'
import { useCallback, useEffect, useState} from "react"
import { addPoint, findNameByAddress, fromUnit, numFormat, toUnit, toWei } from "../lib/util"
import { toFixed } from "accounting"
import videoSrc from './movie.mp4'
import { Tabs } from 'antd';
import {connect} from 'react-redux'
import Private from "../components/Private"
import Claim from "../components/Private/Claim"
import privatetext from "../lib/privatetext"
import notification from "../components/notification";
import Tokenomics from './Tokenomics'
import Record from "../components/Private/Record";
const { Panel } = Collapse;

const { TabPane } = Tabs;





export default connect(
    (state, props) => {
      return {...state, ...props}
    }
  )( (props)=> {
    let [activeKey, setActive] = useState('1')
    let [refresh , setRefresh] = useState(1)
    let onSuccess = () => {
        setRefresh(refresh+1)
    }
    const copyAddress = useCallback(async () => {
        if(!props.account) {
          notification.error({
              message: ('Please connect your wallet first')
            });
            return
         }
        await navigator.clipboard.writeText('https://'+window.location.host+'?referee='+props.account);
        notification.success({
          message: ('Invitation link has been generated, please send it to your friends!'),
        });
      }, [props.account]);
    return (
        <div className="private-wrap w100 m-t-0">
            <Airnav/>
            <img src={require('../assets/images/private/banner.png')} alt="" />
            <div className="last-content">

            <div className="flex private-content flex-between p-b-100">
                  <div className="left-part">
                     <video src={videoSrc} playsInline loop autoPlay muted controls className='video'></video>
                     <Tabs className='my-tab mint-tab' >
                      <TabPane tab="Hightlights" key="0">
                        {
                            privatetext.highlights.map(item => {
                                return <div className="cf fz-16 m-b-20">{item}</div>
                            })
                          }
                      </TabPane>
                      <TabPane tab="veKEPL dividends" key="1">
                          {
                            privatetext.benefits.map(item => {
                                return <div className="cf fz-16 m-b-20">{item}</div>
                            })
                          }
                      </TabPane>
                      <TabPane tab="PreSale Rules" key="2">
                         {
                            privatetext["presale rules"].map(item => {
                                return <div className="cf fz-16 m-b-20">{item}</div>
                            })
                          }
                      </TabPane>
                      
                      <TabPane tab="Tokenomics" key="3">
                         <Tokenomics width={500}/>
                      </TabPane>
                      <TabPane tab="FAQ" key="4">
                      <Space direction="vertical" size={0}>
                      {
                            privatetext["faq"].map(item => {
                                return (
                                    <Collapse  expandIcon={() => <img src={arrow1} alt="" className="arrow" />} expandIconPosition="right">
                                        <Panel header={item.q}>
                                        {item.a}
                                        </Panel>
                                    </Collapse>
                                )
                            })
                          }
                        
                        </Space>
                      
                      </TabPane>
                      <TabPane tab="Claim" key="5">
                          <Claim refresh={refresh}/>
                      </TabPane>
                      
                      <TabPane tab="Invite Record" key="6">
                          <Record/>
                      </TabPane>
               
               
                     </Tabs>
                  </div>
                  <div className="right-part flex flex-column">
                      <Private onSuccess={onSuccess}/>
                      <div className="invite-area w100 m-t-24 flex flex-center">
                           <div className="cf">
                              You can get <span className="percent-num">5%</span> of your friend's purchase amount as a reward by inviting friends. 
                           </div>
                           <div className="flex flex-center invite-btn-area">
                            <Button className="invite-btn fz-14" onClick={copyAddress}>
                                Invite Friends
                            </Button>
                            <Tooltip title="Holders whose KEPL asset is over $10,000 could get a referral bonus by inviting others.">
                                        <span>
                                        <img className='m-l-3' src={require('../assets/images/passport/question.svg').default} alt="" />
                                        </span>
                                </Tooltip>
                           </div>
                           
                      </div>
                  </div>
            </div>

            <Mintfooter/>
            </div>
        </div>
    )
})