import store,{ setToLogin, setToConnectWallet, setConnectWalletChain } from "../store";
import web3 from 'web3';
import BigNumber from "bignumber.js";
import {getCurAddress} from "../contract/mainnet/address";
import chainCurrency from "./chainCurrency";
import Nftlist from "../contract/mainnet/Nftlist";
export const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
// export const ChainIdName = {
//   5: 'eth',
//   97: 'bsc',
//   80001: 'matic',
//   43114: 'avax',
//   666: 'sol'
// }
// export const FullChainIdName = {
//   5: 'Ethereum',
//   97: 'Binance Smart Chain',
//   80001: 'Matic',
//   43114: 'Avax',
//   666: 'Solana'
// }
// export const ChainIdMap = {
//   'ETH': 5,  // 5test 1main
//   'BSC': 97,
//   'Polygon': 80001,
//   'Avalanche': 43113,
//   'Solana': 666
// }
export const ChainIdName = {
  1: 'eth',
  56: 'bsc',
  137: 'matic',
  43113: 'avax',
  666: 'sol',
  42161: 'arb'
}
export const FullChainIdName = {
  1: 'Ethereum',
  56: 'Binance Smart Chain',
  137: 'Matic',
  43113: 'Avax',
  666: 'Solana',
  42161: 'Arbitrum'
}
export const ChainIdMap = {
  'ETH': 1,  // 5test 1main
  'BSC': 56,
  'Polygon': 137,
  'Avalanche': 43114,
  'Solana': 666,
  'Arbitrum': 42161
}
export const fullNameBySymbol = {
  'BNB': 'binancecoin',
  'ETH': 'ethereum'
}
export const showLogin = () => {
  store.dispatch(setToLogin(true))
}
export const showRegister = () => {
  store.dispatch(setToLogin('register'))
}
export const showConnectWallet = (chain) => {
  if (chain){
    store.dispatch(setConnectWalletChain(chain))
  }
  store.dispatch(setToConnectWallet(true))
}
export const toUnit = (amount) => {
  return toBN(web3.utils.toWei(amount.toString(), "ether").toString());
};
export const toWei = (amount) => {
  return web3.utils.toWei(amount, "ether");
};
export const toFixed = (amount, num) => {
  return new BigNumber(
    Math.floor(Number(amount) * Math.pow(10, num)) / Math.pow(10, num)
  ).toString(10);
};
export const toBN = (n) => {
  return new BigNumber(n);
};

const numberToStr = (num = 0) => {
  let splits = num.toString().toLowerCase().split("e+");
  let result = splits[0];
  if (splits.length === 2) {
    result = result * Math.pow(10, parseInt(splits[1]));
  }
  return result.toLocaleString("fullwide", {
    useGrouping: false,
  });
};
export const fromUnit = (wei) => {
  let weiwei = Number(wei) || 0
  return web3.utils.fromWei((numberToStr(weiwei) || 0).toString(), "ether");
};
export const findNameByNftId = (id) => {
  let name = ''
  if(!id) {
    return ''
  }
  for(let i in Nftlist) {
    if(Nftlist[i].nftId == id) {
      name = Nftlist[i].symbol
    }
  }
  return name
}
export const findAddressByName = (name) => {
   let address = ''
   if(!name) {
    return ''
  }
  const ADDRESS = getCurAddress()
   for(let i in ADDRESS) {
     if(name.toLowerCase() == i.toLowerCase()) {
       address = ADDRESS[i]
     }
   }
   return address
}
export const findNftIdByAddress = (address) => {
   let id = ''
   Nftlist.map(item => {
     if(item.symbol == findNameByAddress(address)) {
       id = item.nftId
     }
   })
   return id
}
export const findNameByTokenId = (tokenId) => {
  let name = ''
  if(!tokenId) {
    return ''
  }
  for(let i in Nftlist) {
    if(Nftlist[i].nftId == tokenId.toString().split('')[0]) {
      name = Nftlist[i].name
    }
  }
  return name

}

export const findNameByAddress = (address) => {
  let name = ''
  if(!address) {
    return ''
  }
  const ADDRESS = getCurAddress()
  for(let i in ADDRESS) {
    if(ADDRESS[i].toLowerCase() == address.toLowerCase()) {
      name = i
    }
  }
  return name
}

export const findCurrencyByAddress = (address, chainName) => {
    let chain = chainName || localStorage.getItem('kepler_chain') || 'BSC'
    console.log(chain)
    if(address == ZERO_ADDRESS) {
      return chainCurrency[chain]
    } else {
      return findNameByAddress(address)
    }
}

export const formatTime = (timestamp) => {
  if(!timestamp) {
    return '-'
  }
  let date = new Date(Number(timestamp) * 1000);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};
export const formatTimeShort = (timestamp) => {
  if(!timestamp) {
    return '-'
  }
  let date = new Date(Number(timestamp));
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join("-")
  );
};
export const formatYearDate = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return (
    [year, month, day].map(formatNumber).join("-")
  );
};
export const formatDate = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return (
    [month, day].map(formatNumber).join("-")
  );
};
export const formatHour = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  var hour = date.getHours();
  var minute = date.getMinutes();
  return (
    [hour, minute].map(formatNumber).join(":")
  );
};
export const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};
export const addPoint = (address, len=5) => {
  return address ?address.substr(0, len)+'...'+ address.substr(address.length-len,):''
}
export const numFormat = function (num){
  num=num.toString().split(".");  // 分隔小数点
  var arr=num[0].split("").reverse();  // 转换成字符数组并且倒序排列
  var res=[];
  for(var i=0,len=arr.length;i<len;i++){
    if(i%3===0&&i!==0){
       res.push(",");   // 添加分隔符
    }
    res.push(arr[i]);
  }
  res.reverse(); // 再次倒序成为正确的顺序
  
  if(num[1]){  // 如果有小数的话添加小数部分
    return res.join("").concat("."+num[1]);
  }else{
    return res.join("");
  }
}