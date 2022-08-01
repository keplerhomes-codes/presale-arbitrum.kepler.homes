import React, { useState, useEffect, useRef, useCallback } from 'react';
import {connect} from 'react-redux'
import RewardsEVM from './evm/Rewards'
import RewardsSolana from './solana/Rewards'

function Rewards (props) {

  useEffect(() => {
    console.log(props.chain)
  }, [])

  if (props.chain === 'Solana') {
    return <RewardsSolana />
  } else {
    return <RewardsEVM />
  }
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Rewards
);
