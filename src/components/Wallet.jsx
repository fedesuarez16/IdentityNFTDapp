import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletInfo = () => {
  const [ethBalance, setEthBalance] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    // Check if the user has an Ethereum wallet available
    if (window.ethereum) {
      const initProvider = async () => {
        try {
          // Enable the Ethereum provider (MetaMask, etc.)
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(newProvider);
          setWalletConnected(true);
        } catch (error) {
          console.error("Error connecting to wallet:", error);
          setWalletConnected(false);
        }
      };

      initProvider();
    } else {
      console.warn("No Ethereum wallet detected.");
      setWalletConnected(false);
    }
  }, []);

  useEffect(() => {
    // Fetch the Ethereum balance from the connected wallet
    const fetchEthBalance = async () => {
      if (provider) {
        const accounts = await provider.listAccounts();
        if (accounts && accounts.length > 0) {
          const ethBalanceWei = await provider.getBalance(accounts[0]);
          const ethBalanceEth = ethers.utils.formatEther(ethBalanceWei);
          setEthBalance(parseFloat(ethBalanceEth));
        }
      }
    };

    fetchEthBalance();
  }, [provider]);

  const disconnectWallet = () => {
    // Disconnect the wallet and reset the state
    setProvider(null);
    setWalletConnected(false);
    setEthBalance(0);
  };

  return (
    <div className="">
    {walletConnected ? (
      <div>
        <p className="text-sm text-gray-100">Your balance: {ethBalance} CELO</p>
        <button 
          onClick={disconnectWallet} 
          className="bg-blue-700 text-white rounded px-4 py-2 mt-2 hover:bg-gray-700 transition-colors duration-300 ease-in-out"
        >
          Disconnect Wallet
        </button>
      </div>
    ) : (
      <p className="text-sm text-red-600">Wallet not connected. Please connect your wallet.</p>
    )}
  </div>
  
  );
};

export default WalletInfo;
