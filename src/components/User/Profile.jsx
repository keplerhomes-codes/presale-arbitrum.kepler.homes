
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default () => {
    let [visible, setVisible] = useState(true)

    return (
        <div className="profile">
            <div className="cf info-title show-p">My Profile</div>
            <div className="cf content-font money-box flex flex-center">
                My KEPL Balance
                    <span className='eye m-l-5' onClick={()=>setVisible(!visible)}>
                      {visible ?<EyeOutlined/> : <EyeInvisibleOutlined/>}
                    </span>
            </div>
            <div className="">
                <span className="cf money fw500">{
                    visible ?'356780.00':'********'
                }
                </span>
                <span className="cf content-font m-l-5">KEPL</span>
                {
                    visible ?
                    <span className="c06 content-font  m-l-8">≈$123456.9085</span>:''
                }
                
            </div>
            
        </div>
    )
}