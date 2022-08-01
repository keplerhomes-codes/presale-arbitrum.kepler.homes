import React, { useState, useEffect, useRef } from 'react';
import './Empty.scss'
import iconEmpty from '../../assets/images/farm/icon-empty.png'
import { useTranslation } from 'react-i18next'

export default function Empty(props) {
  const {t, i18n} = useTranslation()

  return (
    <div className="empty-placeholder">
      <img src={iconEmpty} alt="" className="icon-empty" />
      <div className="text-empty">{t('No data')}</div>
    </div>
  )
}
