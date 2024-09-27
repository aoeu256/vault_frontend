import { useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, Idl, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { Vault } from "@/types/Vault"; // assuming you've correctly typed Vault
import idl from "./vault.json";

export function useProgram(): Program<Vault> | null {
  const { connection } = useConnection();  // Correct destructuring
  const wallet = useAnchorWallet();

  // Memoize the program instance to avoid re-creating it on every render
  return useMemo(() => {
    if (!wallet) {
      console.error("Wallet is not connected");
      return null;
    }

    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    const program = new Program(idl as Idl, provider) as unknown as Program<Vault>;
    return program;
  }, [wallet, connection]);
}
