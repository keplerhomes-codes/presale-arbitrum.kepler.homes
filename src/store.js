import { createAction, createReducer, configureStore } from '@reduxjs/toolkit'
export const connect = createAction('connect')
export const disconnect = createAction('disconnect')
export const settheme = createAction('settheme')
export const setconnect = createAction('setconnect')
export const setreload = createAction('setreload')
export const setChain = createAction('setChain')
export const setToken = createAction('setToken')
export const setUserInfo = createAction('setUserInfo')
export const setToLogin = createAction('setToLogin')
export const setToConnectWallet = createAction('setToConnectWallet')
export const setConnectWalletChain = createAction('setConnectWalletChain')
export const setFirst = createAction('setFirst')
export const setPresaleConfig = createAction('setPresaleConfig')

function getChainType(chain) {
  if (chain === 'Solana') {
    return 'Solana'
  } else {
    return 'EVM'
  }
}

const reducer = createReducer(
  {
    connect: false,
    chain: localStorage.getItem('kepler_chain') || 'Arbitrum',
    chainType: getChainType(localStorage.getItem('kepler_chain')) || 'EVM',
    account: '',
    theme: 'light-theme',
    willconnect: false,
    reload: 0,
    token: localStorage.getItem('token') || null,
    userInfo: {},
    showLogin: false,
    showConnectWallet: false,
    connectWalletChain: 'Avalanche',
    isFirst: true,
    presaleConfig: {}
  },
  builder => builder
    .addCase(connect, (state, action) => {
      return {
        ...state,
        connect: true,
        account: action.payload
      }
    })
    .addCase(disconnect, (state, action) => {
      localStorage.setItem('token', null)
      return {
        ...state,
        connect: false,
        token: null,
        account: ''
      }
    })
    .addCase(settheme, (state, action) => {
      return {
        ...state,
        theme: action.payload
      }
    })
    .addCase(setconnect, (state, action) => {
      return {
        ...state,
        willconnect: !!(action.payload)
      }
    })
    .addCase(setreload, (state, action) => {
      return {
        ...state,
        reload: Number(action.payload)
      }
    })
    .addCase(setChain, (state, action) => {
      return {
        ...state,
        token: null,
        chain: action.payload,
        chainType: getChainType(action.payload)
      }
    })
    .addCase(setToken, (state, action) => {
      localStorage.setItem('token', action.payload)
      return {
        ...state,
        token: action.payload
      }
    })
    .addCase(setUserInfo, (state, action) => {
      return {
        ...state,
        userInfo: action.payload
      }
    })
    .addCase(setToLogin, (state, action) => {
      return {
        ...state,
        showLogin: action.payload
      }
    })
    .addCase(setToConnectWallet, (state, action) => {
      return {
        ...state,
        showConnectWallet: action.payload
      }
    })
    .addCase(setConnectWalletChain, (state, action) => {
      return {
        ...state,
        connectWalletChain: action.payload
      }
    })
    .addCase(setFirst, (state, action) => {
      return {
        ...state,
        isFirst: action.payload
      }
    })
    .addCase(setPresaleConfig, (state, action) => {
      return {
        ...state,
        presaleConfig: {...action.payload, refeererMinBuyAmount: 0}
      }
    })
)

export default configureStore({
  reducer
})