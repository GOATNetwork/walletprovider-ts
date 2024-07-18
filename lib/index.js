"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicKeyNoCoord = exports.isTaproot = exports.isSupportedAddressType = exports.toNetwork = void 0;
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const wallet_provider_1 = require("./wallet_provider");
const nativeSegwitAddressLength = 42;
const taprootAddressLength = 62;
const toNetwork = (network) => {
    switch (network) {
        case wallet_provider_1.Network.MAINNET:
            return bitcoinjs_lib_1.networks.bitcoin;
        case wallet_provider_1.Network.TESTNET:
        case wallet_provider_1.Network.SIGNET:
            return bitcoinjs_lib_1.networks.testnet;
        case wallet_provider_1.Network.RETEST:
            return bitcoinjs_lib_1.networks.regtest;
        default:
            throw new Error("Unsupported network");
    }
};
exports.toNetwork = toNetwork;
const isSupportedAddressType = (address) => {
    return (address.length === nativeSegwitAddressLength ||
        address.length === taprootAddressLength);
};
exports.isSupportedAddressType = isSupportedAddressType;
const isTaproot = (address) => {
    return address.length === taprootAddressLength;
};
exports.isTaproot = isTaproot;
const getPublicKeyNoCoord = (pkHex) => {
    const publicKey = Buffer.from(pkHex, "hex");
    return publicKey.subarray(1, 33);
};
exports.getPublicKeyNoCoord = getPublicKeyNoCoord;
