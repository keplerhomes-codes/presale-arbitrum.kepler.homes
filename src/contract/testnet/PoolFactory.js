export default [
  {
    "inputs": [],
    "name": "getDashboardView",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "totalPendingRewards",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalPendingRewardsValue",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "keplBalance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "keplBalanceValue",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalStakedValue",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalDistributed",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalDistributedValue",
            "type": "uint256"
          }
        ],
        "internalType": "struct IPoolFactory.DashboardView",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "getDepositPoolViews",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "depositToken",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tvl",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "apy",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pendingRewards",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "myDepoistAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxLockUnits",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lockUnitDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lockUnitMultiplier",
            "type": "uint256"
          }
        ],
        "internalType": "struct IPoolFactory.DepoistPoolView[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "getLockedRewardView",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "lockedRewardId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "depositPool",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "depositToken",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "lockedAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pendingRewards",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "apy",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nextUnlockTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "withdrawableAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IPoolFactory.LockedRewardView[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "getMyDepositView",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "depositPool",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "depositId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "depositToken",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "apy",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lockUnits",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakingAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pendingRewards",
            "type": "uint256"
          }
        ],
        "internalType": "struct IPoolFactory.MyDepositView[]",
        "name": "views",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      }
    ],
    "name": "getRewardsPerBlock",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]