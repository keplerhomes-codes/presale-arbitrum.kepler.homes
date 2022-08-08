import {
  getBSCNetwork,
  getETHNetwork,
  getPolygonNetwork,
  getAvalancheNetwork
} from './main'

export const chainIdMap = {
  '0x61': getBSCNetwork, // 0x38 main 0x61 test
  '0x5': getETHNetwork,  // 0x1 main 0x5 goerli
  '0x13881': getPolygonNetwork, // 0x89 main 0x13881 mumbai
  '0xa869': getAvalancheNetwork
}

export const chainSymbolMap = {
  'BSC': getBSCNetwork,
  'ETH': getETHNetwork,
  'Polygon': getPolygonNetwork,
  'Avalanche': getAvalancheNetwork
}

export default {
  getBSCNetwork,
  getETHNetwork,
  getPolygonNetwork,
  getAvalancheNetwork
}