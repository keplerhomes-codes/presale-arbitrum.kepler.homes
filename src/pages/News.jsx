import './News.scss'
import tokenLogo from '../assets/images/farm/token0.png'
import { Input, Button, Spin } from 'antd'
import Bus from '../lib/eventBus'
import { useTranslation} from 'react-i18next'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { CloseOutlined } from '@ant-design/icons';
import { emailReg } from '../lib/util'
import notification from '../components/notification'
import { t } from 'i18next'
import { baseUrl, get, post } from '../http'
import Pagination from '../components/Base/Pagination'

export default function () {
  let { t ,i18n} = useTranslation()
  let limit = 10
  let [hide, setHide] = useState(false)
  let [email, setEmail] = useState('')
  let [isRegister, setRegister] = useState(false)
  let [total, setTotal] = useState(0)
  let [currentpage, setCurrentpage] = useState(1)
  let [newsList, setNewsList] = useState([])
  let [loading ,setLoading] = useState(false)
  let toRegister = () => {
    if(!emailReg.test(email)) {
      notification.error({
        message: t('Please check the email address')
      })
      return
    }
    post('/api/community/subscribe', {
      email
    }).then(res => {
      notification.success({
        message: t('Subscription succeeded')
      })
      setRegister(true)
      setTimeout(()=> {
        setHide(true)
      }, 1500)
    })
  }
  let pageChange = (page) => {
    setCurrentpage(page)
    loadNews(page)
  }
  let loadNews = (page) => {
    setLoading(true)
    get('/api/news', {
      limit,
      skip: page-1
    }).then(res => {
      setLoading(false)
      setNewsList(res.data.news)
      setTotal(res.data.count)
    })
  }
  // useEffect(()=> {
  //   loadNews(0)
  // }, [])
  

  return (
    <div className='news-wrap flex flex-column'>
      <div className="news flex-1">
        <div className="fwb news-page-title">{t('News')}</div>
        {/* <div className="news-banner">
          <div className="banner-main">
            <div className="banner-item">
              <div className="banner-caption">
                <div className="fw500 banner-title">Kepler cooperates with the project</div>
                <div className="banner-info"><img src={tokenLogo} alt="" className="team-logo" /><span>Kepler team · Feb 02-01-2022</span></div>
              </div>
            </div>
          </div>
          <div className="banner-side">
            <div className="banner-item">
              <div className="banner-caption">
                <div className="fw500 banner-title">Kepler cooperates with the project</div>
              </div>
            </div>
            <div className="banner-item">
              <div className="banner-caption">
                <div className="fw500 banner-title">Kepler cooperates with the project</div>
              </div>
            </div>
          </div>
        </div> */}
        {
          loading ? (
            <div className="w100 p-40 flex flex-center flex-middle">
            <Spin></Spin>
            </div>
          )
          :(
            
        <div className="news-content">
        {
          newsList.map((item, index) => {
            return (
              <a className="news-item" target="_blank" href={item.linkUrl}>
                <div className="news-item-right show-p">
                  <div className="news-thumbnail">
                    <img src={baseUrl + item.banner} alt="" />
                  </div>
                </div>
                <div className="news-item-left flex-1">
                  <div className="fw500 news-title">{item.title}</div>
                  <div className="news-brief" dangerouslySetInnerHTML={{__html: item.content}}></div>
                  <div className="news-info">
                    {/* <img src={tokenLogo} alt="" className="team-logo" /> */}
                      <span>
                      {item.author} 
                       &nbsp;
                      {
                        item.updatedAt
                      }
                      </span></div>
                </div>
                <div className=" show-m">
                  <div className="news-thumbnail-m">
                    <img src={baseUrl + item.banner} alt="" />
                  </div>
                </div>
              </a>
            )
          })
        }
      </div>
          )
        }
        <div className="flex flex-last">
        <Pagination total={10} limit={limit} currentpage={currentpage} pageChange={pageChange}/>
        </div>
      </div>
      <div className={classNames(["subscribe-panel", {"hide": hide}])}>
        <div className="fw500 subscribe-title">{t('Get more content and subscribe now！')}</div>
        <div className="subscribe-input flex flex-center w100">
          {
            isRegister ? (
              <Button type="primary" className="fwb btn-register-success" >{t('REGISTERED')}</Button>
            ):(
              <div compact className='flex w100 input-wrap'>
                  <Input defaultValue="" placeholder='Enter your email' onChange={(e)=> setEmail(e.target.value)}/>
                  <Button type="primary" className="fwb btn-register" onClick={toRegister}>{t('REGISTER')}</Button>
              </div>
            )
          }
          
          
          <div className="m-l-40 pointer show-p" onClick={_=> setHide(true)}><CloseOutlined /></div>
          
        </div>
        <div className="m-l-40 pointer show-m close-m" onClick={_=> setHide(true)}><CloseOutlined /></div>

      </div>
    </div>
  )
}