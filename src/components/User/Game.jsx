import { useState, useRef, useMemo, useEffect } from "react"
import { Button, Input, Checkbox } from "antd"
import { emailReg } from '../../lib/util';

import { connect, useSelector } from 'react-redux'
import { post } from '../../http'
import notification from '../notification'
import Modal from '../../components/Base/Modal'
import { t } from "i18next"
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import store, { setUserInfo } from "../../store";
import Tip from './game/Tip'
import Warn from './game/Warn'
import Bind from './game/Bind'
import Unbind from './game/Unbind'


const Game = (props) => {

    console.log(props)
    let [status, setStatus] = useState(props.userInfo.email?.trim() ? 1 : 0) // 0 unbind 1 binded 2//changeemail 3unbind
    let statusText = ['Bind Email', 'Change Password', 'Change Email', 'Unbind Email']
    return (
        <>
           <div className="c06 game-title  flex flex-center flex-between">
               <span className="info-title flex">
                 <span className="show-p m-r-4">
                    Game Account |  
                 </span>
                <span className="cf "> {statusText[status]}</span>
               </span>
               {
                   [2,3].includes(status) && <span className="pointer back" onClick={()=>{setStatus(1)}}>
                   <img src={require('../../assets/images/user/back.svg').default} alt="" />
               </span>
               }
               
            </div>
            {
                (status == 0 || status == 2) && <Bind status={status} changeFn={setStatus}/>
            }
            {
                (status == 1 || status == 3) && <Unbind {...props} changeFn={setStatus} status={status} />
            }
        </>
    )
}


export default connect(
    (state, props) => {
        return { ...state, ...props }
    }
)(
    Game
);
