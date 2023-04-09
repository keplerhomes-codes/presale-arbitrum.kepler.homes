import axios from "axios"
import qs from 'qs'
import store from '../store'
import {setToken} from '../store'
import {showLogin} from '../lib/util'


axios.interceptors.response.use(
  response => {
    // console.log(response)
    return response
  },
  error => {
    if(error.response && error.response.status == 401) {
      store.dispatch(setToken(''))
      // showLogin()
    }
    return Promise.reject(error);
  }
)

export const baseUrl = 'https://api-beta.kepler.homes'
export function get(
  url,
  data
) {
  return new Promise((res, rej) => {
    if(data) {
      let params = []
      for(let i in data) {
        params.push(`${i}=${data[i]}`)
      }
      url+=('?'+params.join('&'))
    }
    axios({
      method: 'get',
      url: url.slice(0, 4) === 'http' ? url : (baseUrl + url),
       headers: {
          'authorization': store.getState().token
       }
   }).then(result => {
     console.log(result)
    if (!('code' in result.data)) {
      res(result.data)
    } else if(Number(result.data.code) == 1) {
      res(result.data)
    } else {
     rej(result.data)
    }
 })
  })
}
export function post(
  url,
  data
) {
  return new Promise((res, rej) => {
    axios({
      method: 'post',
      url: baseUrl + url,
      data,
      transformRequest: [
         function (data) {
            let ret = ''
            for (let it in data) {
               ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.lastIndexOf('&'));
            return ret
         }
       ],
       headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'authorization': store.getState().token
       }
   }).then(result => {
     console.log(result)
     console.log(Number(result.code) == 1)
    if(Number(result.data.code) == 1) {
      res(result.data)
    } else {
      rej(result.data)
     }
 })
  })
}
export function upload(
  url,
  data
) {
  return new Promise((res, rej) => {
    axios({
      method: 'post',
      url: baseUrl + url,
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': store.getState().token
      }
   }).then(result => {
     console.log(result)
     console.log(Number(result.code) == 1)
    if(Number(result.data.code) == 1) {
      res(result.data)
    } else {
      rej(result.data)
     }
 })
  })
}

export function axios_get(
  url,
  data
) {
  return new Promise((res, rej) => {
    if(data) {
      let params = []
      for(let i in data) {
        params.push(`${i}=${data[i]}`)
      }
      url+=('?'+params.join('&'))
    }
    axios({
      method: 'get',
      url: url
   }).then(result => {
      res(result.data)
 }).catch(err => {
   rej(err)
 })
  })
}