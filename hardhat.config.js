require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-celo");

/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
//   plugins: ["@nomiclabs/hardhat-celo"],

// };
const defaultNetwork = "alfajores";
const mnemonicPath = "m/44'/52752'/0'/0"; // derivation path used by Celo

// This is the mnemonic used by celo-devchain
const DEVCHAIN_MNEMONIC =
    "concert load couple harbor equip island argue ramp clarify fence smart topic";


module.exports = {
  defaultNetwork,
  networks: {
      localhost: {
          url: "http://127.0.0.1:8545",
          accounts: {
              mnemonic: DEVCHAIN_MNEMONIC,
          },
      },
      alfajores: {
          url: "https://alfajores-forno.celo-testnet.org",
          accounts: ["2ca12c78969d1c26b2070753086f436afb3a89a6c5a0576a1d74135d9c0f7958"],
          chainId: 44787,
      },
      celo: {
          url: "https://forno.celo.org",
          accounts: ["2ca12c78969d1c26b2070753086f436afb3a89a6c5a0576a1d74135d9c0f7958"],
          chainId: 42220,
      },
  },
  solidity: {
    version: "0.8.17",
},
}
