export default {
  "version": "0.1.0",
  "name": "bridge",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
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
          "name": "signer",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "tokenFeeRate",
          "type": "u64"
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
          "name": "token",
          "isMut": false,
          "isSigner": false
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
      "name": "applyToken",
      "accounts": [
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
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
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ixSysvar",
          "isMut": false,
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
          "name": "orderId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "applicant",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "receipient",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "fromChainId",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        },
        {
          "name": "fromToken",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        },
        {
          "name": "toChainId",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        },
        {
          "name": "deadline",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "claimToken",
      "accounts": [
        {
          "name": "globalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
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
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ixSysvar",
          "isMut": false,
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
          "name": "orderId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "applicant",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "receipient",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "toChainId",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        },
        {
          "name": "toToken",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        },
        {
          "name": "deadline",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "GlobalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "tokenFeeRate",
            "type": "u64"
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
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "tokenApplies",
            "type": {
              "vec": {
                "defined": "TokenApply"
              }
            }
          },
          {
            "name": "tokenClaims",
            "type": {
              "vec": {
                "defined": "TokenClaim"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TokenApply",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "amount",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "TokenClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "amount",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "BridgeErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SignatureVerificationFailed"
          },
          {
            "name": "TransactionExpired"
          },
          {
            "name": "DuplicatedOrderId"
          },
          {
            "name": "InvalidAccess"
          },
          {
            "name": "InvalidVaultPDA"
          }
        ]
      }
    }
  ],
  "metadata": {
    "address": "AaYvypao2X3E44EzkuytSR1MbD3cF2UTRn4nNiYoZQLE"
  }
}