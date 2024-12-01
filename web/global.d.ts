// global.d.ts
interface Window {
    keplr?: {
      enable: (chainId: string) => Promise<void>;
      getOfflineSigner: (chainId: string) => any;
    };
  }
  