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
import Mysterybox from '../testnet/MysteryBox'
import { toWei } from '../../lib/util'
import {getAddress, getCurAddress}  from '../testnet/address'
import { MaxUint256 } from '@ethersproject/constants'
import { post } from '../../http'
import notification from '../../components/notification'
import getNetworkData, { chainSymbolMap } from '../../wallet/helper/getNetworkData';
import { createProviderController } from '../../wallet/web3/createProviderController'
import store from '../../store'
import BigNumber from 'bignumber.js'
const chain = localStorage.getItem('kepler_chain') || 'Arbitrum'

const httpProviderURL = 'https://arb1.arbitrum.io/rpc'
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
  } else if (chain === 'Arbitrum') {
    httpProviderURL = getNetworkData.getArbitrumNetwork().httpProviderURL
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

export function sign(
  msg
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const sig = await web3.eth.personal.sign(msg, accounts[0]);
      res(sig)
    } catch (err) {
      rej(err);
    }
  })
}



// mysterybox
export function getVariableView() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.getVariableView().call()
}
export function getMintConfig() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.queryMintConfig().call()
}

export function queryPaymentConfig() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.queryPaymentConfig().call()
}
// mysterybox
export function itemsOfOwner(address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.tokenIdsOfOwner(address).call()
}
export function getMintCount(address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.getMintCount(address).call()
}

export function queryItem(tokenId) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.queryItem(tokenId).call()
}

export function keccak256MintArgs(account) {
    const web3 = createCurWeb3()
    return new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.keccak256MintArgs(account).call()
  }

export function mint(
  isSuit,
  gender,
  nftCount,
  referral,
  signature,
  amount,
  needValue
) {
    console.log(
        isSuit,
        gender,
        nftCount,
        referral,
        signature,
        amount)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.mint(
        isSuit,
        gender,
        nftCount,
        referral,
        signature
      )
      .send(needValue ? {from: address, value: toWei(amount).toString()}:{from: address})
      .then((result) => {
       res(result)
       notification.success({
        message: 'Transaction Success',
        description: <a  target="_blank" href={`https://testnet.bscscan.com/tx/${result.transactionHash}`}>Go to browser to view</a>
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
export function open(
  tokenId,
  nfts,
  nftTokenIds,
  deadline,
  signature
) {
  console.log(
    tokenId,
        nfts.split(','),
        nftTokenIds.split(','),
        deadline,
        signature
  )
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Mysterybox, getCurAddress().MysteryBox).methods.open(
        tokenId,
        nfts.split(','),
        nftTokenIds.split(','),
        deadline,
        '0x'+signature
      )
      .send({from: address})
      .then((result) => {
        console.log(result)
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