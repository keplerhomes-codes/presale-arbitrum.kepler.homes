import './Faq.scss'
import { useEffect, useState} from 'react'
import { Collapse, Space, Tabs, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import arrow from '../assets/images/faq/arrow.svg'
import classNames from 'classnames';
import { get } from '../http';

const { Panel } = Collapse;

const { TabPane } = Tabs;

export default function () {
  let params = useLocation()
  let [defaultTab, setDefaultTab] = useState(useLocation().search ? useLocation().search.replace('?','').split('=')[1]?.toLowerCase():'')
  const [tabIndex, setTabIndex] = useState(0)
  let [faq, setFaq] = useState({})
  let [loading, setLoading] = useState(true)

  useEffect(()=> {
    get('/api/faq').then(res => {
      setFaq(res.data.faq)
      setLoading(false)
    })
  }, [])

  return (
    <div className="faq">
      <div className="fwb faq-title">FAQ</div>
      <div className="faq-content">
        {
          loading ?
          <div className="w100 flex flex-center flex-middle">
           <Spin></Spin>
          </div>
           :
          <Tabs className='my-tab' defaultActiveKey={defaultTab}>
          { 
            (() => {
              let content = []
              for(let i in faq) {
                content.push(
                  <TabPane tab={i} key={i.toLowerCase()}>
                    <Space direction="vertical" size={15}>
                      {
                         faq[i].map((item, index)=>{
                             return (
                              <Collapse key={index} expandIcon={() => <img src={arrow} alt="" className="arrow" />} expandIconPosition="right">
                                <Panel header={item.question}>
                                  <p dangerouslySetInnerHTML={{__html: item.answer}}></p>
                                </Panel>
                              </Collapse>
                             )
                         })
                      }
                    </Space>
                  </TabPane>
                )
                
              }
              return content
            })()
          }
                
        </Tabs>
        }
      </div>
    </div>
  )
}