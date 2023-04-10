import { connectors } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import binance from '../../assets/images/wallets/binance-chain.png'
import math from '../../assets/images/wallets/math.png'
import coin98 from '../../assets/images/wallets/coin98.png'
import onto from '../../assets/images/wallets/onto.png'
import { providerOptions } from './providerOptions';

export const getArbitrumNetwork = () => {
  return {
    name: 'ARB',
    params: {
      chainId: '42161',
      chainName: 'Arbitrum One',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'GoerliETH',
        decimals: 18,
      },
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      blockExplorerUrls: ['https://arbiscan.io'],
    },
    networkId: 42161,
    httpProviderURL: 'https://arb1.arbitrum.io/rpc',
    connectors: {
      network: 'arbitrum',
      cacheProvider: true,
      providerOptions: providerOptions({
        walletconnectOptions: {
          rpc: {
            42161: 'https://arb1.arbitrum.io/rpc'
          }
        }
      })
    }
  }
}


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
      providerOptions: {
        injected: {
          display: {
            name: 'MetaMask',
            description: 'Home-BrowserWallet',
          },
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              1: 'https://bsc-dataseed.binance.org/',
              56: 'https://bsc-dataseed.binance.org/',
              97: 'https://data-seed-prebsc-1-s2.binance.org:8545/'
            },
          },
        },
        'custom-binance': {
          display: {
            name: 'Binance',
            description: 'Binance Chain Wallet',
            logo: binance,
          },
          package: 'binance',
          connector: async (ProviderPackage, options) => {
            const provider = (window).BinanceChain ;
            // const provider = window ;
            await provider.enable();
            return provider;
          },
        },
        'custom-onto': {
          display: {
            name: 'Onto',
            description: 'Onto-Wallet',
            logo: onto,
          },
          package: 'onto',
          connector: async (ProviderPackage, options) => {
            const provider = (window).onto ;
            console.log(provider)
            // const provider = window ;
            // await provider.enable();
            return provider;
          },
        },
        'custom-math': {
          display: {
            name: 'Math',
            description: 'Math-Wallet',
            logo: math,
          },
          package: 'math',
          connector: connectors.injected,
        },
        'custom-coin': {
          display: {
            name: 'coin98',
            description: 'coin98-Wallet',
            logo: coin98,
          },
          package: 'coin98',
          connector: connectors.injected,
        }
      },
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
      providerOptions: {
        injected: {
          display: {
            name: 'MetaMask',
            description: 'Home-BrowserWallet',
          },
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              5: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
            },
          },
        },
        'custom-binance': {
          display: {
            name: 'Binance',
            description: 'Binance Chain Wallet',
            logo: binance,
          },
          package: 'binance',
          connector: async (ProviderPackage, options) => {
            const provider = (window).BinanceChain ;
            // const provider = window ;
            await provider.enable();
            return provider;
          },
        },
        'custom-onto': {
          display: {
            name: 'Onto',
            description: 'Onto-Wallet',
            logo: onto,
          },
          package: 'onto',
          connector: async (ProviderPackage, options) => {
            const provider = (window).onto ;
            console.log(provider)
            // const provider = window ;
            // await provider.enable();
            return provider;
          },
        },
        'custom-math': {
          display: {
            name: 'Math',
            description: 'Math-Wallet',
            logo: math,
          },
          package: 'math',
          connector: connectors.injected,
        },
        'custom-coin': {
          display: {
            name: 'coin98',
            description: 'coin98-Wallet',
            logo: coin98,
          },
          package: 'coin98',
          connector: connectors.injected,
        }
      },
    }
  }
}

// export const getETHNetwork = () => {
//   return {
//     name: 'ETH',
//     networkId: 1,
//     httpProviderURL: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
//     connectors: {
//       network: 'mainnet',
//       cacheProvider: true,
//       providerOptions: {
//         injected: {
//           display: {
//             name: 'MetaMask',
//             description: 'Home-BrowserWallet',
//           },
//         },
//         walletconnect: {
//           package: WalletConnectProvider,
//           options: {
//             infuraId: "9aa3d95b3bc440fa88ea12eaa4456161"
//           },
//         },
//         'custom-binance': {
//           display: {
//             name: 'Binance',
//             description: 'Binance Chain Wallet',
//             logo: binance,
//           },
//           package: 'binance',
//           connector: async (ProviderPackage, options) => {
//             const provider = (window).BinanceChain ;
//             // const provider = window ;
//             await provider.enable();
//             return provider;
//           },
//         },
//         'custom-onto': {
//           display: {
//             name: 'Onto',
//             description: 'Onto-Wallet',
//             logo: onto,
//           },
//           package: 'onto',
//           connector: async (ProviderPackage, options) => {
//             const provider = (window).onto ;
//             console.log(provider)
//             // const provider = window ;
//             // await provider.enable();
//             return provider;
//           },
//         },
//         'custom-math': {
//           display: {
//             name: 'Math',
//             description: 'Math-Wallet',
//             logo: math,
//           },
//           package: 'math',
//           connector: connectors.injected,
//         },
//         'custom-coin': {
//           display: {
//             name: 'coin98',
//             description: 'coin98-Wallet',
//             logo: coin98,
//           },
//           package: 'coin98',
//           connector: connectors.injected,
//         }
//       },
//     }
//   }
// }

export const getPolygonNetwork = () => {
  return {
    name: 'Polygon',
    params: {
      chainId: '0x13881',
      chainName: 'Polygon',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    },
    networkId: 80001,
    httpProviderURL: 'https://rpc-mumbai.maticvigil.com',
    connectors: {
      network: 'Polygon',
      cacheProvider: true,
      providerOptions: {
        injected: {
          display: {
            name: 'MetaMask',
            description: 'Home-BrowserWallet',
          },
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              80001: 'https://rpc-mumbai.maticvigil.com',
            },
          },
        },
        'custom-binance': {
          display: {
            name: 'Binance',
            description: 'Binance Chain Wallet',
            logo: binance,
          },
          package: 'binance',
          connector: async (ProviderPackage, options) => {
            const provider = (window).BinanceChain ;
            // const provider = window ;
            await provider.enable();
            return provider;
          },
        },
        'custom-onto': {
          display: {
            name: 'Onto',
            description: 'Onto-Wallet',
            logo: onto,
          },
          package: 'onto',
          connector: async (ProviderPackage, options) => {
            const provider = (window).onto ;
            console.log(provider)
            // const provider = window ;
            // await provider.enable();
            return provider;
          },
        },
        'custom-math': {
          display: {
            name: 'Math',
            description: 'Math-Wallet',
            logo: math,
          },
          package: 'math',
          connector: connectors.injected,
        },
        'custom-coin': {
          display: {
            name: 'coin98',
            description: 'coin98-Wallet',
            logo: coin98,
          },
          package: 'coin98',
          connector: connectors.injected,
        }
      },
    }
  }
}

// export const getPolygonNetwork = () => {
//   return {
//     name: 'Polygon',
//     params: {
//       chainId: '0x89',
//       chainName: 'Polygon',
//       nativeCurrency: {
//         name: 'MATIC',
//         symbol: 'MATIC',
//         decimals: 18,
//       },
//       rpcUrls: ['https://polygon-rpc.com'],
//       blockExplorerUrls: ['https://polygonscan.com'],
//     },
//     networkId: 137,
//     httpProviderURL: 'https://polygon-rpc.com',
//     connectors: {
//       network: 'Polygon',
//       cacheProvider: true,
//       providerOptions: {
//         injected: {
//           display: {
//             name: 'MetaMask',
//             description: 'Home-BrowserWallet',
//           },
//         },
//         walletconnect: {
//           package: WalletConnectProvider,
//           options: {
//             rpc: {
//               1: 'https://polygon-rpc.com',
//               137: 'https://polygon-rpc.com',
//             },
//           },
//         },
//         'custom-binance': {
//           display: {
//             name: 'Binance',
//             description: 'Binance Chain Wallet',
//             logo: binance,
//           },
//           package: 'binance',
//           connector: async (ProviderPackage, options) => {
//             const provider = (window).BinanceChain ;
//             // const provider = window ;
//             await provider.enable();
//             return provider;
//           },
//         },
//         'custom-onto': {
//           display: {
//             name: 'Onto',
//             description: 'Onto-Wallet',
//             logo: onto,
//           },
//           package: 'onto',
//           connector: async (ProviderPackage, options) => {
//             const provider = (window).onto ;
//             console.log(provider)
//             // const provider = window ;
//             // await provider.enable();
//             return provider;
//           },
//         },
//         'custom-math': {
//           display: {
//             name: 'Math',
//             description: 'Math-Wallet',
//             logo: math,
//           },
//           package: 'math',
//           connector: connectors.injected,
//         },
//         'custom-coin': {
//           display: {
//             name: 'coin98',
//             description: 'coin98-Wallet',
//             logo: coin98,
//           },
//           package: 'coin98',
//           connector: connectors.injected,
//         }
//       },
//     }
//   }
// }

export const getAvalancheNetwork = () => {
  return {
    name: 'Avalanche',
    params: {
      chainId: '0xa869',
      chainName: 'Avalanche',
      nativeCurrency: {
        name: 'AVAX',
        symbol: 'AVAX',
        decimals: 18,
      },
      rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
      blockExplorerUrls: ['https://testnet.snowtrace.io/'],
    },
    networkId: 43113,
    httpProviderURL: 'https://api.avax-test.network/ext/bc/C/rpc',
    connectors: {
      network: 'Avalanche',
      cacheProvider: true,
      providerOptions: {
        injected: {
          display: {
            name: 'MetaMask',
            description: 'Home-BrowserWallet',
          },
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              43113: 'https://api.avax-test.network/ext/bc/C/rpc',
            },
          },
        },
        'custom-binance': {
          display: {
            name: 'Binance',
            description: 'Binance Chain Wallet',
            logo: binance,
          },
          package: 'binance',
          connector: async (ProviderPackage, options) => {
            const provider = (window).BinanceChain ;
            // const provider = window ;
            await provider.enable();
            return provider;
          },
        },
        'custom-onto': {
          display: {
            name: 'Onto',
            description: 'Onto-Wallet',
            logo: onto,
          },
          package: 'onto',
          connector: async (ProviderPackage, options) => {
            const provider = (window).onto ;
            console.log(provider)
            // const provider = window ;
            // await provider.enable();
            return provider;
          },
        },
        'custom-math': {
          display: {
            name: 'Math',
            description: 'Math-Wallet',
            logo: math,
          },
          package: 'math',
          connector: connectors.injected,
        },
        'custom-coin': {
          display: {
            name: 'coin98',
            description: 'coin98-Wallet',
            logo: coin98,
          },
          package: 'coin98',
          connector: connectors.injected,
        }
      },
    }
  }
}

// export const getAvalancheNetwork = () => {
//   return {
//     name: 'Avalanche',
//     params: {
//       chainId: '0xa86a',
//       chainName: 'Avalanche',
//       nativeCurrency: {
//         name: 'AVAX',
//         symbol: 'AVAX',
//         decimals: 18,
//       },
//       rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
//       blockExplorerUrls: ['https://snowtrace.io'],
//     },
//     networkId: 43114,
//     httpProviderURL: 'https://api.avax.network/ext/bc/C/rpc',
//     connectors: {
//       network: 'Avalanche',
//       cacheProvider: true,
//       providerOptions: {
//         injected: {
//           display: {
//             name: 'MetaMask',
//             description: 'Home-BrowserWallet',
//           },
//         },
//         walletconnect: {
//           package: WalletConnectProvider,
//           options: {
//             rpc: {
//               1: 'https://api.avax.network/ext/bc/C/rpc',
//               43114: 'https://api.avax.network/ext/bc/C/rpc',
//             },
//           },
//         },
//         'custom-binance': {
//           display: {
//             name: 'Binance',
//             description: 'Binance Chain Wallet',
//             logo: binance,
//           },
//           package: 'binance',
//           connector: async (ProviderPackage, options) => {
//             const provider = (window).BinanceChain ;
//             // const provider = window ;
//             await provider.enable();
//             return provider;
//           },
//         },
//         'custom-onto': {
//           display: {
//             name: 'Onto',
//             description: 'Onto-Wallet',
//             logo: onto,
//           },
//           package: 'onto',
//           connector: async (ProviderPackage, options) => {
//             const provider = (window).onto ;
//             console.log(provider)
//             // const provider = window ;
//             // await provider.enable();
//             return provider;
//           },
//         },
//         'custom-math': {
//           display: {
//             name: 'Math',
//             description: 'Math-Wallet',
//             logo: math,
//           },
//           package: 'math',
//           connector: connectors.injected,
//         },
//         'custom-coin': {
//           display: {
//             name: 'coin98',
//             description: 'coin98-Wallet',
//             logo: coin98,
//           },
//           package: 'coin98',
//           connector: connectors.injected,
//         }
//       },
//     }
//   }
// }

export const chainIdMap = {
  '0x61': getBSCNetwork, // 0x38 main 0x61 test
  '0x5': getETHNetwork,  // 0x1 main 0x5 goerli
  '0x13881': getPolygonNetwork, // 0x89 main 0x13881 mumbai
  '0xa869': getAvalancheNetwork,
  '421613': getArbitrumNetwork
}

export const chainSymbolMap = {
  'BSC': getBSCNetwork,
  'ETH': getETHNetwork,
  'Polygon': getPolygonNetwork,
  'Avalanche': getAvalancheNetwork,
  'Arbitrum':getArbitrumNetwork
}

export default {
  getBSCNetwork,
  getETHNetwork,
  getPolygonNetwork,
  getAvalancheNetwork,
  getArbitrumNetwork
}