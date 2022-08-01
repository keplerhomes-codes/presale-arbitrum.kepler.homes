import React from "react";
import { notification } from 'antd';
import notificationSuccess from '../assets/images/notification/success.svg'
import { t } from "i18next";

export default {
  success: ({message, description, duration=3}) => {
    notification.success({
      message: t(message),
      description,  
      icon: <img src={notificationSuccess} alt="" />,
      duration
    });
  },
  error: ({message, description, duration=3}) => {
    notification.error({
      message: t(message),
      description,
      icon: <img src={require('../assets/images/notification/error.svg').default} alt="" />,
      duration
    });
  },
  destroy: () => {
    notification.destroy()
  }
};
