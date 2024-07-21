import { WalletProvider, Network, Fees, UTXO } from "../wallet_provider";
export declare class BitcoinCoreWallet extends WalletProvider {
    private client;
    constructor(walletName: string, host: string, port: number, username: string, password: string, network: string);
    dumpPrivKey(address?: string): Promise<import("ecpair").ECPairInterface>;
    getTransaction(txid: string): Promise<any>;
    connectWallet(): Promise<this>;
    getNetwork(): Promise<Network>;
    on(eventName: string, callBack: () => void): void;
    getWalletProviderName(): Promise<string>;
    getAddress(): Promise<string>;
    getNewAddress(): Promise<string>;
    getPublicKeyHex(): Promise<string>;
    getPublicKey(address: string): Promise<string>;
    signPsbtFromBase64(psbtBase64: string, ecPairs: any[], shouldExtractTransaction: boolean): Promise<any>;
    mine(num: number, addr: string): Promise<void>;
    signPsbt(psbtHex: string): Promise<string>;
    signPsbts(psbtsHexes: string[]): Promise<string[]>;
    signMessageBIP322(message: string): Promise<string>;
    getNetworkFees(): Promise<Fees>;
    getBalance(): Promise<number>;
    pushTx(txHex: string): Promise<string>;
    getUtxos(address: string, amount?: number, needGetRawTransaction?: boolean): Promise<UTXO[]>;
    getRawTransaction(txid: string): Promise<string>;
    getBTCTipHeight(): Promise<number>;
}
export declare let bitcoinWallet: BitcoinCoreWallet;
export declare const initBitcoinCoreWallet: (walletName: string, host: string, port: number, username: string, password: string, network: string) => BitcoinCoreWallet;
