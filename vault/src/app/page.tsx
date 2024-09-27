'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { getProgram } from '@/utils/anchorProgram';

// Dynamically import WalletMultiButton to disable SSR
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const VaultPage = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Public keys for token accounts and program (fixed ones)
  const userTokenAccountPublicKey = new PublicKey("DbT1dhnjUbVbybDMP1dryFF1LEJSm7F3s5XuLSv799rD");
  const vaultTokenAccountPublicKey = new PublicKey("Ee9f4ZsLH92gVrUrynGu1CA7fjbhkMh15ixubtTNQEma");
  const tokenProgramPublicKey = new PublicKey("AYNDRfHivMY9ggdWnLgVsMBiZFMPYmKyq26oDwZbG5gW");

  const [vaultPublicKey, setVaultPublicKey] = useState<PublicKey | null>(null);
  const [userVaultPublicKey, setUserVaultPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (publicKey) {
      derivePublicKeys();
      fetchUserBalance();
    }
  }, [publicKey]);

  const derivePublicKeys = async () => {
    if (!publicKey) return;

    try {
      const program = getProgram();
      if (!program) {
        throw new Error('Program is null');
      }

      // Derive the vault public key (vaultPda) using seed
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), publicKey.toBuffer()],
        program.programId
      );
      setVaultPublicKey(vaultPda);

      // Derive the user vault public key (userVaultPda) using seed
      const [userVaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from("uservault"), publicKey.toBuffer(), vaultPda.toBuffer()],
        program.programId
      );
      setUserVaultPublicKey(userVaultPda);
    } catch (error) {
      console.error('Error deriving public keys:', error);
      setErrorMessage('Failed to derive public keys.');
    }
  };

  const fetchUserBalance = async () => {
    if (!publicKey || !userVaultPublicKey) return;

    const provider = new AnchorProvider(connection, { publicKey, signTransaction } as any, { preflightCommitment: 'confirmed' });
    const program = getProgram();

    if (!program) {
      console.error('Program is null');
      setErrorMessage('Failed to fetch program. Please try again later.');
      return;
    }

    try {
      const userVaultAccount = await program.account.userVault.fetch(userVaultPublicKey);
      setBalance(userVaultAccount.balance.toNumber());
      setErrorMessage(null);
    } catch (error) {
      console.error('Failed to fetch balance', error);
      setErrorMessage('Failed to fetch balance. Please ensure your wallet is connected and try again.');
    }
  };

  const handleDeposit = async () => {
    if (!publicKey || !vaultPublicKey || !userVaultPublicKey) return;

    const provider = new AnchorProvider(connection, { publicKey, signTransaction } as any, { preflightCommitment: 'confirmed' });
    const program = getProgram();

    if (!program) {
      console.error('Program is null');
      setErrorMessage('Failed to fetch program. Please try again later.');
      return;
    }

    try {
      setTransactionStatus("Processing deposit...");
      await program.rpc.deposit(new BN(amount), {
        accounts: {
          vault: vaultPublicKey,
          userVault: userVaultPublicKey,
          user: publicKey,
          userTokenAccount: userTokenAccountPublicKey,
          vaultTokenAccount: vaultTokenAccountPublicKey,
          tokenProgram: tokenProgramPublicKey,
        },
      });
      setTransactionStatus("Deposit successful!");
      fetchUserBalance(); // Update balance after deposit
    } catch (error) {
      console.error('Deposit failed', error);
      setErrorMessage('Deposit failed. Please check your inputs and try again.');
      setTransactionStatus(null);
    }
  };

  const handleWithdraw = async () => {
    if (!publicKey || !vaultPublicKey || !userVaultPublicKey) return;

    const program = getProgram();

    if (!program) {
      console.error('Program is null');
      setErrorMessage('Failed to fetch program. Please try again later.');
      return;
    }

    try {
      setTransactionStatus("Processing withdrawal...");
      await program.rpc.withdraw(new BN(amount), {
        accounts: {
          vault: vaultPublicKey,
          userVault: userVaultPublicKey,
          owner: publicKey,
          userTokenAccount: userTokenAccountPublicKey,
          vaultTokenAccount: vaultTokenAccountPublicKey,
          tokenProgram: tokenProgramPublicKey,
        },
      });
      setTransactionStatus("Withdrawal successful!");
      fetchUserBalance(); // Update balance after withdrawal
    } catch (error) {
      console.error('Withdrawal failed', error);
      setErrorMessage('Withdrawal failed. Please check your inputs and try again.');
      setTransactionStatus(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Your Balance: {balance}</h1>
        <WalletMultiButton />
      </div>
      <div className="flex flex-col items-center w-full max-w-md">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between w-full">
          <button
            onClick={handleDeposit}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none"
          >
            Deposit
          </button>
          <button
            onClick={handleWithdraw}
            className="px-4 py-2 text-white bg-red-500 rounded-lg shadow hover:bg-red-600 focus:outline-none"
          >
            Withdraw
          </button>
        </div>
      </div>
      {transactionStatus && (
        <p className="mt-4 text-green-600">{transactionStatus}</p>
      )}
      {errorMessage && (
        <p className="mt-2 text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default VaultPage;
