import BSC_ADDRESS  from '../testnet/bscAddress'
import GOERLI_ADDRESS  from '../testnet/GoerliAddress'
import MUMBAI_ADDRESS  from '../testnet/MumbaiAddress'
import FUJI_ADDRESS  from '../testnet/FujiAddress'

export function getAddress (chain) {
  let ADDRESS
  if (chain === 'BSC') {
    ADDRESS = BSC_ADDRESS
  } else if (chain === 'ETH') {
    ADDRESS = GOERLI_ADDRESS
  } else if (chain === 'Polygon') {
    ADDRESS = MUMBAI_ADDRESS
  } else if (chain === 'Avalanche') {
    ADDRESS = FUJI_ADDRESS
  }
  return ADDRESS
}

export function getCurAddress () {
  const chain = localStorage.getItem('kepler_chain') || 'Avalanche'
  return getAddress(chain)
}
