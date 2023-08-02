// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract IdentityContract is ERC721 {
    struct Identity {
        string name;
        bool isHappy;
        string thoughts;
        string photo;
        address owner;
    }

    Identity[] private identities;
    address private owner;
    mapping(address => bool) private hasMintedIdentity;
    uint256 private maxIdentities = 100; // Set the maximum number of identities that can be minted

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    constructor() ERC721("Identity", "IDT") {
        owner = msg.sender;
    }

    event IdentityMinted(address indexed owner, uint256 indexed tokenId);

    function mintIdentity(
        string memory _name,
        string memory _thoughts,
        bool _isHappy,
        string memory _photo,
        address _newOwner // New parameter to specify a different address for the new identity owner
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_thoughts).length <= 150, "Thoughts can be at most 150 characters");
        require(identities.length < maxIdentities, "Max number of identities minted");

        if (_newOwner != address(0)) {
            require(!hasMintedIdentity[_newOwner], "The specified address already has an identity");
        } else {
            require(!hasMintedIdentity[msg.sender], "Only one identity allowed per user");
            _newOwner = msg.sender;
        }

        Identity memory identity;
        identity.name = _name;
        identity.thoughts = _thoughts;
        identity.isHappy = _isHappy;
        identity.photo = _photo;
        identity.owner = _newOwner;

        uint256 tokenId = identities.length + 1;
        _mint(_newOwner, tokenId);

        identities.push(identity);
        hasMintedIdentity[_newOwner] = true;

        emit IdentityMinted(_newOwner, tokenId);
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
            identity.photo
        );
    }

    function hasUserMintedIdentity(address user) external view returns (bool) {
        return hasMintedIdentity[user];
    }

    function setMaxIdentities(uint256 _maxIdentities) external onlyOwner {
        maxIdentities = _maxIdentities;
    }
}
