"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletList = exports.BROWSER_INJECTED_WALLET_NAME = void 0;
// Special case for the browser wallet. i.e injected wallet
exports.BROWSER_INJECTED_WALLET_NAME = "Browser";
exports.walletList = [
    {
        name: exports.BROWSER_INJECTED_WALLET_NAME,
        icon: "",
        wallet: "",
        provider: "",
        linkToDocs: "",
    },
];
