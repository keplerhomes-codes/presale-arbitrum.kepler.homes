// import './Tokenomics.scss'
import { useEffect, useState} from 'react'
import Highcharts from 'highcharts'
// import HighchartsReact  from 'highcharts-react-official'
import { useTranslation} from 'react-i18next'
import highcharts3d  from 'highcharts/highcharts-3d'
import { Tooltip } from 'antd'

highcharts3d(Highcharts)
const colors = ['#CE8544','#AA3961','#1D997F','#9657A6','#085884','#212A38','#823232','#877564','#799990','#2E3689','#33bad7']

export default function ({width=700}) {
  let { t ,i18n} = useTranslation()
  const list = [
    {name: 'Seed', y:7, num: '71,680,000', selected: true, sliced: true, desc: '0% unlocked at TGE, 2 month cliff, with remaining 100% released monthly linearly over 36 months (2.78% per month)'},
    {name: 'Private Sale',  num: '122,880,000', y:12, selected: true, sliced: true, desc: '0% unlocked at TGE, 2 month cliff, with remaining 100% released monthly linearly over 36 months (2.78% per month)'},
    {name: 'Marketing',num: '71,680,000', y:7, selected: true, sliced: true, desc: '0% unlocked at TGE, 100% released monthly linearly over 5 years (1.67% per month)'},
    {name: 'Public Sale', num: '20,480,000', y:2, selected: true, sliced: true, desc: '100% unlocked at TGE'},
    {name: 'Fundation',num: '102,400,000', y:10, selected: true, sliced: true, desc: '0% unlocked at TGE, 1 year cliff, 100% released monthly linearly over 4 years (2.08% per month)'},
    {name: 'DAO',num: '51,200,000', y:5, selected: true, sliced: true, desc: '0% unlocked at TGE, 6 month cliff, 100% released monthly linearly over 4.5 years (1.85% per month)'},
    {name: 'Token&NFT Staking', num: '204,800,000',y: 20, selected: true, sliced: true, desc: '0% unlocked at TGE, 10% released monthly in the 1st year (0.83% per month), and the remaining 90% will be released monthly for 4 years after that (1.875% per month)'},
    {name: 'Code Contributor & UGC',num: '204,800,000', y:20, selected: true, sliced: true, desc: '0% unlocked at TGE, 9 month cliff, 100% released monthly linearly over 4.25 years (1.96% per month)'},
    {name: 'Liquidity',num: '51,200,000', y:5, selected: true, sliced: true, desc: '10% unlocked at TGE, remaining 90% released quarterly linearly over 2.5 years (10% per quarter)'},
    {name: 'Advisor', num: '30,720,000',y:3, selected: true, sliced: true, desc: '0% unlocked at TGE, 3 month cliff, 8.325% released monthly in the 1st year (0.925% per month), and the remaining 91.675% will be released monthly for 4 years after that (1.91% per month)'},
    {name: 'Team',num: '92,160,000', y:9, selected: true, sliced: true, desc: '0% unlocked at TGE, 1 month cliff, 15.28% released monthly in the 1st year (1.38% per month), and the remaining 84.72% will be released monthly for 2 years after that (3.53% per month)'},
  ]
   useEffect(() => {
    Highcharts.chart('container', {
      credits: { 
        enabled: false
      },
      chart: {
        type: 'pie',
        backgroundColor:'rgba(0,0,0,0)',//改变背景颜色
        options3d: {
          enabled: true,
          alpha: 50,
          beta: 50
        }
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      colors: colors,
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 50,
          innerSize: '50%',
          dataLabels: { 
            enabled: true,
            color: '#fff',
            distance: 10,
            formatter: function () {
               return (
                 `<div class="ffd" style="font-size: 18px;font-weight: bold; color: ${colors[this.point.index]}">${this.point.percentage.toFixed(0)}%</div><br/>
                  <div class="ffd">${this.point.name}</div>
                 `
               )
            }
          }
        }
      },
      series: [{
        type: 'pie',
        name: '% Token Allocation',
        data: list
      }]
    });
   }, [])
  return (
    <div className={"tokenomic-inner flex flex-column flex-middle flex-center "}>
      {/* '{point.name}: <b>{point.percentage:.1f}%</b>' */}
                  
                    <div className="tokenomic-title cf fwb w100 ta">{t('Tokenomics')}</div>
                    <div className="w100 flex m-t-50 chart-wrap">
                      <div className='p-l-15 p-r-15 pin-wrap'>
                        <div id="container" style={{ width: width+'px'}}></div>
                      </div>
                      {/* right-part */}
                      <div className='lock-up'>
                        {/* <div className="tokenomic-title cf fwb lock-up">{t('Lockup')}</div> */}
                        {
                          list.map((item, index)=> {
                            return (
                                <div className="bar fz-med  flex cf flex-center m-b-10 " key={index}>
                                    <div className="color-tip m-l-0 m-r-10" style={{borderColor: colors[index]}}></div>
                                    <div className="name fwb">{item.name}</div>
                                    <div className="percent fwb">{item.y}%</div>
                                    <div className="num-text">{item.num}</div>
                                    <div className="desc oneline-only">
                                        <div className='flex flex-center '>
                                            <Tooltip title={item.desc} color={colors[index]}>
                                            <img src={require('../../assets/images/tips/tipf.svg').default} alt="" className='m-t-3' />
                                            </Tooltip>
                                          <span className='oneline-only m-l-5'>
                                           {item.desc}
                                          </span>
                                          
                                        </div>
                                    </div>
                                </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
  )
}