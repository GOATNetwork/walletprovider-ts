interface IntegratedWallet {
  name: string;
  icon: string;
  wallet: any;
  linkToDocs: string;
  provider?: string;
  isQRWallet?: boolean;
}

// Special case for the browser wallet. i.e injected wallet
export const BROWSER_INJECTED_WALLET_NAME = "Browser";

export const walletList: IntegratedWallet[] = [
  {
    name: BROWSER_INJECTED_WALLET_NAME,
    icon: "",
    wallet: "",
    provider: "",
    linkToDocs: "",
  },
];
