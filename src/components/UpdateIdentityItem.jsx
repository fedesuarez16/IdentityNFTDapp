import React, { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const UpdateIdentityItem = ({ contract, tokenId }) => {

const[thoughts, setThoughts ] = useState("");
const [isHappy, setIsHappy] = useState(false); 
const [isModalOpen, setIsModalOpen] = useState(false); 


const handleUpdateIdentity = async (e) => {
  e.preventDefault();

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const userAddress = accounts[0];

    // Get the owner address of the identity
    const ownerAddress = await contract.ownerOf(tokenId);

    // Check if the current user is the owner of the identity
    if (userAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
      toast.error("You are not the owner of this identity and cannot update it.");
      return;
    }

    const signer = window.ethereum;
    await signer.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(signer);
    const contractWithSigner = contract.connect(provider.getSigner());

    await contractWithSigner.updateIdentity(tokenId, thoughts, isHappy, { gasLimit: 8000000 });
    toast.success("Identity updated successfully!");
  } catch (error) {
    toast.error("Error updating identity:", error);
  }
};


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
    <button
      className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md shadow-md"
      onClick={handleOpenModal}
    >
      Update State
    </button>
    {isModalOpen && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseModal();
        }
      }}
      >
        <form
          onSubmit={handleUpdateIdentity}
          className="bg-white rounded-lg p-8 shadow-md flex flex-col items-center"
        >
          <span
            className="absolute top-2 right-4  text-white cursor-pointer"
            onClick={handleCloseModal}
          >
            &times;
          </span>
          <label className="mb-4">
            What are you thinking?
            <input
              type="text"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500 w-full mt-2"
            />
          </label>
          <label className="mb-4">
            Are you Happy?:
            <input
              type="checkbox"
              checked={isHappy}
              onChange={(e) => setIsHappy(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700"
          >
            Update Identity
          </button>
        </form>
      </div>
    )}
  </div>

  );
};

export default UpdateIdentityItem;
