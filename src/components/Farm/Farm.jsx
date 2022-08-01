import React, { useState, useEffect, useRef, useCallback } from 'react';
import {connect} from 'react-redux'
import FarmEVM from './evm/Farm'
import FarmSolana from './solana/Farm'

function Farm (props) {

  useEffect(() => {
    console.log(props.chain)
  }, [])

  if (props.chain === 'Solana') {
    return <FarmSolana />
  } else {
    return <FarmEVM />
  }
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Farm
);
