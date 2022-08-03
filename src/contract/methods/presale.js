import Web3 from 'web3'
import {erc721ABI} from '../abi/erc721'
import {bep20ABI} from '../abi/bep20'
import nftmarket from '../testnet/Nftmarket'
import PoolFactory from '../testnet/PoolFactory'
import DepositPool from '../testnet/DepositPool'
import RewardPool from '../testnet/RewardPool'
import Bridge from '../testnet/Bridge'
import { erc20ABI } from '../../contract/abi/erc20'
import nft from '../testnet/nft'
import Airdrop from '../testnet/Airdrop'
import Presale from '../testnet/Presale'
import { toWei } from '../../lib/util'
import {getAddress, getCurAddress}  from '../testnet/address'
import { MaxUint256 } from '@ethersproject/constants'
import { post } from '../../http'
import notification from '../../components/notification'
import getNetworkData, { chainSymbolMap } from '../../wallet/helper/getNetworkData';
import { createProviderController } from '../../wallet/web3/createProviderController'
import store from '../../store'
import BigNumber from 'bignumber.js'
const chain = localStorage.getItem('kepler_chain') || 'ETH'

const httpProviderURL = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
console.log(httpProviderURL)
// const provider = await createProviderController(chain).connect()
export const web3 = new Web3(new Web3.providers.HttpProvider(httpProviderURL))
// if(!web3) {
    
// }

function createWeb3(chain) {
  let httpProviderURL

  if (chain === 'ETH') {
    httpProviderURL = getNetworkData.getETHNetwork().httpProviderURL
  } else if (chain === 'BSC') {
    httpProviderURL = getNetworkData.getBSCNetwork().httpProviderURL
  } else if (chain === 'Polygon') {
    httpProviderURL = getNetworkData.getPolygonNetwork().httpProviderURL
  } else if (chain === 'Avalanche') {
    httpProviderURL = getNetworkData.getAvalancheNetwork().httpProviderURL
  }
  
  return new Web3(new Web3.providers.HttpProvider(httpProviderURL))
}

function createCurWeb3() {
  const chain = store.getState().chain
  return createWeb3(chain)
}

// / 将string转成bytes32
const stringToBytes32 = (s) => {
  let result = web3.utils.fromAscii(s);
  while (result.length < 66) {
      result = result + "0";
  }
  return result;
}


export function balanceOf (contractAddress, address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(bep20ABI, contractAddress).methods.balanceOf(address).call()
}



// presale
export function querySaledUsdAmount() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.querySaledUsdAmount().call()
}
// presale
export function queryRoundPrices() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.queryRoundPrices().call()
}
// presale
export function queryConfig() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.queryConfig().call()
}

// presale
export function queryStableCoins() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.queryStableCoins().call()
}
// presale
export function queryClaimables() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.queryClaimables().call()
}
// presale
export function queryBuyRecords(address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.queryBuyRecords(address).call()
}
export function buy(
  usdToken,
  usdAmount,
  lockPeriods,
   referrer
) {
  console.log(usdToken,
    usdAmount,
    lockPeriods,
     referrer)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.buy(
        usdToken,
        usdAmount,
        lockPeriods,
        referrer
      )
      .send({from: address})
      .then((result) => {
       res(result)
       notification.success({
        message: 'Transaction Success',
        description: <a  target="_blank" href={`${chainSymbolMap[store.getState().chain]().params.blockExplorerUrls[0]}/tx/${result.transactionHash}`}>Go to browser to view</a>
      })
      })
      .catch((error) => {
        rej(error);
      });
    } catch (err) {
      rej(err);
    }
  })
}