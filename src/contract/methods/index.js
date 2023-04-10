import Web3 from 'web3'
import {erc721ABI} from '../abi/erc721'
import {bep20ABI} from '../abi/bep20'
import nftmarket from '../mainnet/Nftmarket'
import PoolFactory from '../mainnet/PoolFactory'
import DepositPool from '../mainnet/DepositPool'
import RewardPool from '../mainnet/RewardPool'
import Bridge from '../mainnet/Bridge'
import { erc20ABI } from '../../contract/abi/erc20'
import nft from '../mainnet/nft'
import Mysterybox from '../mainnet/MysteryBox'
import { toWei } from '../../lib/util'
import {getAddress, getCurAddress}  from '../mainnet/address'
import { MaxUint256 } from '@ethersproject/constants'
import { post } from '../../http'
import notification from '../../components/notification'
import getNetworkData, { chainSymbolMap } from '../../wallet/helper/getNetworkData';
import { createProviderController } from '../../wallet/web3/createProviderController'
import store from '../../store'
import BigNumber from 'bignumber.js'
import { ChainIdMap } from '../../lib/util'
const chain = localStorage.getItem('kepler_chain') || 'Arbitrum'

const httpProviderURL = 'https://arb1.arbitrum.io/rpc'
console.log(httpProviderURL)
// const provider = await createProviderController(chain).connect()
export const web3 = new Web3(new Web3.providers.HttpProvider(httpProviderURL))
// if(!web3) {
    
// }

export function isAddress (address) {
  return web3.utils.isAddress(address)
}
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

//getSupportedCurrencies
export function getSupportedCurrencies () {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(nftmarket, getCurAddress().NFTMarket).methods.getSupportedCurrencies().call()
}

//getSupportedNFTs
export function getSupportedNFTs () {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(nftmarket, getCurAddress().NFTMarket).methods.getSupportedNFTs().call()
}

export function tokensOfOwner(address, user) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(nft, address).methods.tokensOfOwner(user).call()
}

export function tokenURI(address, tokenId) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(nft, address).methods.tokenURI(tokenId).call()
}

export function nftName(address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(nft, address).methods.name().call()
}

export function getItem(orderId) {
    return new web3.eth.Contract(nftmarket, getCurAddress().NFTMarket).methods.getItem(orderId).call()
  //   
}

export function close(
  orderId
) { // list nft
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(nftmarket, getCurAddress().NFTMarket).methods.close(orderId)
      .send({from: address})
      .then((result) => {
       res(result)
       listSuccess(orderId, result.transactionHash)
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
export function buy(
  orderId
) { // list nft
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(nftmarket, getCurAddress().NFTMarket).methods.buy(orderId)
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
export function list(
  orderId,
  nftAddress,
  tokenId,
  currency,
  price,
  deadline,
  signature
) { // list nft

  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(nftmarket, getCurAddress().NFTMarket).methods.open(
        orderId,
        nftAddress,
        tokenId,
        currency,
        price,
        deadline,
        signature
      )
      .send({from: address})
      .then((result) => {
       res(result)
       listSuccess(orderId, result.transactionHash)
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
export function listNft (
  tokenId,
  nftAddress,
  currency,
  price
) {
  console.log(tokenId,
    nftAddress,
    currency,
    price)
  return new Promise(async (res, rej) => {
     try {
      post('/api/v1/order', {
        chainId: ChainIdMap[localStorage.getItem('kepler_chain')||'ETH'],
        tokenId,
        makerAddress: store.getState().account.toLowerCase(),
        contractAddress:nftAddress.toLowerCase(),
        currencyAddress: currency.toLowerCase(),
        tradeAmount: price
      }).then(resp => {
        console.log(resp)
        list(
          resp.data.orderId,
          nftAddress,
          tokenId,
          currency,
          toWei(price.toString()).toString(),
          resp.data.deadline,
          '0x'+resp.data.signature
        ).then(result => {
          res(result)
        }).catch((error) => {
          rej(error)
        })
      })
     } catch (err) {
      rej(err);
    }

  })
}
const toSuccess = (
  orderId,
  hash
) => {
  return post('/api/order/success', {
    chainId: 97,
    orderId
  })
}

// start when list succeed
export function listSuccess (
  orderId,
  hash
) {
  return new Promise(async (res, rej) => {
     try {
      toSuccess(
        orderId,
        hash
      ).then(res => {
        if(!res.data.success) {
          listSuccess(
            orderId,
            hash)
        }
      })
     } catch (err) {
      rej(err);
    }

  })
}

export function isApprovedForAll (
  address,
  operator
) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(nft, address).methods.isApprovedForAll(store.getState().account, operator).call()
}

export const setApprovalForAll = async (nftaddress, contractAddress) => {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(nft, nftaddress).methods.setApprovalForAll(
        contractAddress, true
      )
      .send({from: address})
      .on('transactionHash', function() {
      })
      .on('receipt', function(result){
        res()
        notification.success({
          message: 'Transaction Success',
          description: <a  target="_blank" href={`${chainSymbolMap[store.getState().chain]().params.blockExplorerUrls[0]}/tx/${result.transactionHash}`}>Go to browser to view</a>
        })
      }).on('error', function (error) {
        console.log(error)
        rej(error);
      })
      .catch((error) => {
        rej(error);
      });
    } catch (err) {
      rej(err);
    }
  })
}

// approve
export const approve = async (tokenaddress, contractAddress) => {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(bep20ABI, tokenaddress).methods.approve(contractAddress, MaxUint256)
      .send({from: address, gasLimit: 1000000})
      .on('transactionHash', function() {
      })
      .on('receipt', function(result){
        console.log(result)
        res(Number(MaxUint256.toString()))
        notification.success({
          message: 'Transaction Success',
          description: <a  target="_blank" href={`${chainSymbolMap[store.getState().chain]().params.blockExplorerUrls[0]}/tx/${result.transactionHash}`}>Go to browser to view</a>
        })
      }).on('error', function (error) {
        console.log(error)
        rej(error);
      })
      .catch((error) => {
        rej(error);
      });
    } catch (err) {
      rej(err);
    }
  })
}
export function allowance (
  address,
  contractAddress
) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(bep20ABI, address).methods.allowance(store.getState().account, contractAddress)
}

export function getDashboardView () {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(PoolFactory, getCurAddress().PoolFactory).methods.getDashboardView().call()
}

export function getDepositPoolViews (staker) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(PoolFactory, getCurAddress().PoolFactory).methods.getDepositPoolViews(staker).call()
}

export function getTokenSymbol (address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(bep20ABI, address).methods.symbol().call()
}

export function balanceOf (contractAddress, address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(bep20ABI, contractAddress).methods.balanceOf(address).call()
}

export function stake(
  amount, lockUnits, contractAddress
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(DepositPool, contractAddress).methods.stake(toWei(amount).toString(), lockUnits)
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

export function unstake(
  depositId, contractAddress
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(DepositPool, contractAddress).methods.unstake(depositId)
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

export function getMyDepositView (staker) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(PoolFactory, getCurAddress().PoolFactory).methods.getMyDepositView(staker).call()
}

export function getLockedRewardView (staker) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(PoolFactory, getCurAddress().PoolFactory).methods.getLockedRewardView(staker).call()
}

export function getLockedRewards (staker) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(RewardPool, getCurAddress().RewardPool).methods.getLockedRewards(staker).call()
}

export function withdraw(
  rewardId
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(RewardPool, getCurAddress().RewardPool).methods.withdraw(rewardId)
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

export function claim(
  depositId, contractAddress
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(DepositPool, contractAddress).methods.claim(depositId)
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

export function applyToken({
  orderId,
  applicant,
  receipient,
  fromChainId,
  fromToken,
  amount,
  toChainId,
  deadline,
  signature,
  sendFee
}
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Bridge, getCurAddress().Bridge).methods.applyToken(orderId,
        applicant,
        receipient,
        fromChainId,
        fromToken,
        amount,
        toChainId,
        deadline,
        '0x'+signature)
      .send({from: address, value: sendFee})
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

export function applyNFT({
  orderId,
  applicant,
  receipient,
  fromChainId,
  fromNFT,
  fromTokenIds,
  toChainId,
  deadline,
  signature,
  sendFee
}
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Bridge, getCurAddress().Bridge).methods.applyNFT(orderId,
        applicant,
        receipient,
        fromChainId,
        fromNFT,
        fromTokenIds,
        toChainId,
        deadline,
        '0x'+signature)
      .send({from: address, value: sendFee})
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

export function claimToken({
  orderId,
  applicant,
  receipient,
  toChainId,
  toToken,
  amount,
  deadline,
  signature,
  tokenSymbol,
}
) {
  console.log({orderId,
    applicant,
    receipient,
    toChainId,
    toToken,
    amount,
    deadline,
    signature:'0x'+signature})
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Bridge, getCurAddress().Bridge).methods.claimToken(orderId,
        applicant,
        receipient,
        toChainId,
        toToken,
        amount,
        deadline,
        '0x'+signature)
      .send({from: address})
      .then((result) => {
        res(result)
        notification.success({
          message: `Claim ${new BigNumber(amount).dividedBy(10 ** 18).toString()} ${tokenSymbol}, Please wait minutes to check the cross-chain tx status on the explorer`,
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

export function claimNFT({
  orderId,
  applicant,
  receipient,
  toChainId,
  toNFT,
  tokenIds,
  deadline,
  signature,
  nftName,
}
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Bridge, getCurAddress().Bridge).methods.claimNFT(orderId,
        applicant,
        receipient,
        toChainId,
        toNFT,
        tokenIds,
        deadline,
        '0x'+signature)
      .send({from: address})
      .then((result) => {
        res(result)
        notification.success({
          message: `Claim ${nftName}, Please wait minutes to check the cross-chain tx status on the explorer`,
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

export function getBridgeSupportedNFTs() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Bridge, getCurAddress().Bridge).methods.getSupportedNFTs().call()
}


// mysterybox
export function getPrice() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Mysterybox, getCurAddress().KeplerBox).methods.price().call()
}
// Mysterybox
export function getCurrency() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Mysterybox, getCurAddress().KeplerBox).methods.currency().call()
}


export function mint(
  isSuit,
  gender,
  nftCount,
  amount
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Mysterybox, getCurAddress().KeplerBox).methods.mint(
        isSuit,
        gender,
        nftCount
      )
      .send({from: address, value: toWei(amount).toString()})
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