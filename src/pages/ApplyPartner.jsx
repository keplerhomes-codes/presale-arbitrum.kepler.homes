import './ApplyVolunteer.scss'
import { useEffect, useState, useMemo} from 'react'
import classNames from 'classnames';
import { Input, Button, Select, Checkbox, Row, Col, Form} from 'antd';
import {connect, useSelector} from 'react-redux'
import {post} from '../http'
import notification from '../components/notification'
import { useTranslation} from 'react-i18next'
import {showLogin} from '../lib/util'
import {NavLink, Link, useNavigate} from 'react-router-dom'
import Countries from '../lib/country';
import {usePrompt} from '../hooks/usePrompt'

const { TextArea } = Input;

function ApplyVolunteer (props) {
  let { t ,i18n} = useTranslation()

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [describes, setDescribes] = useState('')
  const [nameError, setNameError] = useState(false)
  const [countryError, setCountryError] = useState(false)
  const [describesError, setDescribesError] = useState(false)
  
  const [form] = Form.useForm();
  const nav = useNavigate()
  usePrompt("The content has not been saved. Are you sure to leave?", true);

  const onFinish = (values) => {
    setIsLoading(true)
    post('/api/community/partner', {
      Authorization: props.token,
      ...values,
      cooperation: values.cooperation.join(','),
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
        <div className="apply-volunteer-crumbs">{t('Community')} / <span className="cur">{t('Apply For Partner')}</span></div>
        <NavLink to="/" className="m-l-auto"><Button className="btn-return" onClick={_ => {}}>{t('Return')}</Button></NavLink>
      </div>
      <Form className={classNames(["apply-volunteer-card"]) } 
      form={form}
      name="partner"
      layout="vertical"
      onFinish={onFinish}
      >
        <div className="fwb card-title">{t('Apply For Partner')}</div>
        <div className="card-desc">
        {t('We will respond to applications within 3 workdays.')}
        </div>

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('Organization(individual) Name')}</div>
        </div>
        <Form.Item name="organization" rules={[{ required: true }]}>
           <Input placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('Project Official Website')}</div>
        </div>
        
        <Form.Item name="website" rules={[{ required: true }]}>
          <Input placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('Email')}</div>
        </div>
        
        <Form.Item name="email" rules={[{
            type: 'email',
            message: t('The input is not valid E-mail!'),
          },
          {
            required: true,
            message: t('Please input your E-mail!'),
          }]}>
          <Input placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('My Telegram')}</div>
        </div>
        
        <Form.Item name="telegram" rules={[{ required: true }]}>
          <Input placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>

        
        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('Choice of Cooperation')}</div>
        </div>
        
        <Form.Item name="cooperation" rules={[{ required: true }]}>
          
        <Checkbox.Group style={{ width: '100%' }} className="my-checkbox-rect m-t-10">
          <Row>
            <Col span={9}>
              <Checkbox value="Marketing">{t('Marketing')}</Checkbox>
            </Col>
            <Col span={9}>
              <Checkbox value="Communities">{t('Communities')}</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox value="Investment">{t('Investment')}</Checkbox>
            </Col>
            <Col span={9}>
              <Checkbox value="Strategic Cooperation">{t('Strategic Cooperation')}</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox value="Farming">{t('Farming')}</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
        </Form.Item>

        <div className="fz-14 m-t-20 flex">
          <div className="label">{t('Please briefly describe your cooperation ideas.')}</div>
        </div>
        
        <Form.Item name="describes" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="" className='my-input fz-16 m-t-10' />
        </Form.Item>
        
        <Button loading={isLoading} htmlType="submit"  className="m-t-30 fwb btn-submit">{t('Submit')}</Button>
      </Form>
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