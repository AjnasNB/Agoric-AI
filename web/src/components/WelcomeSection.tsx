import React from 'react';
import { Wallet } from 'lucide-react';

export const WelcomeSection: React.FC = () => {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 xl:p-12 items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-12 h-12 xl:w-16 xl:h-16 text-white" />
          </div>
        </div>
        <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4">Welcome to Agori AI</h1>
        <p className="text-blue-100 text-base xl:text-lg max-w-md mx-auto">
        AI that will do multi chain operation for you.
        </p>
      </div>
    </div>
  );
};