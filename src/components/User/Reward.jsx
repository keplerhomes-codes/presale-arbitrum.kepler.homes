import { Table, Tag, Space } from 'antd';
import { Button } from "antd"
import { numFormat } from '../../lib/util';
import './index.scss'
export default () => {

    const columns = [
        {
            title: 'REC Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'REC Address',
            dataIndex: 'address',
            key: 'address',
            render: address => (
                <span className='flex flex-center'>
                    <span className='cf'>
                        {
                            address
                        }
                    </span>
                    <img src={require('../../assets/images/user/copy.svg').default} alt="KEPL" className='m-l-8' width={10} height={10} />
                    <img src={require('../../assets/images/mint/share.svg').default} alt="KEPL" className='m-l-8' width={10} height={10} />
                </span>
            ),
        },
        {
            title: 'Reward amount',
            dataIndex: 'reward',
            align: 'right',
            key: 'reward',

        },
        {
            title: 'PreKEPL quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'right',
            render: num => (
                <span className='flex flex-last flex-center'>
                    <span className='ce flex-1'>
                        {
                            numFormat(num)
                        }
                    </span>
                    <img src={require('../../assets/images/token/KEPL.png')} alt="KEPL" className='m-l-8' width={16} height={16} />
                </span>
            ),
        }
    ];
    const data = [
        {
            key: '1',
            amount: '0.005 ETH',
            address: '0xc71e1…0e319',
            reward: '$ 556.2445',
            quantity: 10000
        },
        {
            key: '2',
            amount: '0.005 ETH',
            address: '0xc71e1…0e319',
            reward: '$ 556.2445',
            quantity: 10000
        }, {
            key: '3',
            amount: '0.005 ETH',
            address: '0xc71e1…0e319',
            reward: '$ 556.2445',
            quantity: 10000
        }
    ];
    return (
        <div>
            <div className="cf fz-30 p-t-60 ">My Rewards</div>
            <div className="w100 flex flex-column flex-center m-t-40">
                <div className="w100 flex flex-between flex-center">
                    <div className="flex flex-column cf">
                        <span className='fz-18'>
                            Total Reward
                        </span>
                        <div>
                            <span className='fz-32 fwb'>
                                31234.00
                            </span>
                            <span className='fz-18 m-l-8'>
                                KEPL
                            </span>
                            <span className="fz-18 c06  m-l-8">
                                ≈$31223.2311
                            </span>
                        </div>
                    </div>
                    <Button className="my-button btn confirm-btn  color cf fz-16">Claim</Button>
                </div>
                <div className="w100 table-box p-t-16 m-t-44">
                    <Table columns={columns} dataSource={data} pagination={false} className="my-table" />
                </div>

            </div>
        </div>
    )
}