import { connectors } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import binance from '../../assets/images/wallets/binance-chain.png'
import math from '../../assets/images/wallets/math.png'
import coin98 from '../../assets/images/wallets/coin98.png'
import onto from '../../assets/images/wallets/onto.png'
import { providerOptions } from './providerOptions';


export const getBSCNetwork = () => {
  return {
    name: 'BSC',
    params: {
      chainId: '0x61',
      chainName: 'BSC TestNet',
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://data-seed-prebsc-1-s2.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
    networkId: 97,
    httpProviderURL: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
    connectors: {
      network: 'binance',
      cacheProvider: true,
      providerOptions: providerOptions({
        walletconnectOptions: {
          rpc: {
            1: 'https://bsc-dataseed.binance.org/',
            56: 'https://bsc-dataseed.binance.org/',
            97: 'https://data-seed-prebsc-1-s2.binance.org:8545/'
          }
        }
      })
    }
  }
}

export const getETHNetwork = () => {
  return {
    name: 'ETH',
    params: {
      blockExplorerUrls: ['https://goerli.etherscan.io/'],
    },
    networkId: 5,
    httpProviderURL: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    connectors: {
      network: 'mainnet',
      cacheProvider: true,
      providerOptions: providerOptions({
        walletconnectOptions: {
          rpc: {
            5: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
          }
        }
      })
    }
  }
}

export const getPolygonNetwork = () => {
  return {
    name: 'Polygon',
    params: {
      chainId: '0x89',
      chainName: 'Polygon',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://polygon-rpc.com'],
      blockExplorerUrls: ['https://polygonscan.com'],
    },
    networkId: 137,
    httpProviderURL: 'https://polygon-rpc.com',
    connectors: {
      network: 'Polygon',
      cacheProvider: true,
      providerOptions: providerOptions({
        walletconnectOptions: {
          rpc: {
            1: 'https://polygon-rpc.com',
            137: 'https://polygon-rpc.com',
          }
        }
      })
    }
  }
}
export const getAvalancheNetwork = () => {
  return {
    name: 'Avalanche',
    params: {
      chainId: '0xa869',
      chainName: 'Avalanche-testnet',
      nativeCurrency: {
        name: 'AVAX',
        symbol: 'AVAX',
        decimals: 18,
      },
      rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
      blockExplorerUrls: ['https://testnet.snowtrace.io'],
    },
    networkId: 43113,
    httpProviderURL: 'https://api.avax-test.network/ext/bc/C/rpc',
    connectors: {
      network: 'Avalanche',
      cacheProvider: true,
      providerOptions: providerOptions({
        walletconnectOptions: {
          rpc: {
            1: 'https://api.avax-test.network/ext/bc/C/rpc',
            43113: 'https://api.avax-test.network/ext/bc/C/rpc',
          }
        }
      })
    }
  }
}

export default {
  getBSCNetwork,
  getETHNetwork,
  getPolygonNetwork,
  getAvalancheNetwork
}