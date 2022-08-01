export default   [
    {
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "merkleProof",
          "type": "bytes32[]"
        }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "claimer",
          "type": "address"
        }
      ],
      "name": "isClaimed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "queryClaimers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "claimers",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "queryVariables",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "merkleRoot",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "rewardToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "rewardAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalRewardAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalClaimedRewardAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startCliamTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endClaimTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]