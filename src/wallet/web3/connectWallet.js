import Web3 from 'web3'
import store, {connect, disconnect, setconnect, setChain, setUserInfo, setToken} from '../../store'
// import {web3} from '../../http'
import {createProviderController} from './createProviderController'
import i18n from '../../i18n'
import getNetworkData, {chainIdMap} from '../helper/getNetworkData';
import notification from '../../components/notification'

const networkCheck  = (web3, provider, chainId) => {
  const chain = 'Arbitrum'
  const params = getNetworkData[`get${chain}Network`]().params
  const _networkId = getNetworkData[`get${chain}Network`]().networkId
  console.log(params)
  const networkId = web3.utils.isHex(chainId) ? web3.utils.hexToNumber(chainId) : chainId;
  if(networkId !== _networkId && store.getState().connect) {
    notification.destroy()
    notification.error({
      message: i18n.t('Please connect to the correct network first'),
    });
  
    if (_networkId === 42161) {
      provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: web3.utils.toHex(42161),
        }],
      })
      .then((res) => {
        notification.destroy()
        notification.success({
          message: i18n.t('switch network success'),
        });
      })
      .catch((err) => {
        notification.destroy()
        notification.error({
          message: i18n.t('Please connect to the correct network first'),
        });
      });
    } else if (_networkId === 42161) {
      provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: web3.utils.toHex(421611),
        }],
      })
      .then((res) => {
        notification.destroy()
        notification.success({
          message: i18n.t('switch network success'),
        });
      })
      .catch((err) => {
        notification.destroy()
        notification.error({
          message: i18n.t('Please connect to the correct network first'),
        });
      });
    } else {
      provider
      .request({
        method: 'wallet_addEthereumChain',
        params: [params],
      })
      .then((res) => {
        notification.destroy()
        notification.success({
          message: i18n.t('switch network success'),
        });
      })
      .catch((err) => {
        console.log(err)
        notification.destroy()
        notification.error({
          message: i18n.t('Please connect to the correct network first'),
        });
      });
    }
  }
  if(networkId === _networkId) {
    notification.destroy()
  }
}

const setAccount = async (provider) => {
  const chain = localStorage.getItem('kepler_chain') || 'Arbitrum'
  const httpProviderURL = getNetworkData[`get${chain}Network`].httpProviderURL
  
  let web3 = new Web3(provider)
  if(!web3) {
    web3 = new Web3(new Web3.providers.HttpProvider(httpProviderURL));
  }
  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  store.dispatch(connect(address))
  store.dispatch(setconnect(''))
  const chainId = await web3.eth.getChainId()
  networkCheck(web3, provider, chainId)
  provider.on('accountsChanged', async (accounts) => {
    console.log('account changed', accounts)
    store.dispatch(setUserInfo({}))
    localStorage.setItem('token', null)
    store.dispatch(setToken(null))
    if (accounts[0]) {
      store.dispatch(connect(accounts[0]))
    } else {
      store.dispatch(disconnect(''))
    }
  });
  provider.on('chainChanged', async (chainId) => {
    console.log(chainId)
    const chain = chainIdMap[chainId]
    store.dispatch(setUserInfo({}))
    localStorage.setItem('token', null)
    store.dispatch(setToken(null))
    if (chain) {
      store.dispatch(setChain(chain().name))
      localStorage.setItem('kepler_chain', chain().name)
      networkCheck(web3, provider, chainId)
    }
  });
}
const connectWallet = async (provider)=> {
  try {
    store.dispatch(setconnect('1'))
    if (provider) {
      setAccount(provider)
    } else {
      const chain = localStorage.getItem('kepler_chain') || 'Arbitrum'
      const provider = await createProviderController(chain).connect()
      setAccount(provider)
    }
  } catch (error) {
    console.log(error)
    localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
  }
}
// export function approve (
//   spender:string,
//   amount: number
// ) {
//   return
// }
export default connectWallet

