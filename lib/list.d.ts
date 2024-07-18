interface IntegratedWallet {
    name: string;
    icon: string;
    wallet: any;
    linkToDocs: string;
    provider?: string;
    isQRWallet?: boolean;
}
export declare const BROWSER_INJECTED_WALLET_NAME = "Browser";
export declare const walletList: IntegratedWallet[];
export {};
