'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';

export const WalletConnectButton: FC = () => {
  const { wallet, connected } = useWallet();

  return (
    <div className="flex items-center">
      <WalletMultiButton className="!bg-gray-100 !text-[#333] !rounded-xl !shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:!shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] !transition-all !duration-200 !text-lg !font-semibold !px-6 !py-3" />
      {connected && wallet && (
        <div className="ml-3 text-sm text-gray-600">
          Connected to {wallet.adapter.name}
        </div>
      )}
    </div>
  );
}; 