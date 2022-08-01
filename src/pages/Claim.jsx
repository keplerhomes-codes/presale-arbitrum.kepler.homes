import './Claim.scss'
import { Button, Tabs} from 'antd'
import { useTranslation} from 'react-i18next'
import { Table, Tag, Space } from 'antd';
import { numFormat } from '../lib/util';
import Pagination from "../components/Base/Pagination"
import { useState } from 'react';
let {TabPane} = Tabs

const Verfiy = ({onChange}) => {
     return (
      <div className='claim flex flex-column p-t-120'>
      <div className="cf fz-32 ta fwb">Claim</div>
      <div className="cf fz-18 ta m-t-30  m-b-30">
      You will be asked to 
      <span className="ce"> asked to sign a message in your wallet</span> to verify you as the owner of the address. <br/>
This will not cost you any gas fees.
      </div>
      <Button className='my-button color cf verify-btn fz-18' onClick={onChange}>
        Verfiy your Wallet
      </Button>
      
      <img src={require('../assets/images/claim/bg.png')} alt="" className='bg'/>

   </div>
     )
}

const Tablelist = () => {
  let limit = 10
  let [page, setPage] = useState(1)
  let [total, setTotal] = useState(0)
  
  let pageChange = (p) => {
    setPage(p)
  }
  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Release Date',
      dataIndex: 'releasedate',
      key: 'releasedate',
    },
    {
      title: 'Token Amount (KEPL)',
      dataIndex: 'amount',
      key: 'amount',
      render: num => (
        <span className='flex flex-center'>
        <span className='ce'>
          {
            numFormat(num)
          }
        </span>
        <img src={require('../assets/images/token/KEPL.png')} alt="KEPL" className='m-l-8' width={16}/>
        </span>
      ),
    },
    {
      title: 'Claim',
      key: 'claim',
      dataIndex: 'claim',
      align:'right',
      render: tags => (
        <>
         <Button className='color cf'>Claim</Button>
        </>
      ),
    }
  ];
  const data = [
    {
      key: '1',
      index: '01',
      category: 'Referral Reward',
      releasedate: '2022-04-28 14:23:31',
      amount: 10000
    },
    {
      key: '2',
      index: '02',
      category: 'Referral Reward',
      releasedate: '2022-04-28 14:23:31',
      amount: 10000
    },{
      key: '3',
      index: '03',
      category: 'Referral Reward',
      releasedate: '2022-04-28 14:23:31',
      amount: 10000
    }
  ];
  return (
    <div className="w100">
       <Table columns={columns} dataSource={data} pagination={false} className="my-table"/>
       <div className="flex flex-between p-t-20">
         <div className="offset">&nbsp;</div>
         <div className="next">Next</div>
         <Pagination currentpage={page} limit={limit} total={total} pageChange={pageChange}/>
       </div>
       
    </div>
  )
}

const List = () => {
  let {t} = useTranslation()
  return(
    <div className='claim flex flex-column p-t-120'>
      <div className="cf fz-32 ta fwb">Claim</div>
      <Tabs   className='my-tab m-t-20'>
                <TabPane tab={t('Uncalimed Asset')} key="UncalimedAsset">
                       <Tablelist/>
                </TabPane>
                <TabPane tab={t('Claim History')} key="ClaimHistory">
                      <Tablelist/>
                </TabPane>
        </Tabs>

   </div>
  )

}

export default function () {
  let [isVerified, setVerify] = useState(false)
  let changeVerfy = ()=> {
    setVerify(true)
  }
  return (
    isVerified ? 
      <List/>:
      <Verfiy onChange={changeVerfy}/>
  )

}