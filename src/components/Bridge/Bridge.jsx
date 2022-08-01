import React, { useState, useEffect, useRef, useCallback } from 'react';
import {connect} from 'react-redux'
import BridgeEVM from './evm/Bridge'
import BridgeSolana from './solana/Bridge'

function Bridge (props) {

  useEffect(() => {
    console.log(props.chain)
  }, [])

  if (props.chain === 'Solana') {
    return <BridgeSolana />
  } else {
    return <BridgeEVM />
  }
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Bridge
);
