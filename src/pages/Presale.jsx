import Airnav from "../components/layouts/Airnav"
import Mintfooter from "../components/layouts/Mintfooter"
import './Presale.scss'
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
import Presale from "../components/Presale"
import Claim from "../components/Presale/Claim"
import privatetext from "../lib/privatetext"
import notification from "../components/notification";
import Tokenomics from './Tokenomics'
import Record from "../components/Presale/Record";
const { Panel } = Collapse;

const { TabPane } = Tabs;

const Raffle = () => {
  return <div>
     <div className="fz-20 fwb cf">Raffle Rules</div>
     <div className="c06 fz-16 m-t-10">When the number of participants in presale reaches 2000, 
     we will randomly select 100 lucky users, each of whom will receive a bonus of $100, 
     totaling $10,000. Users can query the winning status on this page, and the winning 
     users need to click the claim button on this page to receive the bonus.</div>
     <div className="m-t-20 fz-16 flex flex-center">
       <div className="raffle-title c06 " style={{width: 180}}>Tech support</div>
       <div className="raffle-title fwb cf"><img src={require('../assets/images/private/chainlink.png')} alt="" height={30}/></div>
     </div>
     <div className="m-t-20 fz-16 flex flex-center">
       <div className="raffle-title c06 " style={{width: 180}}>Raffle status</div>
       <div className="raffle-title fwb cf">Not Started</div>
     </div>

     <div className="m-t-20 fz-16 flex flex-center">
       <div className="raffle-title c06 " style={{width: 180}}>Your bonus</div>
       <div className="raffle-title fwb cf">-- <Button className="claim-raffle-btn bgblue cf  disabled bdr-15" disabled>Claim</Button></div>
     </div>

     <div className="m-t-20 fz-16 flex flex-center">
       <div className="raffle-title c06 " style={{width: 180}}>Twitter link</div>
       <div className="raffle-title fwb cf flex flex-center">
          <img src={require('../assets/images/private/twitter.svg').default} alt="" height={30}/>
          <a href="https://twitter.com/KeplerHomes/status/1600830126824239105" target="_blank" className="cblue fwb fz-18 underline m-l-5">Twitter</a>
       </div>
     </div>

  </div>
}




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
        await navigator.clipboard.writeText('https://'+window.location.host+'?code='+props.account);
        notification.success({
          message: ('The invitation link has been copied. Please paste it to your friends!'),
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
                     <Tabs className='my-tab mint-tab' tabPosition="top" defaultActiveKey="0" >
                      <TabPane tab="Hightlights" key="0">
                        {
                            privatetext(props).highlights.map((item, index) => {
                                return <div className="cf fz-16 m-b-20" key={index}>{item}</div>
                            })
                          }
                      </TabPane>
                      
                      <TabPane tab="PreSale Rules & FAQ" key="2">
                         {
                            privatetext(props)["presale rules"].map((item, index) => {
                                return <div className="cf fz-16 m-b-20" key={index}>{item}</div>
                            })
                          }
                          <div className="fz-24 fwb cf m-b-20">FAQ</div>
                          <Space direction="vertical" size={0}>
                      {
                            privatetext(props)["faq"].map((item, index) => {
                                return (
                                    <Collapse key={index}  expandIcon={() => <img src={arrow1} alt="" className="arrow" />} expandIconPosition="right">
                                        <Panel header={item.q}>
                                        {item.a}
                                        </Panel>
                                    </Collapse>
                                )
                            })
                          }
                        
                        </Space>
                      </TabPane>
                      
                      {/* <TabPane tab="Tokenomics" key="3">
                         <Tokenomics width={500}/>
                      </TabPane> */}
                      <TabPane tab="Claim" key="5">
                          <Claim refresh={refresh}/>
                      </TabPane>
                      
                      {/* <TabPane tab="Invite Record" key="6">
                          <Record/>
                      </TabPane> */}
               
{/*                       
                      <TabPane tab="Raffle" key="7">
                          <Raffle/>
                      </TabPane> */}
               
                     </Tabs>
                  </div>
                  <div className="right-part flex flex-column">
                      <Presale onSuccess={onSuccess}/>
                      {/* <div className="invite-area w100 m-t-24 flex flex-center">
                           <div className="cf">
                              You can get <span className="percent-num">5%</span> of your friend's purchase amount as a reward by inviting friends. 
                           </div>
                           <div className="flex flex-center invite-btn-area">
                            <Button className="invite-btn fz-14" onClick={copyAddress}>
                                Invite Friends
                            </Button>
                            <Tooltip title="You can get a referral bonus by inviting others.">
                                        <span>
                                        <img className='m-l-3' src={require('../assets/images/passport/question.svg').default} alt="" />
                                        </span>
                                </Tooltip>
                           </div>
                           
                      </div> */}
                  </div>
            </div>

            <Mintfooter/>
            </div>
        </div>
    )
})