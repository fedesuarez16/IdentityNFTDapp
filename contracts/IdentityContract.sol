// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title IdentityContract
 * @dev This contract allows users to mint and update their identities as ERC721 tokens.
 * Users can store their name, thoughts, happiness status, and a photo associated with their identity.
 * Each identity token is unique and can only be minted once per user.
 */
contract IdentityContract is ERC721 {

    /**
     * @dev Struct to represent an identity.
     * @param name The name of the identity.
     * @param isHappy A boolean indicating whether the identity is happy.
     * @param thoughts Thoughts of the identity, limited to 150 characters.
     * @param photo A string representing the photo URL or hash of the identity's photo.
     * @param owner The address of the identity's owner.
     */
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

    /**
     * @dev Event emitted when a new identity is minted.
     * @param owner The address of the identity's owner.
     * @param tokenId The token ID of the minted identity.
     */
    event IdentityMinted(address indexed owner, uint256 indexed tokenId);

    /**
     * Restrict Identity Update: Add a function modifier or a check to ensure that only the owner of an identity can update its properties.
     */
    modifier onlyIdentityOwner(uint256 tokenId) {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only identity owner can update");
        _;
    }

    /**
     * @dev Constructor to initialize the IdentityContract.
     */
    constructor() ERC721("Identity", "IDT") {
        owner = msg.sender;
    }

    /**
     * @dev Mint a new identity token for the caller.
     * @param _name The name of the identity.
     * @param _thoughts Thoughts of the identity, limited to 150 characters.
     * @param _isHappy A boolean indicating whether the identity is happy.
     * @param _photo A string representing the photo URL or hash of the identity's photo.
     */
    function mintIdentity(
        string memory _name,
        string memory _thoughts,
        bool _isHappy,
        string memory _photo
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_thoughts).length > 0 && bytes(_thoughts).length<= 150, "Thoughts can be at most 150 characters");
        require(!hasMintedIdentity[msg.sender], "Only one identity allowed per user");
        require(bytes(_photo).length>0 && bytes(_photo).length<= 500, "Photo can be at most 500 characters");

        Identity memory identity = Identity(_name, _isHappy, _thoughts, _photo, msg.sender);

        uint256 tokenId = identities.length;
        _mint(msg.sender, tokenId);

        identities.push(identity);
        hasMintedIdentity[msg.sender] = true;

        emit IdentityMinted(msg.sender, tokenId);
    }

    /**
     * @dev Update the thoughts and happiness status of an existing identity token.
     * @param tokenId The token ID of the identity to be updated.
     * @param _thoughts Thoughts of the identity, limited to 150 characters.
     * @param _isHappy A boolean indicating whether the identity is happy.
     */
    function updateIdentity(
        uint256 tokenId,
        string memory _thoughts,
        bool _isHappy
    ) external onlyIdentityOwner(tokenId) {
        require(tokenId > 0 && tokenId <= identities.length, "Invalid token ID");
        Identity storage identity = identities[tokenId - 1];
        identity.thoughts = _thoughts;
        identity.isHappy = _isHappy;
    }

    /**
     * @dev Get all the identities minted in the contract.
     * @return An array containing all the identities.
     */
    function getAllIdentities() external view returns (Identity[] memory) {
        return identities;
    }

    /**
     * @dev Get the details of a specific identity token.
     * @param tokenId The token ID of the identity to retrieve details for.
     * @return name The name of the identity.
     * @return isHappy A boolean indicating whether the identity is happy.
     * @return photo A string representing the photo URL or hash of the identity's photo.
     */
    function getIdentity(uint256 tokenId) external view
        returns (string memory name, bool isHappy, string memory photo) {
        require(tokenId > 0 && tokenId <= identities.length, "Invalid token ID");

        Identity storage identity = identities[tokenId - 1];
        return (identity.name, identity.isHappy, identity.photo);
    }
}
