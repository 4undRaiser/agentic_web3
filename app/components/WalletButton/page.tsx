"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

export default function WalletButton() {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <WalletMultiButton className="!bg-gray-100 !text-gray-700 !rounded-lg !shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:!shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] !transition-all !duration-200 !font-medium" />
    </div>
  );
} 