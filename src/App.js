import React, { useEffect, useState } from "react";
import { Wallet, ethers } from "ethers";
import IdentityContract from "./abis/IdentityContract.json";
import IdentityForm from "./components/IdentityForm";
import IdentityList from "./components/ListIdentities";
import "./styles.css"
import WalletInfo from "./components/Wallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Navbar from "./components/Navbar";


const App = () => {
  const [contract, setContract] = useState(null);
  const [tokenId, setTokenId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 



  useEffect(() => {
    const initialize = async () => {
      try {
        // Connect to the Celo network
        const provider = new ethers.providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
        console.log("Provider:", provider);


        const contractAddress = "0x751e088E59A76dc5A8df0cdd52F8D60d42898874";

        // Print the network object to the console
        console.log("Connected to network:", await provider.getNetwork());

        // Create the contract instance
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, IdentityContract.abi, provider);

        setContract(contract);
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initialize();
  }, []);


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="custom-gradient-blur p-4 h-auto bg-opacity-70 backdrop-blur-lg backdrop-filter bg-gradient-to-b from-blue-500 to-blue-700  text-center py-12">
       <ToastContainer  position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnFocusLoss draggable pauseOnHover />
       <Navbar/>
      <button
        onClick={handleOpenModal}
        className="bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 border border-blue-800 transition-colors duration-300"
      >
        Mint your NFTidentity
      </button>
      {contract && isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <IdentityForm contract={contract} />
          </div>
        </div>
      )}
      <IdentityList contract={contract} />
    </div>
  );
};

export default App;