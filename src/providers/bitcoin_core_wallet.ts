const Client = require("bitcoin-core");
import {
  WalletProvider,
  Network,
  Fees,
  UTXO
} from "../wallet_provider";

import * as ecc from "tiny-secp256k1";
import ECPairFactory from "ecpair";
const bitcoin = require("bitcoinjs-lib");

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

function convertBtcKvBToSatoshiPerByte(btcPerKvB: number) {
  const satoshiPerKB = btcPerKvB * 100000000; // BTC/kvB to satoshi/kB
  const satoshiPerByte = satoshiPerKB / 1000; // satoshi/kB to satoshi/byte
  return satoshiPerByte;
}

export class BitcoinCoreWallet extends WalletProvider {
  private client: any;

  constructor(walletName: string, host:string, port: number, username: string, password: string, network: string) {
    super();
    this.client = new Client({
      wallet: walletName,
      network,
      username,
      password,
      host,
      port
    });
    // this.client.walletPassphrase("btcstaker", 3600);
  }

  async walletPassphrase(passphrase: string, timeout: number) {
    return await this.client.walletPassphrase(passphrase, timeout);
  }

  async dumpPrivKey(address?: string) {
     let addr = address || await this.getAddress();
     let privateKey = await this.client.dumpPrivKey(addr);
    return ECPair.fromWIF(privateKey, bitcoin.networks.regtest);
  }

  async getTransaction(txid: string): Promise<any> {
      return await this.client.getTransaction(txid);
  }

  async connectWallet(): Promise<this> {
    "use server";
    // Attempt to get the wallet info to check if the client can connect to the node
    try {
      const walletInfo = await this.client.getWalletInfo();
      return walletInfo;
      // return this;
    } catch (error) {
      throw new Error("Failed to connect to Bitcoin Core: " + (error as Error).message);
    }
  }

  async getNetwork() {
    return Network.RETEST;
  }

  on(eventName: string, callBack: () => void) {
    this.client.on(eventName, callBack);
  }

  async getWalletProviderName(): Promise<string> {
    return "bitcoin_core";
  }

  async getAddress(): Promise<string> {
    // Check if an address with a specific label exists
    const label = "primary";
    const addresses = await this.client.listReceivedByAddress();
    if (addresses.length > 0 && addresses[0].address) {
      return addresses[0].address;
    } else {
      // If no address with this label, create a new taproot address and label it
      const newAddress = await this.client.getNewAddress(label, "bech32");
      return newAddress;
    }
  }

  async getNewAddress(): Promise<string> {
    // Check if an address with a specific label exists
    const label = "primary";
    const addresses = await this.client.listReceivedByAddress(0, true, true, label);
    if (addresses.length > 0 && addresses[0].address) {
      return addresses[0].address;
    } else {
      // If no address with this label, create a new taproot address and label it
      const newAddress = await this.client.getNewAddress(label, "bech32m");
      return newAddress;
    }
  }

  async getPublicKeyHex(): Promise<string> {
    // Example of retrieving the public key of the first address in the wallet
    const address = await this.getAddress();
    const validateAddressInfo = await this.client.validateAddress(address);
    return validateAddressInfo.pubkey;
  }

  async getPublicKey(address: string): Promise<string> {
    // Example of retrieving the public key of the first address in the wallet
    const res = await this.client.getAddressInfo(address);
    return res.pubkey;
  }

  async walletCreateFundedPsbt({
    inputs,
    outputs
  }: {
    inputs: []
    outputs: Record<string, number>[]
  }): Promise<{ psbt: string }> {
    return this.client.walletCreateFundedPsbt({ inputs, outputs })
  }

  async finalizePsbt(
    psbtHex: string
  ): Promise<{ psbt: string; hex: string; complete: boolean }> {
    let psbt = Buffer.from(psbtHex, "hex").toString("base64");
    return this.client.finalizePsbt(psbt)
  }

  async mine(num: number, addr: string) {
      await this.client.generateToAddress(num, addr)
  }

  async decodePsbt(psbtHex: string) {
    return this.client.decodePsbt(Buffer.from(psbtHex, "hex").toString("base64"));
  }

  async signPsbt(psbtHex: string): Promise<string> {
    const signedPsbt = await this.client.walletProcessPsbt(Buffer.from(psbtHex, "hex").toString("base64"));

    if (!signedPsbt.complete) {
      console.error("PSBT signing incomplete");
    }

    return Buffer.from(signedPsbt.psbt, "base64").toString("hex");
  }

  async combinePsbt(txsHex: string[]): Promise<string> {
    const txsBase64 = txsHex.map((x) => Buffer.from(x, "hex").toString("base64"))
    let combinedPsbt = await this.client.combinePsbt(txsBase64);
    return Buffer.from(combinedPsbt.psbt, "base64").toString("hex");
  }

  async signPsbts(psbtsHexes: string[]): Promise<string[]> {
    const signedPsbts = [];
    for (const psbtHex of psbtsHexes) {
      const signedPsbt = await this.signPsbt(psbtHex);
      signedPsbts.push(signedPsbt);
    }
    return signedPsbts;
  }

  async signMessageBIP322(message: string): Promise<string> {
    // Using the address derived for the wallet
    const address = await this.getAddress();
    const signature = await this.client.signMessage(address, message);
    return signature;
  }

  async getNetworkFees(): Promise<Fees> {
    const result = await this.client.estimateSmartFee(6); // 6 is the number of blocks for confirmation target
    const satoshis = convertBtcKvBToSatoshiPerByte(result.feerate);
    return {
      fastestFee: 1000, // Convert appropriately if needed 0.01
      halfHourFee: satoshis,
      hourFee: satoshis,
      economyFee: satoshis,
      minimumFee: satoshis
    };
  }


  // Implement other methods using bitcoin-core client
  // For example:
  async getBalance(): Promise<number> {
    return this.client.getBalance();
  }

  async pushTx(txHex: string): Promise<string> {
    return this.client.sendRawTransaction(txHex);
  }

  async getUtxos(address: string, amount?: number, needGetRawTransaction: boolean = false): Promise<UTXO[]> {
    const utxos = await this.client.listUnspent(1, 9999999, [address]);
    const filteredUtxos = utxos.map((utxo: any) => ({
      txid: utxo.txid,
      vout: utxo.vout,
      value: utxo.amount * 1e8, // Convert BTC to satoshis
      scriptPubKey: utxo.scriptPubKey
    }));

    if (amount) {
      let totalAmount = 0;
      const result: UTXO[] = [];

      for (const utxo of filteredUtxos) {
        totalAmount += utxo.value;
        result.push(utxo);
        if (totalAmount >= amount) break; // Only accumulate enough UTXOs to cover the amount
      }

      if (totalAmount < amount) {
        return []; // Not enough funds
      }

      let promises = [];

      if (needGetRawTransaction) {
        promises = result.map(async (utxo) => {
          const transaction = await this.client.getTransaction(utxo.txid);
          return { ...utxo, rawTransaction: transaction.hex };
        });
      } else {
        promises = result.map(async (utxo) => {
          return { ...utxo };
        });
      }
      // Fetch raw transactions only for the necessary UTXOs


      return await Promise.all(promises);
    }

    // If no specific amount is requested, return all UTXOs without fetching raw transactions
    return filteredUtxos;
  }

  async getRawTransaction(txid: string): Promise<string> {
    return this.client.getRawTransaction(txid);
  }
  async getBTCTipHeight(): Promise<number> {
    const blockchainInfo = await this.client.getBlockchainInfo();
    return blockchainInfo.blocks;
  }
}

export let bitcoinWallet: BitcoinCoreWallet;

export const initBitcoinCoreWallet = (walletName: string, host: string, port: number, username: string, password: string, network: string) => {
  bitcoinWallet = new BitcoinCoreWallet(walletName, host, port, username, password, network);
  return bitcoinWallet;
};
