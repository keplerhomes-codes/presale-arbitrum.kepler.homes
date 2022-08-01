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
        "indexed": false,
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fromChainId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "fromNFT",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "fromTokenIds",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      }
    ],
    "name": "ApplyNFT",
    "type": "event"
  },
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
        "indexed": false,
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fromChainId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "tokenFeeRate",
        "type": "bytes32"
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
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      }
    ],
    "name": "ApplyToken",
    "type": "event"
  },
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
        "indexed": false,
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "toToken",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "toTokenIds",
        "type": "uint256[]"
      }
    ],
    "name": "ClaimNFT",
    "type": "event"
  },
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
        "indexed": false,
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "toToken",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ClaimToken",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "fromChainId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "fromNFT",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "fromTokenIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "applyNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "fromChainId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "fromToken",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "applyToken",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "toNFT",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "tokenIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "claimNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "toToken",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "claimToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "name": "getNFTApplyOrder",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "applicant",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "receipient",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "nft",
            "type": "bytes32"
          },
          {
            "internalType": "uint256[]",
            "name": "tokenIds",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct IBridge.NFTOrder",
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
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "name": "getNFTClaimOrder",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "applicant",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "receipient",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "nft",
            "type": "bytes32"
          },
          {
            "internalType": "uint256[]",
            "name": "tokenIds",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct IBridge.NFTOrder",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSupportedNFTs",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "nfts",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSupportedTokens",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "name": "getTokenApplyOrder",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "applicant",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "receipient",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "token",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IBridge.TokenOrder",
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
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "name": "getTokenClaimOrder",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "applicant",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "receipient",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "token",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IBridge.TokenOrder",
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
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "fromChainId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "fromNFT",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "fromTokenIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "keccak256ApplyNFTArgs",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "fromChainId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "fromToken",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "keccak256ApplyTokenArgs",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "toNFT",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "tokenIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "keccak256ClaimNFTArgs",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "applicant",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "receipient",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "toChainId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "toToken",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "keccak256ClaimTokenArgs",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nftFee",
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
    "name": "nftFeeCurrency",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenFeeRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]