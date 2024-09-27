/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/assignment.json`.
 */
export type Vault = {
    "address": "J7ysaPjiecQsUpWeGj8ViQGjvXGJF5zRiC4pbvKWEh57",
    "metadata": {
      "name": "assignment",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "deposit",
        "discriminator": [
          242,
          35,
          198,
          137,
          82,
          225,
          242,
          182
        ],
        "accounts": [
          {
            "name": "vault",
            "writable": true
          },
          {
            "name": "userVault",
            "writable": true
          },
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "userTokenAccount",
            "writable": true
          },
          {
            "name": "vaultTokenAccount",
            "writable": true
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initialize",
        "discriminator": [
          175,
          175,
          109,
          31,
          13,
          152,
          155,
          237
        ],
        "accounts": [
          {
            "name": "vault",
            "writable": true,
            "signer": true
          },
          {
            "name": "owner",
            "writable": true,
            "signer": true
          },
          {
            "name": "tokenMint"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "rent",
            "address": "SysvarRent111111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdraw",
        "discriminator": [
          183,
          18,
          70,
          156,
          148,
          109,
          161,
          34
        ],
        "accounts": [
          {
            "name": "vault",
            "writable": true
          },
          {
            "name": "userVault",
            "writable": true
          },
          {
            "name": "owner",
            "writable": true,
            "signer": true
          },
          {
            "name": "userTokenAccount",
            "writable": true
          },
          {
            "name": "vaultTokenAccount",
            "writable": true
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "userVault",
        "discriminator": [
          23,
          76,
          96,
          159,
          210,
          10,
          5,
          22
        ]
      },
      {
        "name": "vault",
        "discriminator": [
          211,
          8,
          232,
          43,
          2,
          152,
          117,
          119
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "insufficientBalance"
      },
      {
        "code": 6001,
        "name": "invalidTokenMint"
      },
      {
        "code": 6002,
        "name": "feeCalculationOverflow"
      }
    ],
    "types": [
      {
        "name": "userVault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "balance",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "pubkey"
            },
            {
              "name": "tokenMint",
              "type": "pubkey"
            },
            {
              "name": "balance",
              "type": "u64"
            },
            {
              "name": "fee",
              "type": "u64"
            }
          ]
        }
      }
    ]
  };