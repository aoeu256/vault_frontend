import WalletContextProvider from "@/components/WalletProvider";

export const metadata = {
  title: "Solana Vault",
  description: "Interact with Solana Vault Contract",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}