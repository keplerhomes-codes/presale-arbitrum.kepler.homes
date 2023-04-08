export default  [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "referrer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "currency",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "currencyAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "usdAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lockPeriods",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "BuyEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ClaimEvent",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "usdToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "usdAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "referrer",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "queryBuyRecords",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "referrer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "vTokenAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "feeToken",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "feeTokenAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referrerReward",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "buyTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lockPeriods",
            "type": "uint256"
          }
        ],
        "internalType": "struct IPresale.BuyRecord[]",
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
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "claimIndex",
        "type": "uint256"
      }
    ],
    "name": "queryClaimAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "claimAmount",
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
        "name": "user",
        "type": "address"
      }
    ],
    "name": "queryClaimables",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IPresale.Claimable[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "queryConfig",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "claimStartTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "commissionRate",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "vToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "feeWallet",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "saleAmountPerRound",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimInterval",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minBuyAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxBuyAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "refeererMinBuyAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IPresale.Config",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "queryRoundPrices",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "querySaledUsdAmount",
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
    "inputs": [],
    "name": "queryStableCoins",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "stableCoins",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]