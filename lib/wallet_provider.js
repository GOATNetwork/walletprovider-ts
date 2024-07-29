"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletProvider = exports.Network = void 0;
// supported networks
var Network;
(function (Network) {
    Network["MAINNET"] = "mainnet";
    Network["TESTNET"] = "testnet";
    Network["SIGNET"] = "signet";
    Network["RETEST"] = "regtest";
})(Network || (exports.Network = Network = {}));
/**
 * Abstract class representing a wallet provider.
 * Provides methods for connecting to a wallet, retrieving wallet information, signing transactions, and more.
 */
class WalletProvider {
}
exports.WalletProvider = WalletProvider;
