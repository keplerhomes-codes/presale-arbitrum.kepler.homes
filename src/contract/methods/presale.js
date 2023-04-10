import Web3 from 'web3'
import {bep20ABI} from '../abi/bep20'
import Presale from '../testnet/Presale'
import ChainlinkOracle from '../mainnet/chainlinkOracle'
import { ZERO_ADDRESS } from '../../lib/util'
import {getCurAddress}  from '../testnet/address'
import notification from '../../components/notification'
import getNetworkData, { chainSymbolMap } from '../../wallet/helper/getNetworkData';
import { createProviderController } from '../../wallet/web3/createProviderController'
import store from '../../store'
const chain = localStorage.getItem('kepler_chain') || 'Arbitrum'

const httpProviderURL = 'https://arb1.arbitrum.io/rpc'
console.log(httpProviderURL)
// const provider = await createProviderController(chain).connect()
export const web3 = new Web3(new Web3.providers.HttpProvider(httpProviderURL))
// if(!web3) {
    
// }

function createWeb3(chain) {
  let httpProviderURL = getNetworkData.getArbitrumNetwork().httpProviderURL
  return new Web3(new Web3.providers.HttpProvider(httpProviderURL))
}

function createCurWeb3() {
  const chain = store.getState().chain
  console.log(chain)
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
  return contractAddress == ZERO_ADDRESS ? web3.eth.getBalance(address) : 
  new web3.eth.Contract(bep20ABI, contractAddress).methods.balanceOf(address).call()
}

export function getPrice (address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(ChainlinkOracle, getCurAddress()[`ChainlinkOracle`]).methods.queryPrice(address).call()
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
  console.log(getCurAddress())
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
   referrer,
   signature
) {
  console.log(usdToken,
    usdAmount,
     referrer)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let innerJson = usdToken == ZERO_ADDRESS ? {from: address, value: usdAmount, gasLimit: 1000000}:{from: address, gasLimit: 1000000}
      // new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.buy(
      //   usdToken,
      //   usdAmount,
      //   referrer,
      //   signature
      // ).estimateGas(innerJson).then(res=>{
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
      new web3.eth.Contract(Presale, getCurAddress()[`Presale`]).methods.buy(
        usdToken,
        usdAmount,
        referrer,
        signature
      )
      .send(innerJson)
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