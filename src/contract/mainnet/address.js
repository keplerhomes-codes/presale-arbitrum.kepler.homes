import BSC_ADDRESS  from './bscAddress'
import GOERLI_ADDRESS  from './GoerliAddress'
import MUMBAI_ADDRESS  from './MumbaiAddress'
import FUJI_ADDRESS  from './FujiAddress'
import ARB_ADDRESS  from './arbAddress'

export function getAddress (chain) {
  return ARB_ADDRESS
}

export function getCurAddress () {
  const chain = localStorage.getItem('kepler_chain') || 'Arbitrum'
  return getAddress(chain)
}
