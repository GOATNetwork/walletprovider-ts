/// <reference types="node" />
import { networks } from "bitcoinjs-lib";
import { Network } from "./wallet_provider";
export declare const toNetwork: (network: Network) => networks.Network;
export declare const isSupportedAddressType: (address: string) => boolean;
export declare const isTaproot: (address: string) => boolean;
export declare const getPublicKeyNoCoord: (pkHex: string) => Buffer;
