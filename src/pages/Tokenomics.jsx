import './Tokenomics.scss'
import { useEffect, useState} from 'react'
// import HighchartsReact  from 'highcharts-react-official'
import { useTranslation} from 'react-i18next'
import { useLocation } from 'react-router-dom';
import Release from '../components/Charts/Release'
import {Tabs} from 'antd'
import Token from '../components/Charts/Token'
import privatetext from '../lib/privatetext';
let {TabPane} = Tabs

export default function ({width=700}) {
  let { t ,i18n} = useTranslation()
  console.log(useLocation().search ? useLocation().search.replace('?','').split('=')[1]?.toLowerCase():'tokenomics')
  let [defaultTab, setDefaultTab] = useState(useLocation().search ? useLocation().search.replace('?','').split('=')[1]?.toLowerCase():'tokenomics')
  return (
    <div className={"tokenomic flex flex-column flex-middle flex-center "+(' p-t-'+(width-550))}>
      {/* '{point.name}: <b>{point.percentage:.1f}%</b>' */}
      {/* left-part */}
      <Tabs defaultActiveKey={defaultTab}  className='my-tab m-t-20'>
                <TabPane tab={t('Tokenomics')} key="Tokenomics">
                  <div style={{width: '1400px', maxWidth: '100%'}}>
                    <Token width={width}/>
                  </div>
                </TabPane>
                <TabPane tab={t('Release Rules')} key="releaserules">
                  <div className='w100' style={{width: '1400px', maxWidth: '100%'}}>
                  <Release/>
                </div>
                   
                </TabPane>
                <TabPane tab="veKEPL dividends" key="1">
                    {
                      privatetext({presaleConfig:{}}).benefits.map(item => {
                          return <div className="cf fz-16 m-b-20">{item}</div>
                      })
                    }
                </TabPane>
        </Tabs>
      
      
      
    </div>
  )
}