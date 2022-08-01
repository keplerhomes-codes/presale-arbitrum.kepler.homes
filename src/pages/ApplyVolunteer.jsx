import './ApplyVolunteer.scss'
import { useEffect, useState, useMemo} from 'react'
import classNames from 'classnames';
import { Input, Button, Select, Checkbox, Row, Col, Form} from 'antd';
import {connect, useSelector} from 'react-redux'
import {get, post} from '../http'
import notification from '../components/notification'
import { useTranslation} from 'react-i18next'
import {showLogin} from '../lib/util'
import {NavLink, useNavigate } from 'react-router-dom'
import Countries from '../lib/country';
import Timezone from '../lib/timezone';
import { emailReg } from '../lib/util';
import { useRef } from 'react';
import {usePrompt} from '../hooks/usePrompt'
let counts = 0
let allseconds = 60

const { TextArea } = Input;
const { Option } = Select;
const Triggle = (<div className='flex flex-center select-icon'>
  <img src={require('../assets/images/base/tangleb.svg').default} alt="" />
</div>)
function ApplyVolunteer (props) {
  let { t ,i18n} = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [isSend, setSend] = useState(false)
  const [isSending, setSending] = useState(false)
  const [second, setSecond] = useState(0)
  const [country, setCountry] = useState('')
  const [describes, setDescribes] = useState('')
  const [nameError, setNameError] = useState(false)
  const [countryError, setCountryError] = useState(false)
  const [describesError, setDescribesError] = useState(false)
  const [otherSkill, setOtherSkill] = useState('')
  const [otherLang, setOtherLang] = useState('')
  const [isFilled, setIsFilled] = useState(false)
  const [form] = Form.useForm();
  const nav = useNavigate()
  let timer = useRef()
  let sendCode = () => {
    if(!emailReg.test(email)) {
          notification.error({
            message: t('Incorrect Email')
        })
        return
    } else {
        setSending(true)
        post('/api/sendCode', {
            email,
            emailType: 4
        }).then(res => {
            setSend(true)
            setSending(false)
            timer.current = setInterval(() => {
                if(counts < allseconds) {
                    counts++
                    setSecond(counts)
                } else {
                    setSecond(0)
                    counts = 0
                    setSend(false)
                    clearInterval(timer.current)
                }
            }, 1000)
            notification.success({
                message: t('Send code Success'),
                description: t('Please check your email')
            });
        }).catch(err => {
            setSending(false)
            setSend(false)
            let tips = 'Something goes wrong'
            switch (err.code) {
                case 3002:
                    tips = 'Account already exists';
                    break;
                case 3001:
                    tips = 'Account not exists';
                    break;
                case 2002:
                    tips = 'Send too fast';
                    break;
                default:
                    break;
            }
            notification.error({
                message: t(tips)
            })
        })
    }
}
  useEffect(()=>{
    get('/api/v1/community/volunteer',{}).then(res => {
      if(res.data.email) {
        // setIsFilled(true)
      } else {
        setIsFilled(false)
      }
    })
  }, [])
  usePrompt("The content has not been saved. Are you sure to leave?", !isFilled);
  const onFinish = (values) => {
    setIsLoading(true)
    post('/api/v1/community/volunteer', {
      Authorization: props.token,
      ...values,
      languages: values.languages.join(',').replace('Other', otherLang),
      skill: values.skill.join(',').replace('Other', otherSkill)
    }).then(res => {
      setIsLoading(false)
      notification.success({
          duration: 10000,
          message: t('Successful submission! We aim to respond to successful applications within 3 workdays. Due to a large number of requests, we’re unable to respond to every single applicant. If you don’t hear back from us within two weeks of applying, try reaching out to t.me/anton_1996x on Telegram, with the name, the email address, and the date you applied.'),
      });
      nav('/')
    }).catch(err => {
      setIsLoading(false)
      notification.error({
        message: t('Fail'),
      });
    })
  };

  return (
    <div className="apply-volunteer">
      <div className="apply-volunteer-header">
        <div className="apply-volunteer-crumbs">{t('Community')} / <span className="cur">{t('Apply For Volunteer')}</span></div>
        <NavLink to="/" className="m-l-auto"><Button className="btn-return" onClick={_ => {}}>{t('Return')}</Button></NavLink>
      </div>
      {
        isFilled ? (
          <div className='apply-volunteer-card'>
            <span className='fwb'>You had an application submitted successfully. <br/></span> 
            Thanks for your interest in us! <br/>
            We aim to respond to successful applications within 3 workdays. Due to a large number of requests, we’re unable to respond to every single applicant. <br/>
            If you don’t hear back from us within two weeks of applying, try reaching out to 
            <a href="https://t.me/KeplerHomes" style={{"color": '#E07D26'}}> https://t.me/KeplerHomes</a> on Telegram, with the name, the email address, and the date you applied.
          </div>
        ):
        <div>
      <Form className={classNames(["apply-volunteer-card"]) } 
      form={form}
      name="volunteer"
      layout="vertical"
      onFinish={onFinish}
      >
        <div className="fwb card-title">{t('Apply For Volunteer')}</div>
        <div className="card-desc">
        {t('We will respond to applications within 3 workdays.')}
        </div>

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('My Email')}</div>
        </div>
        <Form.Item name="email" rules={[{
            type: 'email',
            message: t('The input is not valid E-mail!'),
          },
          {
            required: true,
            message: t('Please input your E-mail!'),
          }]}>
            <div className="flex flex-center">
            <Input placeholder="" className='my-input fz-16 m-t-10 flex-1' onChange={(e) =>{setEmail(e.target.value)}}/>
              {
                  isSend ? (
                    <div className="send-btn c56 p-l-20 m-t-5">{allseconds-second}s </div>
                  ):(
                    <div className="send-btn ce pointer p-l-20 m-t-5" onClick={sendCode} > {t(`Send${isSending?'ing':''}`)} </div>
                  )
              }
            </div>
        </Form.Item>
        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('Verification Code')}</div>
        </div>
        <Form.Item name="code" rules={[{ required: true }]}>
           <Input placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>
        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('My Telegram')}</div>
        </div>
        <Form.Item name="telegram" rules={[{ required: true }]}>
           <Input placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>
        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('I am currently living in')}</div>
        </div>
        <Form.Item name="I am currently living in" rules={[{ required: true }]}>
          <Select className='my-select w100  m-t-10' dropdownClassName="my-select-dropdown"  placeholder={t("Please select")} showSearch suffixIcon={Triggle}>
            {
              Countries.map(item => {
                  return <Option value={item.country} key={item.country}>{item.country}</Option>
              })
            }
          </Select>
        </Form.Item>
        

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('My time zone')}</div>
        </div>
        <Form.Item name="timeZone" rules={[{ required: true }]}>
          <Select className='my-select w100  m-t-10' dropdownClassName="my-select-dropdown" placeholder={t("Please select")} showSearch suffixIcon={Triggle}>
            {
              Timezone.map(item => {
                return  <Option value={item} key={item}>{item}</Option>
              })
            }
          </Select>
        </Form.Item>
        
        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('I am fluent in')}</div>
        </div>
        <Form.Item name="languages" rules={[{ required: true }]}>
          <Checkbox.Group style={{ width: '100%' }} className="my-checkbox-rect m-t-10">
            <Row>
              <Col span={window.innerWidth >=768 ? 5:8}>
                <Checkbox value="English">{t('English')}</Checkbox>
              </Col>
              <Col span={window.innerWidth >=768 ? 5:8}>
                <Checkbox value="Chinese">{t('Chinese')}</Checkbox>
              </Col>
              <Col span={window.innerWidth >=768 ? 5:8}>
                <Checkbox value="German">{t('German')}</Checkbox>
              </Col>
              <Col span={window.innerWidth >=768 ? 5:8}>
                <Checkbox value="French">{t('French')}</Checkbox>
              </Col>
              <Col span={window.innerWidth >=768 ? 4:8}>
                <Checkbox value="Janpanese">{t('Janpanese')}</Checkbox>
              </Col>
              <Col span={window.innerWidth >=768 ? 5:8}>
                <Checkbox value="Korean">{t('Korean')}</Checkbox>
              </Col>
              <Col span={window.innerWidth >=768 ? 5:8}>
                <Checkbox value="Spanish">{t('Spanish')}</Checkbox>
              </Col>
              <Col span={window.innerWidth >=768 ? 5:8}>
                <Checkbox value="Indonesian">{t('Indonesian')}</Checkbox>
              </Col>
              <Col span={9}>
                <Checkbox value='Other' className='other-checkbox'>
                  <div className="other-wrapper">
                    <div className="other-label">{t('Other')}</div>
                    <Input onChange={(e) => setOtherLang(e.target.value)}></Input>
                  </div>
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('Specialties')}</div>
        </div>
        <Form.Item name="skill" rules={[{ required: true }]}>
        <Checkbox.Group style={{ width: '100%' }} className="my-checkbox-rect m-t-10">
          <Row>
            <Col span={9}>
              <Checkbox value="Picture Content Creation">{t('Picture Content Creation')}</Checkbox>
            </Col>
            <Col span={9}>
              <Checkbox value="Community Management">{t('Community Management')}</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox value="Video Production">{t('Video Production')}</Checkbox>
            </Col>
            <Col span={9}>
              <Checkbox value="Copywriting Proofreading">{t('Copywriting Proofreading')}</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox value="Event Hosting">{t('Event Hosting')}</Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value='Other' className='other-checkbox'>
                <div className="other-wrapper">
                  <div className="other-label">{t('Other')}</div>
                  <Input onChange={(e) => setOtherSkill(e.target.value)}></Input>
                </div>
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
        </Form.Item>

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('Please describe why you want to be a Kepler Community volunteer and what you can do for Kepler.')}</div>
        </div>
        <Form.Item name="describes" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>

        
        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('How much do you know about GAMEFI, how much you know about blockchain and NFTs?')}</div>
        </div>
        <Form.Item name="describes2" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>
        <Button loading={isLoading} htmlType="submit"  className="m-t-30 fwb btn-submit">{t('Submit')}</Button>
      </Form>
      </div>
      }
      
    </div>
  )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  ApplyVolunteer
);