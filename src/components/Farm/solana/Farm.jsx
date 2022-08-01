import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../Farm.scss'
import banner from '../../../assets/images/farm/farm-banner.png'
import Search from "../../../components/Base/Search"
import Select from "../../../components/Base/Select"
import tokenLogo0 from '../../../assets/images/farm/token0.png'
import tokenLogo1 from '../../../assets/images/farm/token1.png'
import busdLogo from '../../../assets/images/farm/BUSD.svg'
import link from '../../../assets/images/farm/link.png'
import Modal from '../../../components/Base/Modal'
import { Input, Button, Slider, Spin, Table } from 'antd';
import { getDepositPoolViews, getTokenSymbol, allowance, approve, stake, unstake, balanceOf, getMyDepositView } from '../../../contract/methods'
import {connect} from 'react-redux'
import accounting from 'accounting'
import BigNumber from "bignumber.js";
import notification from '../../../components/notification';
import classNames from 'classnames';
import { MaxUint256 } from '@ethersproject/constants'
import { showConnectWallet } from '../../../lib/util'
import Empty from '../Empty'
import { chainSymbolMap } from '../../../wallet/helper/getNetworkData'
import idl from '../../../contract/testnet/SolPoolsIDL'
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, Provider, web3, BN } from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import SolAddress from '../../../contract/testnet/SolAddress'
import { TOKEN_PROGRAM_ID, getAccount } from "@solana/spl-token";
import { useTranslation } from 'react-i18next'
import { getOrCreateAssociatedTokenAccount } from '../../../lib/solana/getOrCreateAssociatedTokenAccount'
import { useLocation, useNavigate } from "react-router-dom"

const programID = new PublicKey(SolAddress.pools.programId);
const UNIT = 1e9;

let selectOptions = [
  {
    label: 'APY high-low',
    value: 0
  },
  {
    label: 'TVL high-low',
    value: 1
  },
  {
    label: 'Weight high-low',
    value: 2
  },
]

function Farm (props) {
  const {t, i18n} = useTranslation()
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showUnstakeModal, setShowUnstakeModal] = useState(false)
  const [poolList, setPoolList] = useState([])
  const [originPoolList, setOriginPoolList] = useState([])
  const [stakingList, setStakingList] = useState([])
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
  const [weight, setWeight] = useState(1+1/52)
  const [lockUnits, setLockUnits] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [stakeLoadingMap, setStakeLoadingMap] = useState({})
  const [unstakeLoadingMap, setUnstakeLoadingMap] = useState({})
  const [approvingMap, setApprovingMap] = useState({})
  const [reload, setReload] = useState(0)
  const [sort, setSort] = useState(0)
  const [search, setSearch] = useState('')
  const [blockExplorerUrl, setBlockExplorerUrl] = useState('')
  // solana
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
  const [farmTabIndex, setFarmTabIndex] = useState(location.pathname === '/farm/pools' ? 0 : 1)

  useEffect(() => {
    if (location.pathname === '/farm/pools') {
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

  async function getPoolsData(globalAccount, userAccount) {
    let result = {};
    for (let pool of globalAccount.pools) {
      let data = await getPoolData(globalAccount, pool, userAccount ? userAccount.deposits.filter(deposit => deposit.depositToken.toString() === pool.depositToken.toString()) : []);
      result[data.token] = data;
    }
    return result;
  }

  async function queryPrice(token) {
    //模拟数据, 因为当前无法得到token数据
    return UNIT;
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

  async function getPoolData(globalAccount, pool, deposits) {
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
        myLiquidity: deposits.reduce((pre, cur) => pre.plus(cur.amount), new BigNumber(0)),
        stakingAmount: pool.stakingAmount,
        weightedStakingAmount: pool.weightedStakingAmount,
    };
  }

  function estApy() {
    if (!activePool) {
      return '--'
    }
    console.log(activePool)
    let apy =
      (1 + activePool.weightedStakingAmount.add(new BN((amount ?? 0) * UNIT * (stakeType === 0 ? 1 : weight))) / activePool.stakingAmount.add(activePool.weightedStakingAmount).add(new BN((amount ?? 0) * UNIT * (stakeType === 0 ? 1 : weight)))) *
        activePool.basicAPY;
    return apy.toFixed(2,1)
  }

  async function loadPoolsData() {
    console.log(1)
    try {
      let globalAccount = await program.account.globalAccount.fetchNullable(
        await getGlobalAccountKey(program.programId)
      );

      console.log(globalAccount)

      let userAccount = await program.account.userAccount.fetchNullable(
        await getUserAccountKey(wallet.publicKey)
      );

      let poolsData = await getPoolsData(globalAccount, userAccount);
      console.log("poolsData:", JSON.stringify(hummanView(poolsData)));

      setOriginPoolList(Object.keys(poolsData).map(key => {
        return {
          ...poolsData[key]
        }
      }))
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function loadMyStakingData() {
    try {
      let globalAccount = await program.account.globalAccount.fetchNullable(
        await getGlobalAccountKey(program.programId)
      );

      let userAccount = await program.account.userAccount.fetchNullable(
        await getUserAccountKey(wallet.publicKey)
      );

      let poolsData = await getPoolsData(globalAccount, userAccount);

      let myStakingData = await getMyStakingData(globalAccount, userAccount, poolsData);
      console.log("myStakingData:", JSON.stringify(hummanView(myStakingData)));
      setStakingList(myStakingData)
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function getMyStakingData(globalAccount, userAccount, poolsData) {
    function getData(deposit) {
      let { id, depositToken, amount, weightedAmount, depositTime, lockUnits } = deposit;
      let poolData = poolsData[depositToken.toString()];
      let basicAPY = poolData.basicAPY;
      let now = new Date().valueOf() / 1000;
      let unlockTime =
        parseInt(depositTime.toString()) + globalAccount.lockUnitDuration * lockUnits;
      return {
        id,
        token: depositToken,
        basicAPY,
        amount: amount,
        weightedAmount: weightedAmount,
        apy: basicAPY + basicAPY * (weightedAmount / weightedAmount.add(amount)),
        unlockTime,
        //如果unlockIn小于等于0, 表明可以解锁
        unlockIn: unlockTime - now,
        myLiquidiy: amount,
      };
    }

    return userAccount.deposits.map((item) => getData(item));
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

  async function initializeUserAccount(token) {
    let userAccount = await getUserAccount()
    let info = await program.account.userAccount.fetchNullable(userAccount);

    if (info == null) {
      let options = {
        //instruction
        accounts: {
          userAccount,
          user: wallet.publicKey,
          token: token.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      }
      //调用
      let tx = await program.rpc.initializeUserAccount(options);
      await connection.confirmTransaction(tx);
      console.log(`initializeUserAccount(${wallet.publicKey.toBase58()},${token.toBase58()})`, tx)
    } else {
      console.log(info)
    }
  }

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

  function secTime(sec) {
    if (sec < 0) {
      return '0'
    } else {
      const days = parseInt(sec / (24 * 3600))
      const hours = parseInt(sec % (24 * 3600) / 3600)
      const minutes = parseInt(sec % 3600 / 60)
      const seconds = parseInt(sec % 60)
      return `${days > 0 ? `${days} days` : ''} ${hours > 0 ? `${hours} hours` : ''} ${minutes > 0 ? `${minutes} minutes` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}`
    }
  }

  useEffect(() => {
    if (!program) {
      setIsLoading(false)
      return
    }
    async function run() {
      setIsLoading(true)

      try {
        if (farmTabIndex === 0) {
          if (props.account) {
            await loadPoolsData()
          } else {
            setOriginPoolList([])
          }
        } else if (farmTabIndex === 1) {
          if (props.account) {
            await loadMyStakingData()
          } else {
            setStakingList([])
          }
        }
      } catch(e) {
        console.log(e)
      }
      setIsLoading(false)
    }
    run()
  }, [props.account, farmTabIndex, reload, wallet, program, connection])


  useEffect(() => {
    if (!props.chain || props.chain !== 'Solana' || !wallet.connected) {
      return
    }
    const provider = getProvider()
    const program = new Program(idl, programID, provider);
    setProgram(program)
  }, [props.chain, wallet.connected])

  useEffect(() => {
    let pools = originPoolList.concat()
    if (sort === 0) {
      pools.sort((a, b) => {
        return new BigNumber(b.apy).gt(a.apy) ? 1 : -1
      })
    }
    if (sort === 1) {
      pools.sort((a, b) => {
        return new BigNumber(b.tvl).gt(a.tvl) ? 1 : -1
      })
    }
    if (sort === 2) {
      pools.sort((a, b) => {
        return new BigNumber(b.weight).gt(a.weight) ? 1 : -1
      })
    }
    
    pools = pools.filter(pool => {
      let tokenName = pool.token.toBase58() === SolAddress.pools.deposits.KEPL.depositToken ? 'KEPL'
      : pool.token.toBase58() === SolAddress.pools.deposits.KEME.depositToken ? 'KEME' : ''
      if (tokenName.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        return true
      }
      return false
    })
    setPoolList(pools)
  }, [sort, search, symbolMap, originPoolList])

  async function getPoolVaultAccount(token) {
    let [vault] = await PublicKey.findProgramAddress([Buffer.from("pool-vault"), token.toBuffer()], program.programId);
    return vault;
  }
  
  async function getPoolAccount(token) {
    let [account] = await PublicKey.findProgramAddress([Buffer.from("pool-account"), token.toBuffer()], program.programId);
    return account;
  }

  function distributeInstruction(user) {
    return program.instruction.distribute({ accounts: { globalAccount, user } });
  }

  let toStake = async () => {
    if(!props.account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description: t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setIsStaking(true)

    try {
      let poolVault = await getPoolVaultAccount(activeToken)
      let userAccount = await getUserAccount()
      let args = { amount: new BN(amount).mul(new BN(10 ** 9)), lockUnits: new BN(stakeType === 0 ? 0 : lockUnits) };
      let instruction = program.instruction.stake(...Object.values(args), {
        accounts: {
            globalAccount,
            poolVault,
            userAccount,
            userTokenAccount: activeTokenAccount.address,
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

      console.log("stake:", tx);
      setShowStakeModal(false)
      setReload(reload => reload + 1)
    } catch(e) {
      console.log(e)
    } finally {
      setIsStaking(false)
    }
  }

  let toUnstake = async (item) => {
    if(!props.account) {
      notification.success({
        message: t('Please connect your wallet first'),
        description: t('Click the button in the upper right corner to connect wallet')
      })
      return
    }
    setUnstakeLoadingMap(unstakeLoadingMap => {
      return {
        ...unstakeLoadingMap,
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
  
      let userAccount = await getUserAccount()
      let poolVault = await getPoolVaultAccount(activeToken)

      let instruction = await program.instruction.unstake(new BN(item.id), {
        accounts: {
          globalAccount,
          poolVault,
          userAccount,
          user: wallet.publicKey,
          userTokenAccount: activeTokenAccount.address,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });

      const transaction = new Transaction().add(instruction).add(distributeInstruction(wallet.publicKey))
      const tx = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(tx, 'processed');
      console.log("unstake: ", tx);

      notification.success({
        message: 'Transaction Success',
        description: <a  target="_blank" href={`https://solscan.io/tx/${tx}?cluster=devnet`}>Go to browser to view</a>
      })
      setReload(reload => reload + 1)
    } catch(e) {
      console.log(e)
    } finally {
      setUnstakeLoadingMap(unstakeLoadingMap => {
        return {
          ...unstakeLoadingMap,
          [`${item.id}`]: false
        }
      })
    }
  }

  let showStake = async (item) => {
    setBalance(0)
    setStakeLoadingMap(stakeLoadingMap => {
      return {
        ...stakeLoadingMap,
        [`${item.token}`]: true
      }
    })

    if (SolAddress.KEPL.publicKey === item.token.toString()) {
      try {
        const keplTokenAccount = await loadTokenAccount(SolAddress.KEPL.publicKey)
        setActiveTokenAccount(keplTokenAccount)
        setActiveToken(keplToken)
        await initializeUserAccount(keplToken)
        const accountInfo = await getAccount(connection, keplTokenAccount.address);
        console.log(accountInfo.amount)
        setActivePool(item)
        setBalance(accountInfo.amount)
        setShowStakeModal(true)
      } catch(e) {
        console.log(e)
      } finally {
        setStakeLoadingMap(stakeLoadingMap => {
          return {
            ...stakeLoadingMap,
            [`${item.token}`]: false
          }
        })
      }
    }

    if (SolAddress.KEME.publicKey === item.token.toString()) {
      try {
        const kemeTokenAccount = await loadTokenAccount(SolAddress.KEME.publicKey)
        setActiveTokenAccount(kemeTokenAccount)
        setActiveToken(kemeToken)
        await initializeUserAccount(kemeToken)
        const accountInfo = await getAccount(connection, kemeTokenAccount.address);
        console.log(accountInfo.amount)
        setActivePool(item)
        setBalance(accountInfo.amount)
        setShowStakeModal(true)
      } catch(e) {
        console.log(e)
      } finally {
        setStakeLoadingMap(stakeLoadingMap => {
          return {
            ...stakeLoadingMap,
            [`${item.token}`]: false
          }
        })
      }
    }
  }

  let showUnstake = (item) => {
    setActiveStaking(item)
    setShowUnstakeModal(true)
  }

  const handleSetAmount = (value) => {
    if (value === '') {
      setAmount(value)
      return
    }
    if (!(/^\d+((\.\d+)?|(\.))$/.test(value))) {
      return
    }
    if (value.split('.').length > 1 && value.split('.')[1].length > 3) {
      return
    }
    if (value < 0) {
      return
    }

    setAmount(value)
  }

  const poolColumns = [
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
      key: 'tvl',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">TVL</div>
            <div className="cell-value highlight">{accounting.formatMoney(new BigNumber(record.tvl).dividedBy(10 ** 9).toFixed(2, 1))}</div>
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
      key: 'weight',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Weight')}</div>
            <div className="cell-value">{new BigNumber(record.weight).toFixed(2, 1)}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'rewards',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Rewards')}</div>
            <div className="cell-value">{new BigNumber(record.pendingRewards).dividedBy(10 ** 9).toFixed(2, 1)} <img src={tokenLogo0} alt="" className="token-logo" /></div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'liquidity',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('My Liquidity')}</div>
            <div className="cell-value">{new BigNumber(record.myLiquidity).dividedBy(10 ** 9).toFixed(2, 1)} <img src={busdLogo} alt="" className="token-logo" /></div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'op',
      align: 'right',
      render: (text, record) => {
        return <Button className="btn-stake" onClick={_ => showStake(record)} loading={stakeLoadingMap[`${record.token}`]}>{t('Stake')}</Button>
      },
    },
  ]

  const stakingColumns = [
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
      key: 'unlocks',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('Unlocks in')}</div>
            <div className="cell-value">{record.unlockIn <= 0 ? 'UNLOCKED' : `${secTime(record.unlockIn)}`}</div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'liquidity',
      render: (text, record) => {
        return (
          <div className="cell-item">
            <div className="cell-title">{t('My Liquidity')}</div>
            <div className="cell-value">{new BigNumber(record.myLiquidiy).dividedBy(10 ** 9).toFixed(2, 1)} <img src={busdLogo} alt="" className="token-logo" /></div>
          </div>
        )
      },
    },
    {
      title: '',
      key: 'op',
      align: 'right',
      render: (text, record) => {
        if (!props.connect) {
          return <Button className="btn-connect" onClick={_ => showConnectWallet()}>{t('Connect Wallet')}</Button>
        }

        if (record.unlockIn <= 0) {
          return <Button className="btn-unstake" onClick={_ => toUnstake(record)} loading={unstakeLoadingMap[`${record.id}`]}>{t('Unstake')}</Button>
        } else {
          return <Button className="btn-locked" disabled>{t('Locked')}</Button>
        }
      },
    },
  ]

  return (
    <div className="farm-farm fw500">
      <div className="farm-banner">
        {/* <img src={banner} alt="" className="banner-image" /> */}
        <div className="banner-content">
          <div className="banner-title">{t('You can')} <a>{t('stake in different pools')}</a> {t('and unstake from your staking')}</div>
          <div className="banner-subtitle">{t('All pools offer variable locking for 12 months')}</div>
        </div>
      </div>

      <div className="farm-content">
        <div className="farm-header">
          <div className="tab-list">
            <div className={classNames(["tab-item", {"active": farmTabIndex === 0}])} onClick={_ => nav('/farm/pools')}>{t('Pools')}</div>
            <div className={classNames(["tab-item", {"active": farmTabIndex === 1}])} onClick={_ => nav('/farm/mystaking')}>{t('My Staking')}</div>
          </div>
          {
            farmTabIndex === 0 ?
            <div className="filter-group ">
              <Search onChange={e => setSearch(e.target.value)}/>
              {/* <Select /> */}
              <Select onChange={value => setSort(value)} options={selectOptions}/>
            </div>
            : ''
          }
        </div>

        {
          farmTabIndex === 0 ?
          <div className="filter-group filter-group-mobile">
            <Search onChange={e => setSearch(e.target.value)}/>
            {/* <Select /> */}
            <Select onChange={value => setSort(value)} options={selectOptions} width="100%" />
          </div>
          : ''
        }
        
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
                  poolList.length ?
                    window.innerWidth >= 768 ?
                    <Table columns={poolColumns} dataSource={poolList} showHeader={false} pagination={false} rowKey={(record) => record.token.toString()}/>
                    :
                    poolList.map(record => {
                      return (
                        <div className="farm-item" key={record.token.toString()}>
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
                              return <Button className="btn-stake" onClick={_ => showStake(record)} loading={stakeLoadingMap[`${record.token}`]}>{t('Stake')}</Button>
                            })()}
                          </div>
                          <div className="farm-item-body">
                            <div className="cell-item">
                              <div className="cell-title">TVL</div>
                              <div className="cell-value highlight">{accounting.formatMoney(new BigNumber(record.tvl).dividedBy(10 ** 9).toFixed(2, 1))}</div>
                            </div>

                            <div className="cell-item">
                              <div className="cell-title">APY</div>
                              <div className="cell-value highlight">{new BigNumber(record.apy).toFixed(2, 1)}%</div>
                            </div>

                            <div className="cell-item">
                              <div className="cell-title">{t('Weight')}</div>
                              <div className="cell-value">{new BigNumber(record.weight).toFixed(2, 1)}</div>
                            </div>

                            <div className="cell-item">
                              <div className="cell-title">{t('Rewards')}</div>
                              <div className="cell-value">{new BigNumber(record.pendingRewards).dividedBy(10 ** 9).toFixed(2, 1)} <img src={tokenLogo0} alt="" className="token-logo" /></div>
                            </div>

                            <div className="cell-item">
                              <div className="cell-title">{t('My Liquidity')}</div>
                              <div className="cell-value">{new BigNumber(record.myLiquidity).dividedBy(10 ** 9).toFixed(2, 1)} <img src={busdLogo} alt="" className="token-logo" /></div>
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
                  stakingList.length ?
                    window.innerWidth >= 768 ?
                      <Table columns={stakingColumns} dataSource={stakingList} showHeader={false} pagination={{pageSize: 20}} rowKey={(record) => record.id}/>
                      :
                      stakingList.map(record => {
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
                                if (!props.connect) {
                                  return <Button className="btn-connect" onClick={_ => showConnectWallet()}>{t('Connect Wallet')}</Button>
                                }

                                if (record.unlockIn <= 0) {
                                  return <Button className="btn-unstake" onClick={_ => toUnstake(record)} loading={unstakeLoadingMap[`${record.id}`]}>{t('Unstake')}</Button>
                                } else {
                                  return <Button className="btn-locked" disabled>{t('Locked')}</Button>
                                }
                              })()}
                            </div>
                            <div className="farm-item-body">
                              <div className="cell-item">
                                <div className="cell-title">APY</div>
                                <div className="cell-value highlight">{new BigNumber(record.apy).toFixed(2, 1)}%</div>
                              </div>

                              <div className="cell-item">
                                <div className="cell-title">{t('Unlocks in')}</div>
                                <div className="cell-value">{record.unlockIn <= 0 ? 'UNLOCKED' : `${secTime(record.unlockIn)}`}</div>
                              </div>

                              <div className="cell-item">
                                <div className="cell-title">{t('My Liquidity')}</div>
                                <div className="cell-value">{new BigNumber(record.myLiquidiy).dividedBy(10 ** 9).toFixed(2, 1)} <img src={busdLogo} alt="" className="token-logo" /></div>
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

      <Modal width={window.innerWidth >= 768 ? 420 : 315} className="stake-modal" isVisible={showStakeModal} title={
        <div className="modal-title">
          <img src={tokenLogo0} alt="" className="token-logo" />
          {
            activePool ?
              symbolMap[activePool.depositToken] === 'KEPL-BUSD' ?
              <img src={busdLogo} alt="" className="token-logo2" />
              : ''
            : ''
          }
          <span className="token-name">
            {activePool ? symbolMap[activePool.depositToken] : ''}
          </span>
        </div>
      } onClose={() => setShowStakeModal(false)}>
        <div className="tab-list">
          <div className={classNames(["tab-item", {"active": stakeType === 0}])} onClick={_ => setStakeType(0)}>{t('Flexible')}</div>
          <div className={classNames(["tab-item", {"active": stakeType === 1}])} onClick={_ => setStakeType(1)}>{t('Locked')}</div>
        </div>
        {
          stakeType === 1 ?
          <div className="lock-units-slider">
            <div className="slider-label-wrapper">
              <div className="label">{t('Lock for')}: <span className="fw500 lock-units">{lockUnits} {t('WEEKS')}</span></div>
              <div className="m-l-auto flex"><div className="label">{t('Weight')}:</div><div className="fw500 value">{weight.toFixed(2)}</div></div>
            </div>
            <Slider max={52} min={1} value={lockUnits} onChange={(e) => {
              setLockUnits(e)
              setWeight(1+e/52)
            }} />
            <div className="range">
              <div className="min">1</div>
              <div className="max">52</div>
            </div>
          </div>
          : ''
        }
        <div className="label-wrapper">
          <div className="label">{t('Amount')}</div>
          <div className="m-l-auto flex"><div className="label">{t('Balance')}:</div><div className="fw500 value">{new BigNumber(balance).dividedBy(10 ** 9).toFixed(2, 1)}</div></div>
        </div>
        <Input type="text" placeholder="" className='my-input fz-16 m-t-10' suffix={
          <Button className="fw500 btn-max" onClick={_ => setAmount(new BigNumber(balance).dividedBy(10 ** 9).toFixed(2, 1))}>{t('Max')}</Button>
        } value={amount} onChange={(e) => handleSetAmount(e.target.value)} />
        {
          new BigNumber(amount).gt(new BigNumber(balance).dividedBy(10 ** 9)) ? (
              <div className="warning flex flex-center c14 p-t-10">
                <img src={require('../../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                  {t('Incorrect amount')}
              </div>
          ):''
        }
        <div className="fw500 m-t-20 apy-block">
          {t('Est APY')}: {estApy()}%
        </div>
        {
          stakeType === 1 ?
          <div className="warning flex flex-center c14 m-t-20 m-b-30">
            <img src={require('../../../assets/images/tips/tip.svg').default} alt="" className='m-r-10'/>
            {t('Locking your stake increases your pool weight by up to 2x')}
          </div>
          : ''
        }
        <Button loading={isStaking} className="m-t-30 fwb btn-stake" onClick={_ => toStake()} disabled={!+amount || new BigNumber(amount).gt(new BigNumber(balance).dividedBy(10 ** 9))}>{t('Stake')}</Button>
      </Modal>

      <Modal width={window.innerWidth >= 768 ? 420 : 315} className="unstake-modal" isVisible={showUnstakeModal} title={<div className="modal-title"><img src={tokenLogo0} alt="" className="token-logo" />KEPL</div>} onClose={() => setShowUnstakeModal(false)}>
        <div className='modal-content'>
          {/* <div className="fz-14 flex">
            <div className="label">Amount</div>
            <div className="m-l-auto flex"><div className="label">Unlocked:</div><div className="fw500 value">{new BigNumber(activeStaking?.stakingAmount).dividedBy(10 ** 18).toFixed(2, 1)}</div></div>
          </div>
          <Input placeholder="" className='my-input fz-16 m-t-10' suffix={
            <Button className="fw500 btn-max" onClick={_ => setUnstakeAmount(new BigNumber(activeStaking?.stakingAmount).dividedBy(10 ** 18).toFixed(2, 1))}>Max</Button>
          } value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} /> */}
          {/* {
            !isEmail ? (
                <div className="warning flex flex-center c14 p-t-10">
                    <img src={require('../../assets/images/tips/warning.svg').default} alt="" className='m-r-5'/>
                    Incorrect email
                </div>
            ):''
          } */}
          <Button loading={isUnstaking} className="fwb btn-next" onClick={_ => toUnstake()}>{t('Unstake')}</Button>
        </div>
      </Modal>
    </div>
  )
}

export default connect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Farm
);
