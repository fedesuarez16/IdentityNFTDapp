import React, { useEffect, useState } from "react";
import UpdateIdentityItem from "./UpdateIdentityItem";

const ListIdentities = ({ contract }) => {
  const [identities, setIdentities] = useState([]);

  useEffect(() => {
    const fetchIdentities = async () => {
      try {
        const allIdentities = await contract.getAllIdentities();
        setIdentities(allIdentities);
      } catch (error) {
        console.error("Error fetching identities:", error);
      }
    };

    if (contract) {
      fetchIdentities();

      if (contract) {
        fetchIdentities();
  
        // Listen for the IdentityMinted event and update state
        contract.on("IdentityMinted", (owner, tokenId) => {
          console.log("IdentityMinted event received:", owner, tokenId);
          fetchIdentities();
        });
  
        return () => {
          // When the component unmounts, stop listening for the event
          contract.removeAllListeners("IdentityMinted");
        };
      }
    }
  }, [contract]);

  const fetchImageFromIPFS = async (ipfsHash) => {
    try {
      // Fetch the image data from IPFS
      const response = await fetch({ipfsHash} );
      if (!response.ok) {
        throw new Error("Failed to fetch image from IPFS");
      }
      const imageData = await response.arrayBuffer();

      // Convert the image data to Base64
      const base64Image = btoa(
        new Uint8Array(imageData).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // Construct the data URL for the image
      const imageURL = `data:image/jpeg;base64,${base64Image}`;
      return imageURL;
    } catch (error) {
      console.error("Error fetching image from IPFS:", error);
      return null;
    }
  };

  return (
    <div className="px-4 py-8">
    <h2 className="text-3xl font-semibold text-white mb-6">Identities:</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {identities.map((identity, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center overflow-auto hover:shadow-lg transition duration-300"
        >
          {identity.photo && (
            <div className="w-40 h-40 mb-4 rounded-full overflow-hidden border-4 border-blue-600">
              <img
                src={fetchImageFromIPFS(identity.photo)}
                alt="Identity"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-xl font-semibold">{identity.name}</p>
          <p className="text-sm text-gray-600 truncate w-44">{identity.owner}</p>
          <div className="mt-2 flex items-center">
            <p className="mr-2">Feeling:</p>
            <p className={identity.isHappy ? "text-green-600" : "text-red-600"}>
              {identity.isHappy ? "Happy" : "Sad"}
            </p>
          </div>
          <p className="mt-2 text-sm text-gray-600 w-52">
           <strong>Thoughts:</strong>{identity.thoughts}
          </p>
          <UpdateIdentityItem contract={contract} tokenId={index + 1} />
        </div>
      ))}
    </div>
  </div>
);
};


export default ListIdentities;
