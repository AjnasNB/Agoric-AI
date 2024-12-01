import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MetaMaskButton } from './MetaMaskButton';

export const LoginForm: React.FC = () => {
  const { connectWallet, walletAddress, isConnecting } = useAuth();

  return (
    <div className="flex h-screen flex-col items-center justify-center w-full m lg:py-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">Welcome</h2>
        <p className="mt-3 text-lg text-gray-600">Connect your wallet to get started</p>
      </div>

      <div className="mt-10 px-6 py-8 bg-white w-full">
        <div className="flex flex-col items-center">
          <MetaMaskButton
            onClick={connectWallet}
            isConnecting={isConnecting}
            address={walletAddress}
          />
          
         
        </div>
      </div>
    </div>
  );
};