import React, { useState } from "react";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IdentityForm = ({ contract }) => {
  const [name, setName] = useState("");
  const [credentials, setCredentials] = useState("");
  const [achievements, setAchievements] = useState("");
  const [isHappy, setIsHappy] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleMintIdentity = async (event) => {
    event.preventDefault();

    try {
      const signer = window.ethereum;
      await signer.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(signer);
      const contractWithSigner = contract.connect(provider.getSigner());

      let photoUrl = "";
      if (photo) {
        try {
          // Upload the photo to Web3Storage
          const web3Storage = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhkM0Y5ZUU0MDI3OWYwYjcxRTZiN0FkY0RDOTEzZjJhMjBENEYyMkQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTA0ODkyMTU0NzQsIm5hbWUiOiIyMDEifQ.tNb9vinJZIY28zHhI4OMT4-_tSI9HUtLPDE-K9Z17n0" });
          const  cid  = await web3Storage.put([photo]);
            console.log("Photo uploaded. CID:", cid);

          photoUrl = `https://${cid}.ipfs.dweb.link`;
        } catch (uploadError) {
          console.error("Error uploading photo to Web3Storage:", uploadError);
        }
      }

      await contractWithSigner.mintIdentity(name, thoughts.substring(0, 150), isHappy, photoUrl);
      console.log("Identity minted successfully!");

      toast.success("Identity minted successfully!");


      // Reset form fields
      setName("");
      setCredentials("");
      setAchievements("");
      setIsHappy("");
      setThoughts("");
      setPhoto(null);
    } catch (error) {
      toast.error("Error minting identity:", error);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setPhoto(file);
  };

  return (
    <div className="bg-white p-4 text-start rounded-lg shadow-lg m-2">
    <h2 className="text-xl font-semibold mb-4">Mint Identity</h2>
    <form onSubmit={handleMintIdentity}>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Name:</label>
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
      <label className="block text-gray-700 font-semibold">Photo:</label>
          <input
            type="file"
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500 w-full"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>     
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Is Happy?</label>
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          checked={isHappy}
          onChange={(e) => setIsHappy(e.target.checked)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">What are you thinking?</label>
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500 w-full"
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
      >
        Mint Identity
      </button>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnFocusLoss draggable pauseOnHover />

    </form>
  </div>
  );
};

export default IdentityForm;
