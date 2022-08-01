import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../Rewards.scss'
import banner from '../../../assets/images/farm/farm-banner.png'
import Search from "../../../components/Base/Search"
import Select from "../../../components/Base/Select"
import tokenLogo0 from '../../../assets/images/farm/token0.png'
import tokenLogo1 from '../../../assets/images/farm/token1.png'
import tokenLogo2 from '../../../assets/images/farm/token2.png'
import busdLogo from '../../../assets/images/farm/BUSD.svg'

import link from '../../../assets/images/farm/link.png'
import Modal from '../../../components/Base/Modal'
import { Input, Button, Slider, Spin, Table } from 'antd';
import { getDepositPoolViews, getTokenSymbol, allowance, approve, stake, unstake, balanceOf, getMyDepositView, getLockedRewardView, claim, withdraw } from '../../../contract/methods'
import {connect} from 'react-redux'
import accounting from 'accounting'
import BigNumber from "bignumber.js";
import ADDRESS from '../../../contract/testnet/address';
import notification from '../../../components/notification';
import classNames from 'classnames';
import { format } from 'date-fns'
import Empty from '../Empty'
import { chainSymbolMap } from '../../../wallet/helper/getNetworkData'
import { useTranslation } from 'react-i18next'
import idl from '../../../contract/testnet/SolPoolsIDL'
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, Provider, web3, BN } from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import SolAddress from '../../../contract/testnet/SolAddress'
import { TOKEN_PROGRAM_ID, getAccount } from "@solana/spl-token";
import { getOrCreateAssociatedTokenAccount } from '../../../lib/solana/getOrCreateAssociatedTokenAccount'
import { useLocation, useNavigate } from "react-router-dom"

const programID = new PublicKey(SolAddress.pools.programId);
const UNIT = 1e9;

function Rewards (props) {
  const {t, i18n} = useTranslation()
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showUnstakeModal, setShowUnstakeModal] = useState(false)
  const [claimList, setClaimList] = useState([])
  const [lockedList, setLockedList] = useState([])
  const [symbolMap, setSymbolMap] = useState({})
  const [allowanceMap, setAllowanceMap] = useState({})
  let [isApproving, setIsApproving] = useState(false)
  let [isStaking, setIsStaking] = useState(false)
  let [isUnstaking, setIsUnstaking] = useState(false)
  let [needApprove, setNeedApprove] = useState(false)
  const [activePool, setActivePool] = useState()
  const [activeStaking, setActiveStaking] = useState()
  const [amount, setAmount] = useState()
  const [unstakeAmount, setUnstakeAmount] = useState()
  const [balance, setBalance] = useState()
  const [stakeType, setStakeType] = useState(0)
  const [weight, setWeight] = useState(1)
  const [lockUnits, setLockUnits] = useState(0)
  const [claimLoadingMap, setClaimLoadingMap] = useState({})
  const [withdrawLoadingMap, setWithdrawLoadingMap] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [blockExplorerUrl, setBlockExplorerUrl] = useState('')

  const { connection } = useConnection()
  const wallet = useWallet();
  const [program, setProgram] = useState()
  const [activeTokenAccount, setActiveTokenAccount] = useState()
  const [activeToken, setActiveToken] = useState()
  // const [programAccount, setProgramAccount] = useState(new PublicKey(SolAddress.pools.programAccount))
  // const [programAccountInfo, setProgramAccountInfo] = useState()
  const [globalAccount, setGlobalAccount] = useState(new PublicKey(SolAddress.pools.globalAccount))
  const [keplToken, setKeplToken] = useState(new PublicKey(SolAddress.KEPL.publicKey))
  const [kemeToken, setKemeToken] = useState(new PublicKey(SolAddress.KEME.publicKey))
  const [user, setUser] = useState()
  const nav = useNavigate()
  const location = useLocation();
  const [farmTabIndex, setFarmTabIndex] = useState(location.pathname === '/farm/claim' ? 0 : 1)

  useEffect(() => {
    if (location.pathname === '/farm/claim') {
      setFarmTabIndex(0)
    } else {
      setFarmTabIndex(1)
    }
  }, [location]);

  function getProvider() {
    const provider = new Provider(
      connection, wallet, 'confirmed',
    );
    return provider;
  }

   useEffect(() => {
    if (!props.chain || props.chain !== 'Solana' || !wallet.connected) {
      return
    }
    const provider = getProvider()
    const program = new Program(idl, programID, provider);
    setProgram(program)
  }, [props.chain, wallet.connected])

  async function getUserAccount() {
    let [key] = await PublicKey.findProgramAddress(
      [Buffer.from("user-account"), wallet.publicKey.toBuffer()], 
      programID
    );
    return key;
  }

  async function showUserAccount() {
    let key = await getUserAccount();
    let pubkey = new PublicKey(key);
    let accountInfo = await program.account.userAccount.fetchNullable(pubkey)
    console.log(accountInfo)
    return accountInfo
  }

  async function getGlobalAccountKey(programId) {
    let [GlobalAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("global-account")],
        programId
    );
    return GlobalAccount;
  }

  async function getUserAccountKey(user) {
    let [key] = await PublicKey.findProgramAddress(
        [Buffer.from("user-account"), user.toBuffer()],
        program.programId
    );
    return key;
  }

  function getClaimData(globalAccount, userAccount) {
    let poolMap = {};
    globalAccount.pools.forEach((pool) => (poolMap[pool.depositToken] = pool));
    function getData(deposit) {
      let rewards = null;
      let pool = poolMap[deposit.depositToken];
      let poolIndex = pool.rewardIndexMul;
      let depositIndex = deposit.rewardIndexMul;
      let index = poolIndex.sub(depositIndex);
      if (index > 0) {
          let amount = deposit.amount.add(deposit.weightedAmount);
          rewards = index.mul(amount) / UNIT;
      }
      return { depositId: deposit.id, depositToken: pool.depositToken, rewards };
    }
    return userAccount.deposits.map((d) => getData(d));
  }

  async function loadClaimData() {
    try {
      let globalAccount = await program.account.globalAccount.fetchNullable(
        await getGlobalAccountKey(program.programId)
      );

      let userAccount = await program.account.userAccount.fetchNullable(
        await getUserAccountKey(wallet.publicKey)
      );

      let clamData = getClaimData(globalAccount, userAccount);
      console.log("clamData:", JSON.stringify(hummanView(clamData)));
      setClaimList(clamData)
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function getWithdrawData(globalAccount, poolsData, userAccount) {
    let poolMap = {};
    globalAccount.pools.forEach((pool) => (poolMap[pool.depositToken] = pool));
    let now = new Date().valueOf() / 1000;
    let maxWithdrawCount = globalAccount.lockedRewardWithdrawCount;
    let multiplierMul = globalAccount.lockedRewardMultiplierMul;
    let withdrawInterval = globalAccount.lockedRewardWithdrawInterval;
    let rewardPool = poolMap[keplToken.toString()];

    let poolRewardIndexMul = rewardPool.rewardIndexMul;

    function getData(claim) {
      let poolData = poolsData[claim.depositToken];
      let passedTime = now - claim.lockTime;

      let expectWithdrawnCount = passedTime / withdrawInterval;
      if (expectWithdrawnCount > maxWithdrawCount) {
        expectWithdrawnCount = maxWithdrawCount;
      }

      //可以withdraw的次数
      let withdrawCount = expectWithdrawnCount - claim.withdrawnCount;

      //离下次withdraw还有多长时间
      let remainingWithdrawTime =
          withdrawCount >= 1 ? -1 : (1 - withdrawCount) * withdrawInterval;

      let withdrawAmount = claim.amount / maxWithdrawCount;
      let weightedWithdrawAmount = (withdrawAmount / UNIT) * multiplierMul;
      let amount = withdrawAmount + weightedWithdrawAmount;

      let index = poolRewardIndexMul.sub(claim.rewardIndexMul);
      let reward = (index * amount) / UNIT;

      return {
        id: claim.id,
        token: claim.depositToken,
        claimedReward: claim.amount,
        pendingReward: claim.remaingAmount,
        apy: poolData.apy * 2,
        //当前时间+remainingWithdrawTime,即为NextUnlockTime
        remainingWithdrawTime: remainingWithdrawTime,
        availableRewards: reward,
      };
    }
    return userAccount.claims.map((claim) => getData(claim));
  }

  async function queryPrice(token) {
    //模拟数据, 因为当前无法得到token数据
    return UNIT;
  }

  //计算Pool的真实TVL
  async function calculatePoolTVL(pool) {
    let price = await queryPrice(pool.depositToken);
    return (pool.stakingAmount * price) / UNIT;
  }

  //计算Pool的加权TVL,
  //每一个用户的锁定周期不同, 会导致stake的token有一定的加权
  async function calculateWeightedPoolTVL(pool) {
    let price = await queryPrice(pool.depositToken);
    return (pool.stakingAmount.add(pool.weightedStakingAmount) * price) / UNIT;
  }

  async function calculatePoolBasicAPY(globalAccount, pool) {
    let rewardTokenPrice = await queryPrice(keplToken);
    let rewardsPerSecond = globalAccount.rewardsPerSecond;

    let poolRewarsPerSecond = (rewardsPerSecond / globalAccount.totalPoolWeight) * pool.poolWeight;
    //计算一年的奖励产出
    let oneYearReward = poolRewarsPerSecond * 3600 * 24 * 365;

    //计算APY需要用加权后的tvl
    let weightedTVL = await calculateWeightedPoolTVL(pool);
    return (oneYearReward * rewardTokenPrice * 100) / weightedTVL / UNIT;
  }

  async function getPoolData(globalAccount, pool) {
    //基础APY
    let basicAPY = await calculatePoolBasicAPY(globalAccount, pool);

    //如果锁定一定周期会加权.
    let apy =
      (1 + pool.weightedStakingAmount / pool.stakingAmount.add(pool.weightedStakingAmount)) *
      basicAPY;

    return {
      token: pool.depositToken,
      tvl: await calculatePoolTVL(pool),
      basicAPY,
      apy,
      weight: pool.poolWeight,
      pendingRewards: pool.totalLockedRewards,
      myLiquidity: pool.stakingAmount,
    };
  }

  async function getPoolsData(globalAccount) {
    let result = {};
    for (let pool of globalAccount.pools) {
      let data = await getPoolData(globalAccount, pool);
      result[data.token] = data;
    }
    return result;
  }

  async function loadWithdrawData() {
    try {
      let globalAccount = await program.account.globalAccount.fetchNullable(
        await getGlobalAccountKey(program.programId)
      );

      let userAccount = await program.account.userAccount.fetchNullable(
        await getUserAccountKey(wallet.publicKey)
      );

      let poolsData = await getPoolsData(globalAccount);

      let withdrawData = await getWithdrawData(globalAccount, poolsData, userAccount);
      console.log("withdrawData:", JSON.stringify(hummanView(withdrawData)));
      setLockedList(withdrawData)
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  useEffect(() => {
    
    async function run() {
      setIsLoading(true)
      try {
        if (farmTabIndex === 0) {
          if (!props.account) {
            setClaimList([])
          } else {
            await loadClaimData()
          }
        } else if (farmTabIndex === 1) {
          if (!props.account) {
            setLockedList([])
          } else {
            await loadWithdrawData()
          }
        }
      } catch(e) {
        console.log(e)
      }
      setIsLoading(false)
    }
    run()
  }, [props.account, farmTabIndex, reload, wallet, program, connection])


  let toApprove = (currencyAddress, contractAddress) => {
    setIsApproving(true)
    approve(currencyAddress, contractAddress).then(res => {
      setNeedApprove(false)
      setIsApproving(false)
    }).catch(err => {
      setIsApproving(false)
    })
  }

  async function getPoolVaultAccount(token) {
    let [vault] = await PublicKey.findProgramAddress([Buffer.from("pool-vault"), token.toBuffer()], program.programId);
    return vault;
  }
  
  async function getPoolAccount(token) {
    let [account] = await PublicKey.findProgramAddress([Buffer.from("pool-account"), token.toBuffer()], program.programId);
    return account;
  }

  function hummanView(v) {
    if (!v) {
        return v;
    }
    if (v instanceof BN || v instanceof PublicKey) {
        return v.toString();
    } else if (v instanceof Array) {
        return v.map((item) => hummanView(item));
    } else if (v instanceof Object) {
        let result = {};
        for (let key of Object.keys(v)) {
            result[key] = hummanView(v[key]);
        }
        return result;
    }
    return v;
  }

  async function loadTokenAccount(publicKey) {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.publicKey, 
      new PublicKey(publicKey),
      wallet.publicKey,
      wallet.signTransaction
    )
    console.log('tokenAccount', tokenAccount)
    return tokenAccount
  }

  function distributeInstruction(user) {
    return program.instruction.distribute({ accounts: { globalAccount, user } });
  }

  let toClaim = async (item) => {
    if(!props.account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description: t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setClaimLoadingMap(claimLoadingMap => {
      return {
        ...claimLoadingMap,
        [`${item.depositId}`]: true
      }
    })

    try {
      let activeToken = null
      if (SolAddress.KEPL.publicKey === item.depositToken.toString()) {
        activeToken = keplToken
      }
      if (SolAddress.KEME.publicKey === item.depositToken.toString()) {
        activeToken = kemeToken
      }
  
      let instruction = await program.instruction.claim(new BN(item.depositId), {
        accounts: {
          globalAccount,
          userAccount: await getUserAccountKey(wallet.publicKey),
          depositToken: activeToken,
          user: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });

      const transaction = new Transaction().add(instruction).add(distributeInstruction(wallet.publicKey))
      const tx = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(tx, 'processed');

      notification.success({
        message: 'Transaction Success',
        description: <a  target="_blank" href={`https://solscan.io/tx/${tx}?cluster=devnet`}>Go to browser to view</a>
      })
      console.log("claim:", tx);
      setReload(reload => reload + 1)
    } catch(e) {
      console.log(e)
    } finally {
      setClaimLoadingMap(claimLoadingMap => {
        return {
          ...claimLoadingMap,
          [`${item.depositId}`]: false
        }
      })
    }
  }

  async function getRewardVaultAccountKey(token) {
    let [vault] = await PublicKey.findProgramAddress(
      [Buffer.from("reward-vault"), token.toBuffer()],
      program.programId
    );
    return vault;
  }

  let toWithdraw = async (item, index) => {
    if(!props.account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description: t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setWithdrawLoadingMap(withdrawLoadingMap => {
      return {
        ...withdrawLoadingMap,
        [`${item.id}`]: true
      }
    })

    try {
      let activeTokenAccount = null
      let activeToken = null
      if (SolAddress.KEPL.publicKey === item.token.toString()) {
        const keplTokenAccount = await loadTokenAccount(SolAddress.KEPL.publicKey)
        activeTokenAccount = keplTokenAccount
        activeToken = keplToken
      }
      if (SolAddress.KEME.publicKey === item.token.toString()) {
        const kemeTokenAccount = await loadTokenAccount(SolAddress.KEME.publicKey)
        activeTokenAccount = kemeTokenAccount
        activeToken = kemeToken
      }
      let rewardVault = await getRewardVaultAccountKey(keplToken);
      let instruction = await program.instruction.withdraw(new BN(item.id), {
        accounts: {
          globalAccount,
          rewardVault,
          userAccount: await getUserAccountKey(wallet.publicKey),
          userRewardTokenAccount: activeTokenAccount.address,
          depositToken: activeToken,
          user: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });

      const transaction = new Transaction().add(instruction).add(distributeInstruction(wallet.publicKey))
      const tx = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(tx, 'processed');

      notification.success({
        message: 'Transaction Success',
        description: <a  target="_blank" href={`https://solscan.io/tx/${tx}?cluster=devnet`}>Go to browser to view</a>
      })
      console.log("withdraw:", tx);
      setReload(reload => reload + 1)
    } catch(e) {
      console.log(e)
    } finally {
      setWithdrawLoadingMap(withdrawLoadingMap => {
        return {
          ...withdrawLoadingMap,
          [`${item.id}`]: false
        }
      })
    }
  }
  
  let showStake = (item) => {
    setBalance(0)
    balanceOf(item.depositToken, props.account).then(balance => {
      setBalance(balance)
    })
    setActivePool(item)
    setShowStakeModal(true)
  }

  let showUnstake = (item) => {
    setActiveStaking(item)
    setShowUnstakeModal(true)
  }

  const claimColumns = [
    {
      title: '',
      key: 'pair',
      render: (text, record) => {
        return (
          <div className="pair-info">
            <img src={tokenLogo1} alt="" className="token-logo1" />
            <div className="pair-name">{
            record.depositToken.toBase58() === SolAddress.pools.deposits.KEPL.depositToken ? 'KEPL'
            : record.depositToken.toBase58() === SolAddress.pools.deposits.KEME.depositToken ? 'KEME'
            : ''}</div>
            <a target="_blank" href={`https://solscan.io/token/${record.depositToken.toBase58()}?cluster=devnet`}><img src={link} alt="" className="link" /></a>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'pendingRewards',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Available Amount')}</div>
            <div className="cell-value">{new BigNumber(record.rewards).toFixed(2, 1)} <img src={tokenLogo0} alt="" className="token-logo" /></div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'op',
      align: 'right',
      render: (text, record) => {
        return (
          <Button className="btn-claim" disabled={+record.rewards === 0} onClick={_ => toClaim(record)} loading={claimLoadingMap[`${record.depositId}`]}>{t('Claim')}</Button>
        )
      },
    },
  ]

  const lockedColumns = [
    {
      title: '',
      key: 'pair',
      render: (text, record) => {
        return (
          <div className="pair-info">
            <img src={tokenLogo1} alt="" className="token-logo1" />
            <div className="pair-name">{
            record.token.toBase58() === SolAddress.pools.deposits.KEPL.depositToken ? 'KEPL'
            : record.token.toBase58() === SolAddress.pools.deposits.KEME.depositToken ? 'KEME'
            : ''}</div>
            <a target="_blank" href={`https://solscan.io/token/${record.token.toBase58()}?cluster=devnet`}><img src={link} alt="" className="link" /></a>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'rewardsClaimed',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Rewards Claimed')}</div>
            <div className="cell-value">{new BigNumber(record.claimedReward).dividedBy(10 ** 9).toFixed(2, 1)}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'pendingRewards',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Pending Rewards')}</div>
            <div className="cell-value">{new BigNumber(record.pendingReward).dividedBy(10 ** 9).toFixed(2, 1)}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'apy',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">APY</div>
            <div className="cell-value highlight">{new BigNumber(record.apy).toFixed(2, 1)}%</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'nextUnlockTime',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Next Unlock Time')}</div>
            <div className="cell-value">{record.remainingWithdrawTime === -1 ? '--' : format(new Date(Date.now()+record.remainingWithdrawTime*1000), 'yyyy-MM-dd HH:mm:ss')}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'withdrawableAmount',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Rewards Available')}</div>
            <div className="cell-value">{new BigNumber(record.availableRewards).toFixed(2, 1)}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'op',
      align: 'right',
      render: (text, record, index) => {
        if (record.remainingWithdrawTime != -1) {
          return <Button className="btn-locked" disabled>{t('Locked')}</Button>
        } else {
          return <Button className="btn-withdraw" onClick={_ => toWithdraw(record)} loading={withdrawLoadingMap[`${record.id}`]}>{t('Withdraw')}</Button>
        }
      },
    },
  ]

  return (
    <div className="farm-rewards fw500">
      <div className="farm-banner">
        {/* <img src={banner} alt="" className="banner-image" /> */}
        <div className="banner-content">
          <div className="banner-title">{t('KEPL claimed rewards are subject to a 12 month Locked period and 1/12 of the total locked amount will be unlocked every month.')}</div>
          <div className="banner-subtitle">{t('While they are locked they compound your rewards.')}</div>
        </div>
      </div>

      <div className="farm-content">
        <div className="farm-header">
          <div className="tab-list">
            <div className={classNames(["tab-item", {"active": farmTabIndex === 0}])} onClick={_ => nav('/farm/claim')}>{t('Claim')}</div>
            <div className={classNames(["tab-item", {"active": farmTabIndex === 1}])} onClick={_ => nav('/farm/withdraw')}>{t('Withdraw')}</div>
          </div>
          <div className="filter-group">
            {/* <Search />
            <Select /> */}
          </div>
        </div>
        {
          isLoading ?
            (
              <div className="w100 flex flex-center flex-middle p-100">
                <Spin size="large"></Spin>
              </div>
            ) 
          :
            farmTabIndex === 0 ?
              <div className="farm-list">
                {
                  claimList.length ?
                    window.innerWidth >= 768 ?
                      <Table columns={claimColumns} dataSource={claimList} showHeader={false} pagination={{pageSize: 20}} rowKey={(record) => record.depositId}/>
                    :
                    claimList.map((record, index) => {
                      return (
                        <div className="farm-item" key={record.depositId}>
                          <div className="farm-item-header">
                            <div className="pair-info">
                              <img src={tokenLogo1} alt="" className="token-logo1" />
                              <div className="pair-name">{
                              record.depositToken.toBase58() === SolAddress.pools.deposits.KEPL.depositToken ? 'KEPL'
                              : record.depositToken.toBase58() === SolAddress.pools.deposits.KEME.depositToken ? 'KEME'
                              : ''}</div>
                              <a target="_blank" href={`https://solscan.io/token/${record.depositToken.toBase58()}?cluster=devnet`}><img src={link} alt="" className="link" /></a>
                            </div>

                            <Button className="btn-claim" disabled={+record.rewards === 0} onClick={_ => toClaim(record)} loading={claimLoadingMap[`${record.depositId}`]}>{t('Claim')}</Button>
                          </div>
                          <div className="farm-item-body">
                            <div className="cell-item">
                              <div className="cell-title">{t('Available Amount')}</div>
                              <div className="cell-value">{new BigNumber(record.rewards).dividedBy(10 ** 9).toFixed(2, 1)} <img src={tokenLogo0} alt="" className="token-logo" /></div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  :
                  <Empty />
                }
              </div>
            :
              <div className="farm-list">
                {
                  lockedList.length ?
                    window.innerWidth >= 768 ?
                      <Table columns={lockedColumns} dataSource={lockedList} showHeader={false} pagination={{pageSize: 20}} rowKey={(record) => record.id}/>
                    :
                    lockedList.map((record, index) => {
                      console.log(record)
                      return (
                        <div className="farm-item" key={record.id}>
                          <div className="farm-item-header">
                            <div className="pair-info">
                              <img src={tokenLogo1} alt="" className="token-logo1" />
                              <div className="pair-name">{
                              record.token.toBase58() === SolAddress.pools.deposits.KEPL.depositToken ? 'KEPL'
                              : record.token.toBase58() === SolAddress.pools.deposits.KEME.depositToken ? 'KEME'
                              : ''}</div>
                              <a target="_blank" href={`https://solscan.io/token/${record.token.toBase58()}?cluster=devnet`}><img src={link} alt="" className="link" /></a>
                            </div>

                            {(() => {
                              if (record.remainingWithdrawTime != -1) {
                                return <Button className="btn-locked" disabled>{t('Locked')}</Button>
                              } else {
                                return <Button className="btn-withdraw" onClick={_ => toWithdraw(record)} loading={withdrawLoadingMap[`${record.id}`]}>{t('Withdraw')}</Button>
                              }
                            })()}
                          </div>
                          <div className="farm-item-body">
                            <div className="cell-item">
                              <div className="cell-title">{t('Rewards Claimed')}</div>
                              <div className="cell-value">{new BigNumber(record.claimedReward).dividedBy(10 ** 9).toFixed(2, 1)}</div>
                            </div>
                            <div className="cell-item">
                              <div className="cell-title">{t('Pending Rewards')}</div>
                              <div className="cell-value">{new BigNumber(record.pendingReward).dividedBy(10 ** 9).toFixed(2, 1)}</div>
                            </div>
                            <div className="cell-item">
                              <div className="cell-title">APY</div>
                              <div className="cell-value highlight">{new BigNumber(record.apy).toFixed(2, 1)}%</div>
                            </div>
                            <div className="cell-item">
                              <div className="cell-title">{t('Next Unlock Time')}</div>
                              <div className="cell-value">{record.remainingWithdrawTime === -1 ? '--' : format(new Date(Date.now()+record.remainingWithdrawTime*1000), 'yyyy-MM-dd HH:mm:ss')}</div>
                            </div>
                            <div className="cell-item">
                              <div className="cell-title">{t('Rewards Available')}</div>
                              <div className="cell-value">{new BigNumber(record.availableRewards).toFixed(2, 1)}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  :
                  <Empty />
                }
              </div>
        }
      </div>

    </div>
  )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Rewards
);
