
import WalletConnectProvider from '@walletconnect/web3-provider';
import binance from '../../assets/images/wallets/binance-chain.png'
import math from '../../assets/images/wallets/math.png'
import coin98 from '../../assets/images/wallets/coin98.png'
import onto from '../../assets/images/wallets/onto.png'
import bitkeep from '../../assets/images/wallets/bitkeep.svg'
import nabox from '../../assets/images/wallets/nabox.svg'
import tokenpocket from '../../assets/images/wallets/tokenpocket.png'
export const providerOptions = ({walletconnectOptions}) => {
    return {
      injected: {
        display: {
          name: 'MetaMask',
          description: 'Home-BrowserWallet',
        },
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: walletconnectOptions,
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
          if (!provider) {
            window.open('https://www.binance.com/en/wallet-direct')
            return null
          }
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
          if (window.onto || (window.ethereum && window.ethereum.isONTO)) {
            const provider = window.onto || window.ethereum;
            await provider.enable();
            return provider;
          }
          window.open('https://onto.app/')
          return null;
        },
      },
      'custom-math': {
        display: {
          name: 'Math',
          description: 'Math-Wallet',
          logo: math,
        },
        package: 'math',
        connector: async (ProviderPackage, options) => {
          if (window.ethereum && window.ethereum.isMathWallet) {
            console.log('MathWallet is installed!');
            const provider = (window).ethereum;
            await provider.enable();
            return provider;
          }
          window.open('https://mathwallet.org/')
          return null
        },
      },
      'custom-coin': {
        display: {
          name: 'coin98',
          description: 'coin98-Wallet',
          logo: coin98,
        },
        package: 'coin98',
        connector: async (ProviderPackage, options) => {
          if (window.ethereum && window.ethereum.isCoin98) {
            console.log('Coin98 Extension is installed!');
            const provider = (window).ethereum;
            await provider.enable();
            return provider;
          }
          window.open('https://coin98.com/')
          return null
        },
      },
      'custom-bitkeep': {
        display: {
          name: 'Bitkeep',
          description: 'Bitkeep-Wallet',
          logo: bitkeep,
        },
        package: 'bitkeep',
        connector: async (ProviderPackage, options) => {
          if (window.ethereum && window.ethereum.isBitKeep) {
            const provider = (window).ethereum;
            await provider.enable();
            return provider;
          }
          window.open('https://bitkeep.com/')
          return null
        },
      },
      'custom-nabox': {
        display: {
          name: 'Nabox',
          description: 'Nabox-Wallet',
          logo: nabox,
        },
        package: 'nabox',
        connector: async (ProviderPackage, options) => {
          const provider = (window).NaboxWallet;
          if (!provider) {
            window.open('https://nabox.io/')
            return null
          }
          await provider.enable();
          return provider;
        },
      },
      'custom-tokenpocket': {
        display: {
          name: 'TokenPocket',
          description: 'TokenPocket-Wallet',
          logo: tokenpocket,
        },
        package: 'tokenpocket',
        connector: async (ProviderPackage, options) => {
          if (window.ethereum && window.ethereum.isTokenPocket) {
            console.log('TokenPocket Extension is installed!');
            const provider = (window).ethereum;
            await provider.enable();
            return provider;
          }
          window.open('https://extension.tokenpocket.pro/')
          return null
        },
      }
    }
  }