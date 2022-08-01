export default {
  "version": "0.1.0",
  "name": "pools",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rewardToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lockUnitDuration",
          "type": "u64"
        },
        {
          "name": "lockUnitMultiplierMul",
          "type": "u64"
        },
        {
          "name": "maxLockUnits",
          "type": "u64"
        },
        {
          "name": "rewardsPerSecond",
          "type": "u64"
        },
        {
          "name": "lockedRewardWithdrawInterval",
          "type": "u32"
        },
        {
          "name": "lockedRewardMultiplierMul",
          "type": "u64"
        },
        {
          "name": "lockedRewardWithdrawCount",
          "type": "u8"
        }
      ]
    },
    {
      "name": "registerPool",
      "accounts": [
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "depositToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "weight",
          "type": "u64"
        },
        {
          "name": "isRewardPool",
          "type": "bool"
        }
      ]
    },
    {
      "name": "initializeUserAccount",
      "accounts": [
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "lockUnits",
          "type": "u8"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "claimId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "distribute",
      "accounts": [
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "GlobalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardToken",
            "type": "publicKey"
          },
          {
            "name": "rewardsPerSecond",
            "type": "u64"
          },
          {
            "name": "lockedRewardWithdrawInterval",
            "type": "u32"
          },
          {
            "name": "lockedRewardMultiplierMul",
            "type": "u64"
          },
          {
            "name": "lockedRewardWithdrawCount",
            "type": "u8"
          },
          {
            "name": "totalPoolWeight",
            "type": "u64"
          },
          {
            "name": "lockUnitDuration",
            "type": "u64"
          },
          {
            "name": "lockUnitMultiplierMul",
            "type": "u64"
          },
          {
            "name": "maxLockUnits",
            "type": "u64"
          },
          {
            "name": "totalDistributedRewards",
            "type": "u64"
          },
          {
            "name": "pools",
            "type": {
              "vec": {
                "defined": "Pool"
              }
            }
          }
        ]
      }
    },
    {
      "name": "UserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "nextDepositId",
            "type": "u16"
          },
          {
            "name": "nextClaimId",
            "type": "u16"
          },
          {
            "name": "deposits",
            "type": {
              "vec": {
                "defined": "Deposit"
              }
            }
          },
          {
            "name": "claims",
            "type": {
              "vec": {
                "defined": "Claim"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isRewardPool",
            "type": "bool"
          },
          {
            "name": "poolWeight",
            "type": "u64"
          },
          {
            "name": "depositToken",
            "type": "publicKey"
          },
          {
            "name": "stakingAmount",
            "type": "u64"
          },
          {
            "name": "weightedStakingAmount",
            "type": "u64"
          },
          {
            "name": "rewardIndexMul",
            "type": "u64"
          },
          {
            "name": "distributedRewards",
            "type": "u64"
          },
          {
            "name": "totalLockedRewards",
            "type": "u64"
          },
          {
            "name": "lastDistributeTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "Deposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u16"
          },
          {
            "name": "depositToken",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "rewardIndexMul",
            "type": "u64"
          },
          {
            "name": "weightedAmount",
            "type": "u64"
          },
          {
            "name": "depositTime",
            "type": "i64"
          },
          {
            "name": "lockUnits",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Claim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u16"
          },
          {
            "name": "depositToken",
            "type": "publicKey"
          },
          {
            "name": "depositId",
            "type": "u16"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "remaingAmount",
            "type": "u64"
          },
          {
            "name": "rewardIndexMul",
            "type": "u64"
          },
          {
            "name": "lockTime",
            "type": "i64"
          },
          {
            "name": "lastWithdrawTime",
            "type": "i64"
          },
          {
            "name": "withdrawnCount",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6100,
      "name": "InvalidDepositId",
      "msg": "ERROR_INVALID_DEPOSIT_ID"
    },
    {
      "code": 6101,
      "name": "DepositPoolNotFound",
      "msg": "ERROR_DEPOSIT_POOL_NOT_FOUND"
    },
    {
      "code": 6102,
      "name": "RewardPoolNotFound",
      "msg": "ERROR_REWARD_POOL_NOT_FOUNDE"
    },
    {
      "code": 6103,
      "name": "InvalidStakingAmount",
      "msg": "ERROR_INVALID_STAKING_AMOUNT"
    },
    {
      "code": 6104,
      "name": "PoolNotFound",
      "msg": "ERROR_POOL_NOT_FOUND"
    },
    {
      "code": 6105,
      "name": "InvalidLockUnit",
      "msg": "ERROR_INVALID_LOCK_UNIT"
    },
    {
      "code": 6106,
      "name": "InvalidDepositToken",
      "msg": "ERROR_INVALID_DEPOSIT_TOKEN"
    },
    {
      "code": 6107,
      "name": "PoolAlreadyExists",
      "msg": "ERROR_POOL_ALREADY_EXISTS"
    },
    {
      "code": 6108,
      "name": "ZeroClaimAmount",
      "msg": "ERROR_ZERO_CLAIM_AMOUNT"
    },
    {
      "code": 6109,
      "name": "TotalPoolWeightIsZero",
      "msg": "ERROR_ZERO_TOTAL_POOL_WEIGHT"
    },
    {
      "code": 6110,
      "name": "TotalStakingAmountIsZero",
      "msg": "ERROR_ZERO_STAKING_AMOUNT"
    },
    {
      "code": 6111,
      "name": "InvalidClaimId",
      "msg": "ERROR_INVALID_CLAIM_ID"
    },
    {
      "code": 6112,
      "name": "InvalidWithdrawTime",
      "msg": "ERROR_INVALID_WITHDRAW_TIME"
    },
    {
      "code": 6113,
      "name": "InvalidStakeVaultPDA",
      "msg": "ERROR_INVALID_STAKE_VAULT_PDA"
    },
    {
      "code": 6114,
      "name": "InvalidRewardVaultPDA",
      "msg": "ERROR_INVALID_REWARD_VAULT_PDA"
    },
    {
      "code": 6115,
      "name": "InvalidUserAccountPda",
      "msg": "ERROR_INVALID_USER_ACCOUNT_PDA"
    },
    {
      "code": 6116,
      "name": "InsufficientFundsStaked",
      "msg": "ERROR_INSUFFICIENT_FUND_STAKED"
    },
    {
      "code": 6117,
      "name": "StakeIsLocked",
      "msg": "ERROR_TOKEN_IS_LOCKED"
    }
  ]
}