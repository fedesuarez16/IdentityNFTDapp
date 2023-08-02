// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract IdentityContract is ERC721 {
    struct Identity {
        string name;
        bool isHappy;
        string thoughts;
        string photo; // Add the photo parameter
        address owner; // Store the owner's address for each identity
    }

    Identity[] private identities;
    address private owner;
    mapping(address => bool) private hasMintedIdentity; // Mapping to track whether a user has minted an identity

    constructor() ERC721("Identity", "IDT") {
        owner = msg.sender;
    }

    event IdentityMinted(address indexed owner, uint256 indexed tokenId);

    function mintIdentity(
        string memory _name,
        string memory _thoughts,
        bool _isHappy,
        string memory _photo // Add the photo parameter
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_thoughts).length <= 150, "Thoughts can be at most 150 characters");
        require(!hasMintedIdentity[msg.sender], "Only one identity allowed per user");

        Identity memory identity;
        identity.name = _name;
        identity.thoughts = _thoughts;
        identity.isHappy = _isHappy;
        identity.photo = _photo;

        identity.owner = msg.sender;

        uint256 tokenId = identities.length + 1;
        _mint(msg.sender, tokenId);

        identities.push(identity);
        hasMintedIdentity[msg.sender] = true; // Mark the user as having minted an identity

        emit IdentityMinted(msg.sender, tokenId); // Emit the event with the address and tokenId of the minted identity
    }

     function updateIdentity(
        uint256 tokenId,
        string memory _thoughts,
        bool _isHappy
    ) external {
        require(tokenId > 0 && tokenId <= identities.length, "Invalid token ID");
        Identity storage identity = identities[tokenId - 1];
        require(identity.owner == msg.sender, "Not the owner of the identity");
        identity.thoughts = _thoughts;  
        identity.isHappy = _isHappy;
    }

    function getAllIdentities() external view returns (Identity[] memory) {
        return identities;
    }

    function getIdentity(uint256 tokenId) external view
        returns (string memory, bool,  string memory )  {
        require(tokenId > 0 && tokenId <= identities.length, "Invalid token ID");

        Identity storage identity = identities[tokenId - 1];
        return (
            identity.thoughts,
            identity.isHappy,
            identity.photo // Return the photo parameter
        );
    }
}
