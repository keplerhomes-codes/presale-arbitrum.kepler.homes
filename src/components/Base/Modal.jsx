// custom modal

import React, { useState, useEffect, useRef } from 'react';
import './Modal.scss'
import { Modal, Button} from 'antd';
// import { CloseOutlined } from '@ant-design/icons';
import close from '../../assets/images/base/close.svg'
import classNames from 'classnames';

export default function MyModal(props) {
  return (
    <Modal visible={props.isVisible} width={props.width||420} closable={false} footer={false} className={classNames(["my-modal", props.className])}>
      <div className="modal-header">
        <div className="modal-title">
          <h2 className="fw500">{props.title||'Title'}</h2>
          {
            props.hideclose ? '':<div className="modal-close" onClick={props.onClose}><img src={close} /></div>
          }
          
        </div>
      </div>
      <div className={"modal-content p-"+(props.margin??30)}>
          {props.children} 
      </div>
      {
        props.showButton ? (
          <div className='flex w100 flex-center flex-middle p-b-20'>
            <Button onClick={props.onConfirm} className='my-button color cf p-l-15 p-r-15' size='large'>Confirm</Button>
            <Button onClick={props.onClose} size='large' style={{border: '1px solid #d9d9d9'}} className='m-l-40'>Cancel</Button>
          </div>
        ):''
      }
      
    </Modal>
  )
}
