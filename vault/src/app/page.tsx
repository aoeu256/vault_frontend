'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { getProgram } from '@/utils/anchorProgram';

const VaultPage = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Public keys for your smart contract and token accounts
  const vaultPublicKey = new PublicKey("Ee9f4ZsLH92gVrUrynGu1CA7fjbhkMh15ixubtTNQEma");
  const userVaultPublicKey = new PublicKey("5VFB3EhNtTusXfNEEVcjTgWXT8jNUHHyGnUj8FySKKSu");
  const userTokenAccountPublicKey = new PublicKey("5VFB3EhNtTusXfNEEVcjTgWXT8jNUHHyGnUj8FySKKSu");
  const vaultTokenAccountPublicKey = new PublicKey("Ee9f4ZsLH92gVrUrynGu1CA7fjbhkMh15ixubtTNQEma");
  const tokenProgramPublicKey = new PublicKey("Ee9f4ZsLH92gVrUrynGu1CA7fjbhkMh15ixubtTNQEma");

  useEffect(() => {
    if (publicKey) {
      fetchUserBalance();
    }
  }, [publicKey]);

  const fetchUserBalance = async () => {
    if (!publicKey) return;

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
    if (!publicKey) return;

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
    if (!publicKey) return;

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
